"""심판 페이지 장면을 차례로 판정하며 찍는다: python tools/refshots.py <lesson> [land|port]"""
import asyncio, sys
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright
OUT = Path(__file__).resolve().parent / "_qa"
async def main():
    lesson = sys.argv[1]; port = len(sys.argv) > 2 and sys.argv[2] == "port"
    w, h = (800, 1280) if port else (1280, 800)
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width": w, "height": h})
        logs = []
        pg.on("pageerror", lambda e: logs.append(str(e)))
        await pg.goto(f"http://localhost:8790/lessons/{lesson}/referee.html", wait_until="networkidle")
        n = await pg.evaluate("SCENES.length")
        files = []
        for i in range(n):
            await pg.wait_for_timeout(500)
            await pg.evaluate("SCN.pause(); SCN.seek(SCN.s.dur)")
            await pg.evaluate("document.querySelectorAll('.dec').forEach(function(b){b.disabled=false})")
            ans = await pg.evaluate(f"SCENES[{i}].answer")
            if ans is None:
                await pg.click(".dec.play")
            else:
                await pg.click(".dec.whistle"); await pg.click(f"[data-r='{ans}']")
            await pg.wait_for_timeout(300)
            await pg.evaluate("SCN.pause(); SCN.seek(SCN.s.dur * .999)")
            f = OUT / f"_ref{i}.png"; await pg.screenshot(path=str(f)); files.append(f)
            if i < n - 1:
                await pg.click("#next")
        err = await pg.evaluate("(document.getElementById('errbox')||{}).textContent||''")
        await b.close()
    cols = 3 if not port else 4; sc = .42 if not port else .3
    tw, th = int(w * sc), int(h * sc); rows = (len(files) + cols - 1) // cols
    img = Image.new("RGB", (cols * (tw + 6) + 6, rows * (th + 6) + 6), (40, 40, 40))
    for i, f in enumerate(files):
        img.paste(Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS), (6 + (i % cols) * (tw + 6), 6 + (i // cols) * (th + 6))); f.unlink()
    img.save(OUT / f"referee_{w}x{h}.png"); print(len(files), "errors:", logs[:4], err)
asyncio.run(main())
