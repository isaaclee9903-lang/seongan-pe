"""수업 페이지 만들기.

src/<수업>/*.html 안의 /*@@KIT:파일@@*/ 또는 <!--@@KIT:파일@@--> 표시를
src/kit/<파일> 내용으로 바꿔 lessons/<수업>/ 에 단독 HTML로 저장한다.

    python tools/build.py tag-rugby
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "src" / "kit"
MARK = re.compile(r"/\*@@KIT:([\w.\-]+)@@\*/|<!--@@KIT:([\w.\-]+)@@-->")


def build(lesson: str) -> None:
    src = ROOT / "src" / lesson
    out = ROOT / "lessons" / lesson
    out.mkdir(parents=True, exist_ok=True)
    problems = []
    for f in sorted(src.glob("*.html")):
        text = f.read_text(encoding="utf-8")

        def put(m):
            name = m.group(1) or m.group(2)
            return (KIT / name).read_text(encoding="utf-8")

        html = MARK.sub(put, text)
        if "@@KIT" in html:
            problems.append(f"{f.name}: 남은 표시")
        if "﻿" in html:
            problems.append(f"{f.name}: 숨은 문자(BOM)")
            html = html.replace("﻿", "")
        if not html.rstrip().endswith("</html>"):
            problems.append(f"{f.name}: </html>로 끝나지 않음")
        (out / f.name).write_text(html, encoding="utf-8", newline="\n")
        print(f"  {f.name:<22} {len(html.encode('utf-8')) // 1024:>4} KB")
    if problems:
        print("문제:", *problems, sep="\n  ")
        sys.exit(1)
    print(f"완료 → lessons/{lesson}/")


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "tag-rugby")
