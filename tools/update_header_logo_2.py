#!/usr/bin/env python3
"""
ETROYL Header Logo Migration Tool

Migrates the ETROYL header logo across HTML files.

Migration:
    /assets/img/logo.webp       -> /assets/img/logo-mono.webp
    width="778"                -> width="978"
    height="399"               -> height="978"
    href="/"                   -> href="{{root_dir}}"

The tool does NOT depend on a particular header class such as
"site-header" or "technical-header".

Instead, it identifies the logo by:
    class="logo-mark"

and, when applicable, updates the enclosing:
    <a class="logo" ...>

This makes the migration robust across different ETROYL page
templates and future header variants.

Usage:
    python3 tools/update_header_logo.py --dry-run
    python3 tools/update_header_logo.py

Optional:
    python3 tools/update_header_logo.py --root /path/to/website
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


# ============================================================================
# Configuration
# ============================================================================

OLD_SRC = "/assets/img/logo.webp"
NEW_SRC = "/assets/img/logo-mono.webp"

OLD_WIDTH = "778"
NEW_WIDTH = "978"

OLD_HEIGHT = "399"
NEW_HEIGHT = "978"

OLD_HOME_HREF = "/"
NEW_HOME_HREF = "{{root_dir}}"

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent


# ============================================================================
# Regular expressions
# ============================================================================

# Matches an <img> element whose class attribute contains "logo-mark".
#
# Examples matched:
#
#   <img class="logo-mark" ...>
#   <img src="..." class="logo-mark">
#   <img
#       src="..."
#       alt="ETROYL"
#       class="logo-mark">
#
LOGO_IMG_RE = re.compile(
    r"<img\b"
    r"(?=[^>]*\bclass\s*=\s*([\"'])[^\"']*\blogo-mark\b[^\"']*\1)"
    r"[^>]*>",
    re.IGNORECASE | re.DOTALL,
)


# Matches an <a> element whose class attribute contains "logo".
#
# We intentionally search for the anchor independently of the header class.
#
LOGO_ANCHOR_RE = re.compile(
    r"<a\b"
    r"(?=[^>]*\bclass\s*=\s*([\"'])[^\"']*\blogo\b[^\"']*\1)"
    r"[^>]*>",
    re.IGNORECASE | re.DOTALL,
)


# ============================================================================
# HTML attribute helpers
# ============================================================================

def get_attribute(
    tag: str,
    attribute: str,
) -> str | None:
    """
    Return the value of an HTML attribute.

    Attribute matching is case-insensitive.

    Returns:
        Attribute value, or None if the attribute does not exist.
    """
    pattern = re.compile(
        rf"\b{re.escape(attribute)}\s*=\s*([\"'])(.*?)\1",
        re.IGNORECASE | re.DOTALL,
    )

    match = pattern.search(tag)

    if not match:
        return None

    return match.group(2)


def replace_attribute(
    tag: str,
    attribute: str,
    old_value: str,
    new_value: str,
) -> tuple[str, bool]:
    """
    Replace one exact HTML attribute value.

    The original quote style is preserved.

    Returns:
        (updated_tag, changed)
    """
    pattern = re.compile(
        rf"(\b{re.escape(attribute)}\s*=\s*)([\"'])"
        rf"{re.escape(old_value)}"
        rf"(\2)",
        re.IGNORECASE,
    )

    updated, count = pattern.subn(
        lambda match: (
            f"{match.group(1)}"
            f"{match.group(2)}"
            f"{new_value}"
            f"{match.group(3)}"
        ),
        tag,
        count=1,
    )

    return updated, count > 0


# ============================================================================
# Logo migration
# ============================================================================

def update_logo_image(
    img_tag: str,
) -> tuple[str, list[str]]:
    """
    Update one logo-mark <img> element.

    Only the old logo source is migrated.

    Returns:
        (updated_tag, list_of_changes)
    """
    changes: list[str] = []
    updated = img_tag

    # ------------------------------------------------------------------
    # Source
    # ------------------------------------------------------------------

    src = get_attribute(updated, "src")

    if src == OLD_SRC:
        updated, changed = replace_attribute(
            updated,
            "src",
            OLD_SRC,
            NEW_SRC,
        )

        if changed:
            changes.append(
                f"src: {OLD_SRC} -> {NEW_SRC}"
            )

    # ------------------------------------------------------------------
    # Dimensions
    # ------------------------------------------------------------------

    width = get_attribute(updated, "width")

    if width == OLD_WIDTH:
        updated, changed = replace_attribute(
            updated,
            "width",
            OLD_WIDTH,
            NEW_WIDTH,
        )

        if changed:
            changes.append(
                f"width: {OLD_WIDTH} -> {NEW_WIDTH}"
            )

    height = get_attribute(updated, "height")

    if height == OLD_HEIGHT:
        updated, changed = replace_attribute(
            updated,
            "height",
            OLD_HEIGHT,
            NEW_HEIGHT,
        )

        if changed:
            changes.append(
                f"height: {OLD_HEIGHT} -> {NEW_HEIGHT}"
            )

    return updated, changes


def find_enclosing_logo_anchor(
    content: str,
    img_start: int,
) -> tuple[int, int, str] | None:
    """
    Find the nearest preceding <a class="logo"> opening tag for a logo image.

    This intentionally avoids assuming any particular header structure.

    Returns:
        (start_position, end_position, anchor_tag)
        or None if no suitable anchor is found.
    """
    preceding = content[:img_start]

    matches = list(LOGO_ANCHOR_RE.finditer(preceding))

    if not matches:
        return None

    anchor_match = matches[-1]

    # Basic sanity check:
    # the logo anchor should be relatively close to the image.
    #
    # This prevents an unrelated logo anchor elsewhere in the document
    # from being selected if malformed HTML is encountered.
    distance = img_start - anchor_match.end()

    if distance > 5000:
        return None

    return (
        anchor_match.start(),
        anchor_match.end(),
        anchor_match.group(0),
    )


def update_html_content(
    content: str,
) -> tuple[str, list[str]]:
    """
    Update all old ETROYL logo-mark images in an HTML document.

    Returns:
        (updated_content, list_of_changes)
    """
    changes: list[str] = []
    updated_content = content

    # Work from the end of the document toward the beginning.
    #
    # This is important because replacing text changes string offsets.
    matches = list(LOGO_IMG_RE.finditer(content))

    for match in reversed(matches):
        img_tag = match.group(0)

        # --------------------------------------------------------------
        # Only migrate the old logo.
        #
        # If this image already uses logo-mono.webp, it is left alone.
        # --------------------------------------------------------------

        src = get_attribute(img_tag, "src")

        if src != OLD_SRC:
            continue

        updated_img, img_changes = update_logo_image(img_tag)

        if not img_changes:
            continue

        img_start, img_end = match.span()

        # --------------------------------------------------------------
        # Replace the image itself.
        # --------------------------------------------------------------

        updated_content = (
            updated_content[:img_start]
            + updated_img
            + updated_content[img_end:]
        )

        changes.extend(img_changes)

        # --------------------------------------------------------------
        # Update the enclosing .logo anchor.
        #
        # We locate it using the original document position because
        # replacements are being performed from the end toward the
        # beginning.
        # --------------------------------------------------------------

        anchor = find_enclosing_logo_anchor(
            content,
            img_start,
        )

        if anchor is None:
            changes.append(
                "WARNING: logo-mark has no nearby <a class=\"logo\">"
            )
            continue

        anchor_start, anchor_end, anchor_tag = anchor

        href = get_attribute(anchor_tag, "href")

        if href != OLD_HOME_HREF:
            continue

        updated_anchor, href_changed = replace_attribute(
            anchor_tag,
            "href",
            OLD_HOME_HREF,
            NEW_HOME_HREF,
        )

        if not href_changed:
            continue

        updated_content = (
            updated_content[:anchor_start]
            + updated_anchor
            + updated_content[anchor_end:]
        )

        changes.append(
            f'href: "{OLD_HOME_HREF}" -> "{NEW_HOME_HREF}"'
        )

    return updated_content, changes


# ============================================================================
# File handling
# ============================================================================

def find_html_files(root: Path) -> list[Path]:
    """
    Recursively find all HTML files below the project root.

    .git and node_modules are excluded.
    """
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
        return (
            False,
            [],
            f"not valid UTF-8: {exc}",
        )
    except OSError as exc:
        return (
            False,
            [],
            f"cannot read file: {exc}",
        )

    updated, changes = update_html_content(original)

    if not changes:
        return False, [], None

    if not dry_run:
        try:
            path.write_text(
                updated,
                encoding="utf-8",
                newline="",
            )
        except OSError as exc:
            return (
                False,
                [],
                f"cannot write file: {exc}",
            )

    return True, changes, None


# ============================================================================
# Output
# ============================================================================

def print_header() -> None:
    """Print tool information."""
    print()
    print("=" * 72)
    print("ETROYL — Header Logo Migration Tool")
    print("=" * 72)
    print(f"Old logo : {OLD_SRC}")
    print(f"New logo : {NEW_SRC}")
    print(
        f"Size     : "
        f"{OLD_WIDTH}x{OLD_HEIGHT} -> "
        f"{NEW_WIDTH}x{NEW_HEIGHT}"
    )
    print(
        f"Home URL : "
        f"{OLD_HOME_HREF} -> {NEW_HOME_HREF}"
    )
    print("=" * 72)
    print()


# ============================================================================
# Main
# ============================================================================

def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Migrate the ETROYL header logo across HTML files."
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
        help=(
            "Show what would change without modifying files."
        ),
    )

    args = parser.parse_args()

    root = args.root.resolve()

    # ------------------------------------------------------------------
    # Validate root
    # ------------------------------------------------------------------

    if not root.exists():
        print(
            f"ERROR: Project root does not exist: {root}"
        )
        return 1

    if not root.is_dir():
        print(
            f"ERROR: Project root is not a directory: {root}"
        )
        return 1

    # ------------------------------------------------------------------
    # Header
    # ------------------------------------------------------------------

    print_header()

    if args.dry_run:
        print(
            "MODE: DRY RUN — no files will be modified."
        )
    else:
        print(
            "MODE: LIVE — matching files will be modified."
        )

    print(f"Root: {root}")
    print()

    # ------------------------------------------------------------------
    # Discover files
    # ------------------------------------------------------------------

    html_files = find_html_files(root)

    if not html_files:
        print("No HTML files found.")
        return 0

    print(
        f"Found {len(html_files)} HTML file(s)."
    )
    print()

    # ------------------------------------------------------------------
    # Process files
    # ------------------------------------------------------------------

    changed_files = 0
    total_changes = 0
    errors = 0
    warnings = 0

    for path in html_files:
        changed, changes, error = process_file(
            path,
            dry_run=args.dry_run,
        )

        relative = path.relative_to(root)

        # --------------------------------------------------------------
        # Error
        # --------------------------------------------------------------

        if error:
            errors += 1

            print(f"[ERROR] {relative}")
            print(f"        {error}")
            print()

            continue

        # --------------------------------------------------------------
        # No change
        # --------------------------------------------------------------

        if not changed:
            continue

        # --------------------------------------------------------------
        # Changed
        # --------------------------------------------------------------

        changed_files += 1
        total_changes += len(changes)

        action = (
            "WOULD UPDATE"
            if args.dry_run
            else "UPDATED"
        )

        print(f"[{action}] {relative}")

        for change in dict.fromkeys(changes):
            if change.startswith("WARNING:"):
                warnings += 1
                print(f"        - {change}")
            else:
                print(f"        - {change}")

        print()

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------

    print("=" * 72)
    print("SUMMARY")
    print("=" * 72)

    if args.dry_run:
        print(
            f"Files that would change : {changed_files}"
        )
        print(
            f"Changes detected        : {total_changes}"
        )
    else:
        print(
            f"Files changed           : {changed_files}"
        )
        print(
            f"Changes applied         : {total_changes}"
        )

    print(f"Warnings                : {warnings}")
    print(f"Errors                  : {errors}")
    print(f"HTML files scanned      : {len(html_files)}")
    print()

    # ------------------------------------------------------------------
    # Final status
    # ------------------------------------------------------------------

    if errors:
        print(
            "Completed with errors. "
            "Review the files marked [ERROR]."
        )
        return 1

    if changed_files == 0:
        print(
            "No migration required. "
            "All matching logos are already up to date."
        )
        return 0

    if args.dry_run:
        print(
            "Dry run complete. "
            "Run without --dry-run to apply the changes."
        )
    else:
        print(
            "Migration complete."
        )

    return 0


if __name__ == "__main__":
    main()
