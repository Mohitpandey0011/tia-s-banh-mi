#!/usr/bin/env python3
"""Stamp every local CSS/JS link in the HTML pages with a new ?v= version.

Run after changing any file in assets/css or assets/js, so visitors' browsers
fetch the new files instead of reusing old cached copies:

    python3 tools/bump-version.py
"""
import datetime
import glob
import os
import re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
version = datetime.datetime.now().strftime("%Y%m%d%H%M")
pattern = re.compile(r'((?:href|src)=")(assets/(?:css|js)/[\w.-]+\.(?:css|js))(?:\?v=[\w-]+)?(")')

for path in sorted(glob.glob(os.path.join(root, "*.html"))):
    with open(path, encoding="utf-8") as f:
        html = f.read()
    html, count = pattern.subn(lambda m: m.group(1) + m.group(2) + "?v=" + version + m.group(3), html)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"{os.path.basename(path)}: {count} links -> v={version}")
