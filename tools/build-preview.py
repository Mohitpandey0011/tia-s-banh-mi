#!/usr/bin/env python3
"""Build self-contained copies of the pages for previews.

Each page gets its stylesheet and scripts written in, so it works anywhere
a single HTML file can be shown, with nothing extra to load:

    python3 tools/build-preview.py <output-folder>
"""
import glob
import os
import re
import sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, "preview"))
os.makedirs(out, exist_ok=True)


def read(rel):
    with open(os.path.join(root, rel), encoding="utf-8") as f:
        return f.read()


css_link = re.compile(r'<link rel="stylesheet" href="(assets/css/[\w.-]+\.css)(?:\?v=[\w-]+)?">')
js_tag = re.compile(r'<script src="(assets/js/[\w.-]+\.js)(?:\?v=[\w-]+)?"></script>')

for path in sorted(glob.glob(os.path.join(root, "*.html"))):
    html = read(os.path.basename(path))
    html = css_link.sub(lambda m: "<style>\n" + read(m.group(1)) + "\n</style>", html)
    html = js_tag.sub(lambda m: "<script>\n" + read(m.group(1)) + "\n</script>", html)
    if "assets/" in re.sub(r"<script>.*?</script>|<style>.*?</style>", "", html, flags=re.S):
        print("warning: asset reference left in", os.path.basename(path))
    with open(os.path.join(out, os.path.basename(path)), "w", encoding="utf-8") as f:
        f.write(html)
    print(os.path.basename(path), len(html) // 1024, "KB")
