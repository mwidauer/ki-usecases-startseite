"""
generate_icons.py
Generiert DALL·E 3 Icons für alle Anwendungsfälle aus data.json.
Liest OPENAI_API_KEY aus .env. Speichert Icons als icons/icon_01.png bis icon_10.png.
"""

import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# .env laden
load_dotenv()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# Ausgabeordner anlegen
icons_dir = Path("icons")
icons_dir.mkdir(exist_ok=True)

# data.json einlesen
with open("data.json", encoding="utf-8") as f:
    data = json.load(f)

# Prompts pro Anwendungsfall (fest definiert, passend zur CLAUDE.md)
PROMPTS = {
    1: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "reading oversized glowing documents and PDFs with magnifying glass. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    2: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "navigating oversized web browser windows with data flowing into a structured table. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    3: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "operating oversized keyboard with automated workflow gears and text streams. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    4: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "connecting oversized automation nodes in a flowing pipeline with robotic arms. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    5: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "assembling oversized app wireframe blocks and UI components like building bricks. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    6: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "beside oversized monitor with code lines and AI robot co-pilot writing code. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    7: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "standing inside a secure server vault with a brain and shield icon on local server. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    8: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "speaking into an oversized microphone with AI waveforms and phone agent headset. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    9: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "directing an oversized cinematic camera with AI-generated film frames floating around. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
    10: (
        "Isometric dark mode illustration. Deep navy background. Small 3D human figure "
        "presenting oversized glowing slides with charts auto-assembling from notes and data. "
        "Neon accents: cyan, purple, mint green with soft glow. "
        "Dark slate objects with bright highlights. No text."
    ),
}


def generate_icon(usecase_id: int, name: str, prompt: str) -> None:
    filename = icons_dir / f"icon_{usecase_id:02d}.png"

    if filename.exists():
        print(f"  [skip] {filename} existiert bereits")
        return

    print(f"  Generiere icon_{usecase_id:02d} – {name} ...")
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    img_data = requests.get(image_url, timeout=30).content

    filename.write_bytes(img_data)
    print(f"  [ok] Gespeichert: {filename}")


def main():
    usecases = data["usecases"]
    print(f"Starte Icon-Generierung für {len(usecases)} Anwendungsfälle ...\n")

    for uc in usecases:
        uid = uc["id"]
        prompt = PROMPTS.get(uid)
        if not prompt:
            print(f"  [warn] Kein Prompt für ID {uid}, übersprungen.")
            continue
        generate_icon(uid, uc["name"], prompt)

    print("\nFertig. Alle Icons wurden in ./icons/ gespeichert.")


if __name__ == "__main__":
    main()
