from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "socialThumbnail.jpg"
LOGO = ROOT / "skin-fecomercio" / "assets" / "marca-sesc-colorida-20261030.png"
OUTPUT = ROOT / "socialThumbnail-revisao-20261104.png"

cover = Image.open(SOURCE).convert("RGB")
if cover.size != (1200, 630):
    raise RuntimeError(f"Capa inesperada: {cover.size}")

logo = Image.open(LOGO).convert("RGBA")
logo.thumbnail((360, 105), Image.Resampling.LANCZOS)

# A área já é o painel branco original; este preenchimento remove somente a
# marca antiga, a divisória, “Tocantins” e o slogan, sem alterar a fotografia.
cover.paste((255, 255, 255), (790, 480, 1200, 630))

x = 790 + (410 - logo.width) // 2
y = 480 + (150 - logo.height) // 2
cover.paste(logo, (x, y), logo)
cover.save(OUTPUT, format="PNG", optimize=True)

print(f"{OUTPUT} | {cover.size[0]}x{cover.size[1]}")
