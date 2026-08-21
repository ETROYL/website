#!/usr/bin/env python3

"""
ETROYL — Technical / Insights Header Migration
================================================

Replaces legacy technical-header blocks with the shared
<site-header></site-header> component.

Scope:
    - Technical pages
    - Insights index
    - Individual Insights pages

The script:
    - searches recursively for HTML files
    - changes only headers containing "technical-header"
    - preserves all other page content
    - supports --dry-run

Usage:

    python3 tools/migrate_remaining_headers.py --dry-run

    python3 tools/migrate_remaining_headers.py
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path


LEGACY_HEADER_PATTERN = re.compile(
    r'<header\s+class=["\'][^"\']*technical-header[^"\']*["\'][^>]*>'
    r'.*?'
    r'</header>',
    re.IGNORECASE | re.DOTALL,
)


def find_html_files(root: Path) -> list[Path]:
    """Find all HTML files recursively."""
    return sorted(
        path
        for path in root.rglob("*.html")
        if ".git" not in path.parts
        and "tools" not in path.parts
    )


def migrate_file(path: Path, dry_run: bool) -> bool:
    """Replace one legacy technical header."""
    original = path.read_text(encoding="utf-8")

    updated, count = LEGACY_HEADER_PATTERN.subn(
        "<site-header></site-header>",
        original,
    )

    if count == 0:
        return False

    if count > 1:
        raise RuntimeError(
            f"More than one technical-header found in: {path}"
        )

    if dry_run:
        print(f"WOULD UPDATE  {path}")
    else:
        path.write_text(updated, encoding="utf-8")
        print(f"UPDATED       {path}")

    return True


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Migrate ETROYL technical/Insights headers."
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show files that would change without modifying them.",
    )

    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent

    print()
    print("ETROYL — Technical / Insights Header Migration")
    print("=" * 48)
    print(f"Root: {root}")

    html_files = find_html_files(root)

    print(f"HTML files found: {len(html_files)}")
    print()

    updated_count = 0

    for path in html_files:
        if migrate_file(path, args.dry_run):
            updated_count += 1

    print()
    print("=" * 48)

    if args.dry_run:
        print(f"Files that would be updated: {updated_count}")
        print()
        print("No files were modified.")
        print()
        print("If the list looks correct, run:")
        print()
        print("    python3 tools/migrate_remaining_headers.py")
    else:
        print(f"Files updated: {updated_count}")
        print()
        print("Migration complete.")


if __name__ == "__main__":
    main()
