"""카드 하나를 크게 찍기: python tools/shot.py <lesson> <page> <카드번호(0부터)> [대기초] [land|port] [js]"""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright
OUT = Path(__file__).resolve().parent / "_qa"; OUT.mkdir(exist_ok=True)
async def main():
    lesson, page, idx = sys.argv[1], sys.argv[2], int(sys.argv[3])
    wait = float(sys.argv[4]) if len(sys.argv) > 4 else 2.5
    w, h = (1280, 800) if (len(sys.argv) <= 5 or sys.argv[5] == "land") else (800, 1280)
    js = sys.argv[6] if len(sys.argv) > 6 else ""
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width": w, "height": h})
        logs = []
        pg.on("pageerror", lambda e: logs.append(str(e)))
        await pg.goto(f"http://localhost:8790/lessons/{lesson}/{page}.html", wait_until="networkidle")
        await pg.wait_for_timeout(600)
        await pg.evaluate(f"(function(){{var t=document.querySelector('.track');if(t)t.scrollTo({{left:{idx}*t.clientWidth,behavior:'auto'}});}})()")
        if js:
            await pg.wait_for_timeout(400); await pg.evaluate(js)
        await pg.wait_for_timeout(int(wait * 1000))
        f = OUT / f"one_{page}_{idx}_{w}.png"
        await pg.screenshot(path=str(f))
        print(f.name, logs[:5])
        await b.close()
asyncio.run(main())
