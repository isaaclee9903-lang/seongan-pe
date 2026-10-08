"""화면 검사: 카드(슬라이드)마다 태블릿 가로·세로 사진을 찍어 모음 사진 한 장으로 만든다.

    python tools/qa.py rules            # lessons/tag-rugby/rules.html
    python tools/qa.py playground --steps "click:#start,wait:1500"
미리보기 서버(python -m http.server 8790)가 떠 있어야 한다. 결과: tools/_qa/<page>_<w>x<h>.png
"""
import argparse
import asyncio
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_qa"
OUT.mkdir(exist_ok=True)


async def shoot(page_name, lesson, w, h, steps, wait, maxn):
    url = f"http://localhost:8790/lessons/{lesson}/{page_name}.html"
    shots, logs = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width": w, "height": h})
        pg.on("console", lambda m: logs.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: logs.append(f"[pageerror] {e}"))
        await pg.goto(url, wait_until="networkidle")
        await pg.wait_for_timeout(800)
        for s in steps:
            kind, _, arg = s.partition(":")
            if kind == "click":
                await pg.click(arg)
            elif kind == "wait":
                await pg.wait_for_timeout(int(arg))
            elif kind == "js":
                await pg.evaluate(arg)
            elif kind == "shot":
                f = OUT / f"_{page_name}_{len(shots)}.png"
                await pg.screenshot(path=str(f))
                shots.append(f)
        n = await pg.evaluate("document.querySelectorAll('.track > .slide').length")
        if not steps and n:
            for i in range(min(n, maxn)):
                await pg.evaluate(f"(function(){{var t=document.querySelector('.track');t.scrollTo({{left:{i}*t.clientWidth,behavior:'auto'}});}})()")
                await pg.wait_for_timeout(int(wait * 1000))
                f = OUT / f"_{page_name}_{i}.png"
                await pg.screenshot(path=str(f))
                shots.append(f)
        elif not shots:
            await pg.wait_for_timeout(int(wait * 1000))
            f = OUT / f"_{page_name}_0.png"
            await pg.screenshot(path=str(f))
            shots.append(f)
        err = await pg.evaluate("(document.getElementById('errbox')||{}).textContent||''")
        await b.close()
    return shots, logs, err


def sheet(files, w, h, out, cols):
    scale = 0.42 if w > h else 0.36
    tw, th = int(w * scale), int(h * scale)
    rows = (len(files) + cols - 1) // cols
    img = Image.new("RGB", (cols * (tw + 8) + 8, rows * (th + 8) + 8), (40, 40, 40))
    for i, f in enumerate(files):
        im = Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS)
        img.paste(im, (8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 8)))
        f.unlink()
    img.save(out)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page")
    ap.add_argument("--lesson", default="tag-rugby")
    ap.add_argument("--steps", default="")
    ap.add_argument("--wait", type=float, default=1.6)
    ap.add_argument("--only", default="both", choices=["both", "land", "port"])
    ap.add_argument("--max", type=int, default=40)
    a = ap.parse_args()
    steps = [s for s in a.steps.split(",") if s]
    sizes = {"land": (1280, 800), "port": (800, 1280)}
    for key, (w, h) in sizes.items():
        if a.only not in ("both", key):
            continue
        files, logs, err = await shoot(a.page, a.lesson, w, h, steps, a.wait, a.max)
        out = OUT / f"{a.page}_{w}x{h}.png"
        sheet(files, w, h, out, 4 if w > h else 5)
        print(f"{out.name}: {len(files)}장", "| 오류 상자:", err or "없음")
        for l in logs[:12]:
            print("  ", l)


asyncio.run(main())
