#!/usr/bin/env python3
"""
ETROYL Header Logo Migration Tool

Updates the site-header logo across generated/static HTML files.

Migration:
    /assets/img/logo.webp       -> /assets/img/logo-mono.webp
    width="778"                -> width="978"
    height="399"               -> height="978"
    href="/"                   -> href="{{root_dir}}"

Only <img> elements with class="logo-mark" are considered.
The corresponding enclosing <a class="logo"> is updated only when it
is part of the ETROYL site header.

Usage:
    python tools/update_header_logo.py --dry-run
    python tools/update_header_logo.py
    python tools/update_header_logo.py --root /path/to/website
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

OLD_SRC = "/assets/img/logo.webp"
NEW_SRC = "/assets/img/logo-mono.webp"

OLD_WIDTH = "778"
NEW_WIDTH = "978"

OLD_HEIGHT = "399"
NEW_HEIGHT = "978"

NEW_HOME_HREF = "{{root_dir}}"

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent


# ---------------------------------------------------------------------------
# Regular expressions
# ---------------------------------------------------------------------------

# Matches an <img> element containing class="logo-mark".
# The expression deliberately allows arbitrary attribute order and
# whitespace/newlines.
LOGO_IMG_RE = re.compile(
    r"<img\b(?=[^>]*\bclass\s*=\s*([\"'])[^\"']*\blogo-mark\b[^\"']*\1)"
    r"[^>]*>",
    re.IGNORECASE | re.DOTALL,
)

# Matches the enclosing site-header block.
SITE_HEADER_RE = re.compile(
    r"<header\b(?=[^>]*\bclass\s*=\s*([\"'])[^\"']*\bsite-header\b[^\"']*\1)"
    r"[^>]*>.*?</header\s*>",
    re.IGNORECASE | re.DOTALL,
)

# Matches the logo anchor.
LOGO_ANCHOR_RE = re.compile(
    r"<a\b(?=[^>]*\bclass\s*=\s*([\"'])[^\"']*\blogo\b[^\"']*\1)"
    r"[^>]*>",
    re.IGNORECASE | re.DOTALL,
)

# Generic quoted HTML attribute.
ATTR_RE_TEMPLATE = r'(\b{attribute}\s*=\s*)(["\']){value}(["\'])'


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def replace_attribute(
    tag: str,
    attribute: str,
    old_value: str,
    new_value: str,
) -> tuple[str, bool]:
    """
    Replace one exact HTML attribute value.

    Returns:
        (updated_tag, changed)
    """
    pattern = re.compile(
        ATTR_RE_TEMPLATE.format(
            attribute=re.escape(attribute),
            value=re.escape(old_value),
        ),
        re.IGNORECASE,
    )

    updated, count = pattern.subn(
        lambda match: (
            f"{match.group(1)}{match.group(2)}"
            f"{new_value}"
            f"{match.group(3)}"
        ),
        tag,
        count=1,
    )

    return updated, count > 0


def update_logo_image(img_tag: str) -> tuple[str, list[str]]:
    """
    Update the logo-mark <img> element.

    Returns:
        (updated_tag, list_of_changes)
    """
    changes: list[str] = []
    updated = img_tag

    # Source
    updated, changed = replace_attribute(
        updated,
        "src",
        OLD_SRC,
        NEW_SRC,
    )
    if changed:
        changes.append(f"src: {OLD_SRC} -> {NEW_SRC}")

    # Width
    updated, changed = replace_attribute(
        updated,
        "width",
        OLD_WIDTH,
        NEW_WIDTH,
    )
    if changed:
        changes.append(f"width: {OLD_WIDTH} -> {NEW_WIDTH}")

    # Height
    updated, changed = replace_attribute(
        updated,
        "height",
        OLD_HEIGHT,
        NEW_HEIGHT,
    )
    if changed:
        changes.append(f"height: {OLD_HEIGHT} -> {NEW_HEIGHT}")

    return updated, changes


def update_header(header: str) -> tuple[str, list[str]]:
    """
    Update one site-header block.

    Returns:
        (updated_header, list_of_changes)
    """
    changes: list[str] = []
    updated_header = header

    logo_matches = list(LOGO_IMG_RE.finditer(header))

    if not logo_matches:
        return header, changes

    # Process matches from the end so string offsets remain valid.
    for match in reversed(logo_matches):
        img_tag = match.group(0)

        # Only migrate the old logo. If the new logo is already present,
        # leave it untouched.
        if NEW_SRC in img_tag:
            continue

        if OLD_SRC not in img_tag:
            continue

        updated_img, img_changes = update_logo_image(img_tag)

        if not img_changes:
            continue

        start, end = match.span()
        updated_header = (
            updated_header[:start]
            + updated_img
            + updated_header[end:]
        )

        changes.extend(img_changes)

    # Update the home link only when the header actually contained the
    # old logo and was therefore migrated.
    if changes:
        anchor_match = LOGO_ANCHOR_RE.search(updated_header)

        if anchor_match:
            anchor_tag = anchor_match.group(0)

            if 'href="/" ' in anchor_tag or 'href="/"' in anchor_tag:
                updated_anchor, changed = replace_attribute(
                    anchor_tag,
                    "href",
                    "/",
                    NEW_HOME_HREF,
                )

                if changed:
                    start, end = anchor_match.span()

                    updated_header = (
                        updated_header[:start]
                        + updated_anchor
                        + updated_header[end:]
                    )

                    changes.append(
                        f'href: "/" -> "{NEW_HOME_HREF}"'
                    )

    return updated_header, changes


def update_html_content(content: str) -> tuple[str, list[str]]:
    """
    Update all site-header blocks in one HTML document.

    Returns:
        (updated_content, list_of_changes)
    """
    changes: list[str] = []
    updated_content = content

    matches = list(SITE_HEADER_RE.finditer(content))

    # Process from the end to preserve offsets.
    for match in reversed(matches):
        header = match.group(0)

        updated_header, header_changes = update_header(header)

        if not header_changes:
            continue

        start, end = match.span()

        updated_content = (
            updated_content[:start]
            + updated_header
            + updated_content[end:]
        )

        changes.extend(header_changes)

    return updated_content, changes


def find_html_files(root: Path) -> list[Path]:
    """Return all HTML files below the project root."""
    return sorted(
        path
        for path in root.rglob("*.html")
        if path.is_file()
        and ".git" not in path.parts
        and "node_modules" not in path.parts
    )


def process_file(
    path: Path,
    dry_run: bool,
) -> tuple[bool, list[str], str | None]:
    """
    Process one HTML file.

    Returns:
        (changed, changes, error)
    """
    try:
        original = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        return False, [], f"not valid UTF-8: {exc}"
    except OSError as exc:
        return False, [], f"cannot read file: {exc}"

    updated, changes = update_html_content(original)

    if not changes:
        return False, [], None

    if not dry_run:
        try:
            path.write_text(updated, encoding="utf-8", newline="")
        except OSError as exc:
            return False, [], f"cannot write file: {exc}"

    return True, changes, None


def print_header() -> None:
    """Print tool information."""
    print()
    print("=" * 72)
    print("ETROYL — Header Logo Migration Tool")
    print("=" * 72)
    print(f"Old logo : {OLD_SRC}")
    print(f"New logo : {NEW_SRC}")
    print(f"Size     : {OLD_WIDTH}x{OLD_HEIGHT} -> {NEW_WIDTH}x{NEW_HEIGHT}")
    print(f"Home URL : / -> {NEW_HOME_HREF}")
    print("=" * 72)
    print()


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Migrate the ETROYL site-header logo across HTML files."
        )
    )

    parser.add_argument(
        "--root",
        type=Path,
        default=PROJECT_ROOT,
        help=(
            "Project root containing the HTML files "
            f"(default: {PROJECT_ROOT})"
        ),
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without modifying files.",
    )

    args = parser.parse_args()

    root = args.root.resolve()

    if not root.exists():
        print(f"ERROR: Project root does not exist: {root}")
        return 1

    if not root.is_dir():
        print(f"ERROR: Project root is not a directory: {root}")
        return 1

    print_header()

    if args.dry_run:
        print("MODE: DRY RUN — no files will be modified.")
    else:
        print("MODE: LIVE — matching files will be modified.")

    print(f"Root: {root}")
    print()

    html_files = find_html_files(root)

    if not html_files:
        print("No HTML files found.")
        return 0

    print(f"Found {len(html_files)} HTML file(s).")
    print()

    changed_files = 0
    total_changes = 0
    errors = 0

    for path in html_files:
        changed, changes, error = process_file(
            path,
            dry_run=args.dry_run,
        )

        relative = path.relative_to(root)

        if error:
            errors += 1
            print(f"[ERROR] {relative}")
            print(f"        {error}")
            print()
            continue

        if not changed:
            continue

        changed_files += 1
        total_changes += len(changes)

        action = "WOULD UPDATE" if args.dry_run else "UPDATED"

        print(f"[{action}] {relative}")

        # Avoid printing duplicate attribute changes if a file contains
        # multiple migrated headers with identical changes.
        for change in dict.fromkeys(changes):
            print(f"        - {change}")

        print()

    print("=" * 72)
    print("SUMMARY")
    print("=" * 72)

    if args.dry_run:
        print(f"Files that would change : {changed_files}")
        print(f"Changes detected        : {total_changes}")
    else:
        print(f"Files changed           : {changed_files}")
        print(f"Changes applied         : {total_changes}")

    print(f"Errors                  : {errors}")
    print(f"HTML files scanned      : {len(html_files)}")
    print()

    if errors:
        print(
            "Completed with errors. "
            "Review the files marked [ERROR]."
        )
        return 1

    if changed_files == 0:
        print(
            "No migration required. "
            "All matching headers are already up to date."
        )
        return 0

    if args.dry_run:
        print(
            "Dry run complete. "
            "Run without --dry-run to apply the changes."
        )
    else:
        print("Migration complete.")

    return 0


if __name__ == "__main__":
    sys.exit(main()) 
