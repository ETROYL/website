#!/usr/bin/env python3

"""
Migrate legacy ETROYL static headers to the shared header locator.

The script recursively searches for HTML files containing:

    <header class="site-header">

and replaces the complete <header>...</header> block with:

    <!-- Shared site header. Rendered by script.js. -->
    <div id="site-header"></div>

Only the header block is modified. The remainder of each file is preserved.

Usage:

    python migrate_headers.py --dry-run

Then, after reviewing the output:

    python migrate_headers.py
"""

from pathlib import Path
import argparse
import re
import sys


ROOT = Path(__file__).resolve().parent.parent

NEW_HEADER = """<!-- Shared site header. Rendered by script.js. -->
<div id="site-header"></div>"""


def find_legacy_headers(text):
    """
    Find complete legacy site-header blocks.

    The opening tag may contain additional attributes, so we only
    require class="site-header" to be present.
    """

    pattern = re.compile(
        r'<header\b(?=[^>]*\bclass\s*=\s*["\'][^"\']*\bsite-header\b[^"\']*["\'])[^>]*>'
        r'.*?'
        r'</header\s*>',
        re.IGNORECASE | re.DOTALL,
    )

    return list(pattern.finditer(text))


def process_file(path, dry_run=False):
    try:
        original = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        print(f"SKIP  {path}  (not UTF-8)")
        return False

    matches = find_legacy_headers(original)

    if not matches:
        return False

    # We expect exactly one site header per page.
    if len(matches) > 1:
        print(f"SKIP  {path}  (found {len(matches)} site headers)")
        return False

    match = matches[0]

    old_header = match.group(0)

    # Extra safety checks.
    if "<header" not in old_header.lower():
        print(f"SKIP  {path}  (invalid header match)")
        return False

    if "</header" not in old_header.lower():
        print(f"SKIP  {path}  (missing closing header)")
        return False

    replacement = NEW_HEADER

    updated = (
        original[:match.start()]
        + replacement
        + original[match.end():]
    )

    if updated == original:
        print(f"SKIP  {path}  (no effective change)")
        return False

    if dry_run:
        print(f"WOULD UPDATE  {path}")
    else:
        path.write_text(updated, encoding="utf-8")
        print(f"UPDATED       {path}")

    return True


def main():
    parser = argparse.ArgumentParser(
        description="Replace legacy ETROYL static headers recursively."
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show files that would be modified without changing them.",
    )

    args = parser.parse_args()

    html_files = sorted(ROOT.rglob("*.html"))

    if not html_files:
        print("No HTML files found.")
        return 0

    changed = 0
    skipped = 0

    print()
    print("ETROYL — Shared Header Migration")
    print("=" * 40)
    print(f"Root: {ROOT}")
    print(f"HTML files found: {len(html_files)}")
    print()

    for path in html_files:
        if process_file(path, dry_run=args.dry_run):
            changed += 1

    print()
    print("=" * 40)

    if args.dry_run:
        print(f"Files that would be updated: {changed}")
        print()
        print("No files were modified.")
        print("If the list looks correct, run:")
        print()
        print("    python migrate_headers.py")
    else:
        print(f"Files updated: {changed}")
        print()
        print("Migration complete.")

    return 0


if __name__ == "__main__":
    sys.exit(main()) 
