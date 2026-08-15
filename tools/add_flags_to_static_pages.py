#!/usr/bin/env python3

"""
Add flag icons to the language switchers of manually maintained pages.

Affected pages:
    education.html
    about/about.html
    about/founder.html

The homepage is NOT modified because its language switcher is generated
by build.py.

The script is idempotent: running it multiple times will not add
duplicate flag icons.
"""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LANGUAGES = {
    "en": {"flag": "us.svg"},
    "fr": {"flag": "fr.svg"},
    "de": {"flag": "de.svg"},
    "es": {"flag": "es.svg"},
    "it": {"flag": "it.svg"},
    "nl": {"flag": "nl.svg"},
    "ar": {"flag": "sa.svg"},
    "zh": {"flag": "cn.svg"},
}

PAGES = [
    "education.html",
    "about/about.html",
    "about/founder.html",
]

LANG_CODES = "EN|FR|DE|ES|IT|NL|AR|ZH"


def flag_img(code):
    return (
        f'<img src="/assets/img/flags/{LANGUAGES[code]["flag"]}" '
        f'alt="" class="lang-flag" aria-hidden="true">'
    )


def add_flag_to_links(block):
    """
    Add flags to language menu links.

    Example:

        <a href="/fr/education.html">FR</a>

    becomes:

        <a href="/fr/education.html">
            <img ...>FR
        </a>

    while preserving the existing link attributes.
    """

    pattern = re.compile(
        rf'(<a\b[^>]*>)'
        rf'(\s*)'
        rf'({LANG_CODES})'
        rf'(\s*)'
        rf'(</a>)',
        re.IGNORECASE
    )

    def replace(match):
        opening = match.group(1)
        before_code = match.group(2)
        code_text = match.group(3)
        after_code = match.group(4)
        closing = match.group(5)

        # Already contains a flag.
        if "lang-flag" in match.group(0):
            return match.group(0)

        code = code_text.lower()

        return (
            opening
            + before_code
            + flag_img(code)
            + code_text.upper()
            + after_code
            + closing
        )

    return pattern.sub(replace, block)


def add_flag_to_current_language(block):
    """
    Add a flag to the current-language indicator.

    Example:

        <span class="lang-switcher__current">FR</span>

    becomes:

        <span class="lang-switcher__current">
            <img ...>FR
        </span>
    """

    pattern = re.compile(
        rf'(<span\s+class="lang-switcher__current">\s*)'
        rf'({LANG_CODES})'
        rf'(\s*</span>)',
        re.IGNORECASE
    )

    def replace(match):
        opening = match.group(1)
        code_text = match.group(2)
        closing = match.group(3)

        if "lang-flag" in match.group(0):
            return match.group(0)

        code = code_text.lower()

        return (
            opening
            + flag_img(code)
            + code_text.upper()
            + closing
        )

    return pattern.sub(replace, block)


def process_switcher(block):
    """
    Process one complete .lang-switcher element.
    """

    # Add flag to the current language.
    block = add_flag_to_current_language(block)

    # Add flags to dropdown entries.
    block = add_flag_to_links(block)

    return block


def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        original = f.read()

    # Match only the language-switcher element.
    #
    # We deliberately stop at the corresponding </div> by matching
    # the known structure rather than assuming a fixed number of
    # closing divs after the switcher.
    pattern = re.compile(
        r'<div\s+class="lang-switcher"\s*>'
        r'.*?'
        r'</ul>'
        r'\s*</div>',
        re.DOTALL | re.IGNORECASE
    )

    updated, count = pattern.subn(
        lambda match: process_switcher(match.group(0)),
        original,
    )

    relpath = os.path.relpath(path, ROOT)

    if count == 0:
        print(f"WARNING  No language switcher found: {relpath}")
        return

    if updated == original:
        print(f"SKIPPED   {relpath}")
        return

    with open(path, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"UPDATED   {relpath}")


def main():
    print("ETROYL — Adding flags to static language switchers\n")

    for lang in LANGUAGES:
        for page in PAGES:

            path = (
                os.path.join(ROOT, page)
                if lang == "en"
                else os.path.join(ROOT, lang, page)
            )

            if not os.path.isfile(path):
                print(f"MISSING   {os.path.relpath(path, ROOT)}")
                continue

            process_file(path)

    print("\nFinished.")


if __name__ == "__main__":
    main()
