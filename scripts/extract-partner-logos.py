"""Extract the nine partner marks from the supplied Solaris style guide.

Requires Poppler's pdftoppm and Pillow. The crop coordinates match the
single-page PDF rendered at 240 dpi. The guide places black marks on an
orange gradient, so the red channel provides a clean transparency mask.
"""

from pathlib import Path
import subprocess
import tempfile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Solaris_StyleGuide.pdf"
OUTPUT = ROOT / "public" / "partners"
Y_OFFSET = 6200
CROPS = {
    "cstit": (1040, 280, 1710, 625),
    "funbike": (365, 645, 995, 895),
    "beats-in-the-park": (1010, 650, 1770, 955),
    "kolumban-optika": (1790, 565, 2430, 895),
    "ecset": (160, 905, 650, 1410),
    "feelmkr": (680, 905, 1130, 1390),
    "mimi": (1160, 935, 1640, 1405),
    "watchthis-works": (1590, 970, 2115, 1390),
    "pekengo": (2100, 890, 2670, 1400),
}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temporary:
        rendered = Path(temporary) / "guide"
        subprocess.run(
            ["pdftoppm", "-f", "1", "-l", "1", "-r", "240", "-png", "-singlefile", str(SOURCE), str(rendered)],
            check=True,
        )
        page = Image.open(rendered.with_suffix(".png")).convert("RGB")
        for slug, (left, top, right, bottom) in CROPS.items():
            crop = page.crop((left, top + Y_OFFSET, right, bottom + Y_OFFSET))
            red = crop.getchannel("R")
            # Solid black remains opaque; orange background and paper vanish.
            alpha = red.point(lambda value: max(0, min(255, round((180 - value) * 255 / 125))))
            mark = Image.new("RGBA", crop.size, (19, 18, 15, 0))
            mark.putalpha(alpha)
            bounds = alpha.point(lambda value: 255 if value > 10 else 0).getbbox()
            if not bounds:
                raise RuntimeError(f"No logo pixels found for {slug}")
            mark.crop(bounds).save(OUTPUT / f"{slug}.webp", "WEBP", lossless=True, method=6)


if __name__ == "__main__":
    main()
