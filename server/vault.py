#!/usr/bin/env python3
"""Local collection server for Colossal Vault.

Serves the static screens and a JSON API under /api/v1.
Records live in data/vault.sqlite. Photos live in data/photos/.

This is the stand-in for the Chimp.OS PHP backend: same routes, same
item shape. Point the screens at that API later without rewriting them.
"""

from __future__ import annotations

import base64
import csv
import io
import json
import mimetypes
import os
import sqlite3
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
PHOTOS = DATA / "photos"
DB_PATH = DATA / "vault.sqlite"
SEED_PATH = Path(__file__).resolve().parent / "seed_items.json"
PORT = int(os.environ.get("PORT", "43123"))

AISLES = [
    ("comic", "Comics", 10482, 42600, 1),
    ("mtg", "Magic", 19847, 86400, 2),
    ("cards", "Cards", 2150, 9600, 3),
    ("funko", "Funko", 1306, 18200, 4),
    ("game", "Games", 640, 22100, 5),
    ("manga", "Manga", 410, 6400, 6),
    ("figure", "Figures", 188, 14800, 7),
    ("memo", "Memorabilia", 96, 4200, 8),
    ("pi", "Pi & gear", 34, 2150, 9),
]

AISLE_NAME = {row[0]: row[1] for row in AISLES}


def now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def money(value) -> str:
    if value is None:
        return "—"
    number = float(value)
    if abs(number - round(number)) < 0.001:
        return f"${int(round(number)):,}"
    return f"${number:,.2f}"


def connect() -> sqlite3.Connection:
    DATA.mkdir(parents=True, exist_ok=True)
    PHOTOS.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def init_db(db: sqlite3.Connection) -> None:
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS aisles (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          count INTEGER NOT NULL,
          value REAL NOT NULL,
          sort INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          spine TEXT,
          short TEXT,
          series TEXT,
          meta TEXT,
          mark TEXT,
          year TEXT,
          condition TEXT,
          location TEXT,
          value REAL,
          delta REAL DEFAULT 0,
          franchise TEXT,
          tags_label TEXT,
          note TEXT,
          finish TEXT,
          rarity TEXT,
          confidence REAL,
          guide TEXT,
          publisher TEXT,
          recent INTEGER DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'confirmed',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS photos (
          id TEXT PRIMARY KEY,
          item_id TEXT,
          filename TEXT NOT NULL,
          mime TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS jobs (
          id TEXT PRIMARY KEY,
          item_id TEXT,
          photo_id TEXT,
          title TEXT,
          category TEXT,
          aisle TEXT,
          meta TEXT,
          status TEXT NOT NULL,
          confidence REAL,
          note TEXT,
          value REAL,
          location TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS batch (
          id TEXT PRIMARY KEY,
          path TEXT NOT NULL,
          files INTEGER NOT NULL,
          ready INTEGER NOT NULL,
          hold INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        """
    )
    count = db.execute("SELECT COUNT(*) AS n FROM items").fetchone()["n"]
    if count:
        return
    for aisle in AISLES:
        db.execute(
            "INSERT INTO aisles (id, name, count, value, sort) VALUES (?, ?, ?, ?, ?)",
            aisle,
        )
    db.execute(
        "INSERT INTO batch (id, path, files, ready, hold) VALUES (?, ?, ?, ?, ?)",
        ("saturday", "~/Pictures/Vault/Saturday", 240, 190, 50),
    )
    db.execute("INSERT INTO meta (key, value) VALUES ('bulk_filed', '0')")
    stamp = now()
    items = json.loads(SEED_PATH.read_text())
    for raw in items:
        confidence = raw.get("confidence") or ""
        conf = None
        if isinstance(confidence, str) and confidence.endswith("%"):
            try:
                conf = float(confidence.strip("%")) / 100
            except ValueError:
                conf = None
        db.execute(
            """
            INSERT INTO items (
              id, category, title, spine, short, series, meta, mark, year,
              condition, location, value, delta, franchise, tags_label, note,
              finish, rarity, confidence, guide, publisher, recent, status,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)
            """,
            (
                raw["id"],
                raw["category"],
                raw["title"],
                raw.get("spine"),
                raw.get("short"),
                raw.get("series"),
                raw.get("meta"),
                raw.get("mark"),
                raw.get("year"),
                raw.get("condition"),
                raw.get("location"),
                raw.get("value"),
                {"lotus": 800, "asm-300": 40, "charizard": 20, "chrono": 15}.get(raw["id"], 0),
                raw.get("franchise"),
                raw.get("tagsLabel"),
                raw.get("note"),
                raw.get("finish"),
                raw.get("rarity"),
                conf,
                raw.get("guide"),
                raw.get("publisher"),
                raw.get("recent") or 0,
                stamp,
                stamp,
            ),
        )
    seeded_jobs = [
        ("job-ring", "one-ring", "The One Ring", "mtg", "Magic", "LTR · 001", "ready", 0.94, "Binder · Mythic", 89, "Photo 011"),
        ("job-grogu", "grogu", "Grogu", "funko", "Funko", "Pop · 465", "ready", 0.97, "POP wall A", 18, "Funko read"),
        ("job-char", "charizard", "Charizard", "cards", "Cards", "Base · 4/102", "ready", 0.90, "Binder · Vintage", 280, "Holo"),
        ("job-glare", None, "Needs a title", "comic", "Comics", "", "needs_label", 0.42, "Flat file", None, "Photo 014 · glare"),
        ("job-saga", "saga-1", "Saga #1", "comic", "Comics", "Image · 1", "tracking", 0.0, "Long box · Image", 220, "Still reading"),
        ("job-pi", "pi-5", "Raspberry Pi 5", "pi", "Pi & gear", "8GB", "filed", 0.96, "Pi rack", 80, "Filed to the rack"),
    ]
    for job in seeded_jobs:
        db.execute(
            """
            INSERT INTO jobs (
              id, item_id, photo_id, title, category, aisle, meta, status,
              confidence, note, value, location, created_at, updated_at
            ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (job[0], job[1], job[2], job[3], job[4], job[5], job[6], job[7], job[10], job[9], job[8], stamp, stamp),
        )
    db.commit()


def item_json(row: sqlite3.Row) -> dict:
    confidence = row["confidence"]
    label = f"{round(confidence * 100)}%" if confidence else ""
    return {
        "id": row["id"],
        "category": row["category"],
        "aisle": AISLE_NAME.get(row["category"], row["category"]),
        "title": row["title"],
        "spine": row["spine"] or row["title"],
        "short": row["short"] or row["title"],
        "series": row["series"] or "",
        "meta": row["meta"] or "",
        "mark": row["mark"] or "",
        "year": row["year"] or "",
        "condition": row["condition"] or "",
        "location": row["location"] or "",
        "value": row["value"],
        "valueLabel": money(row["value"]),
        "delta": row["delta"] or 0,
        "deltaLabel": f"+{money(row['delta'])}" if (row["delta"] or 0) else "",
        "franchise": row["franchise"] or "",
        "tagsLabel": row["tags_label"] or "",
        "note": row["note"] or "",
        "finish": row["finish"] or "",
        "rarity": row["rarity"] or "",
        "confidence": label,
        "guide": row["guide"] or "Shelf estimate",
        "publisher": row["publisher"] or "",
        "recent": row["recent"] or 0,
        "status": row["status"],
    }


def job_json(row: sqlite3.Row) -> dict:
    confidence = row["confidence"] or 0
    return {
        "id": row["id"],
        "itemId": row["item_id"],
        "photoId": row["photo_id"],
        "title": row["title"] or "Needs a title",
        "category": row["category"] or "other",
        "aisle": row["aisle"] or AISLE_NAME.get(row["category"] or "", "Other"),
        "meta": row["meta"] or "",
        "status": row["status"],
        "confidence": f"{round(confidence * 100)}%" if confidence else "",
        "note": row["note"] or "",
        "value": row["value"],
        "valueLabel": money(row["value"]) if row["value"] is not None else "—",
        "location": row["location"] or "",
    }


def stats_payload(db: sqlite3.Connection) -> dict:
    aisles = [
        dict(row)
        for row in db.execute("SELECT id, name, count, value FROM aisles ORDER BY sort")
    ]
    bulk = int(db.execute("SELECT value FROM meta WHERE key = 'bulk_filed'").fetchone()["value"])
    titles = sum(row["count"] for row in aisles) + bulk
    value = sum(row["value"] for row in aisles)
    batch = db.execute("SELECT * FROM batch WHERE id = 'saturday'").fetchone()
    drop = db.execute(
        "SELECT COUNT(*) AS n FROM jobs WHERE status != 'filed'"
    ).fetchone()["n"]
    mover = db.execute(
        "SELECT * FROM items ORDER BY delta DESC, value DESC LIMIT 1"
    ).fetchone()
    recent = [
        item_json(row)
        for row in db.execute("SELECT * FROM items ORDER BY recent ASC, title ASC LIMIT 6")
    ]
    movers = [
        item_json(row)
        for row in db.execute(
            "SELECT * FROM items WHERE delta > 0 ORDER BY delta DESC LIMIT 4"
        )
    ]
    return {
        "titles": titles,
        "titlesLabel": f"{titles:,}",
        "value": value,
        "valueLabel": money(value),
        "bulkFiled": bulk,
        "aisles": [
            {
                "id": row["id"],
                "name": row["name"],
                "count": row["count"],
                "countLabel": f"{row['count']:,}",
                "value": row["value"],
                "valueLabel": money(row["value"]),
            }
            for row in aisles
        ],
        "batch": {
            "path": batch["path"],
            "files": batch["files"],
            "ready": batch["ready"],
            "hold": batch["hold"],
        },
        "drop": drop,
        "topMover": item_json(mover) if mover else None,
        "movers": movers,
        "recent": recent,
    }


def list_items(db: sqlite3.Connection, query: dict) -> list[dict]:
    sql = "SELECT * FROM items WHERE 1 = 1"
    args: list = []
    category = query.get("category", [""])[0]
    if category and category != "all":
        sql += " AND category = ?"
        args.append(category)
    q = query.get("q", [""])[0].strip().lower()
    if q:
        sql += " AND (lower(title) LIKE ? OR lower(meta) LIKE ? OR lower(tags_label) LIKE ? OR lower(series) LIKE ?)"
        like = f"%{q}%"
        args.extend([like, like, like, like])
    sort = query.get("sort", ["recent"])[0]
    if sort == "title":
        sql += " ORDER BY title COLLATE NOCASE"
    elif sort == "value":
        sql += " ORDER BY value DESC"
    elif sort == "aisle":
        sql += " ORDER BY category, title"
    else:
        sql += " ORDER BY recent ASC, title ASC"
    limit = query.get("limit", [None])[0]
    if limit:
        sql += " LIMIT ?"
        args.append(int(limit))
    return [item_json(row) for row in db.execute(sql, args)]


def scryfall_card(card: dict) -> dict:
    prices = card.get("prices") or {}
    return {
        "name": card.get("name"),
        "set": (card.get("set") or "").upper(),
        "setName": card.get("set_name"),
        "collectorNumber": card.get("collector_number"),
        "rarity": card.get("rarity"),
        "usd": prices.get("usd"),
        "usdFoil": prices.get("usd_foil"),
    }


def scryfall_search(q: str) -> list[dict]:
    headers = {"User-Agent": "ColossalVault/0.1", "Accept": "application/json"}
    cards: list[dict] = []
    named = "https://api.scryfall.com/cards/named?fuzzy=" + urllib.parse.quote(q)
    try:
        request = urllib.request.Request(named, headers=headers)
        with urllib.request.urlopen(request, timeout=12) as response:
            cards.append(scryfall_card(json.loads(response.read().decode())))
    except Exception:
        pass
    search = "https://api.scryfall.com/cards/search?q=" + urllib.parse.quote(q)
    try:
        request = urllib.request.Request(search, headers=headers)
        with urllib.request.urlopen(request, timeout=12) as response:
            payload = json.loads(response.read().decode())
        for card in payload.get("data", [])[:5]:
            mapped = scryfall_card(card)
            if not any(existing["name"] == mapped["name"] and existing["set"] == mapped["set"] and existing["collectorNumber"] == mapped["collectorNumber"] for existing in cards):
                cards.append(mapped)
    except Exception:
        pass
    return cards[:5]


def vision_key() -> str:
    return os.environ.get("VISION_API_KEY") or os.environ.get("OPENAI_API_KEY") or ""


def identify_photo(image_bytes: bytes, mime: str) -> dict | None:
    key = vision_key()
    if not key:
        return None
    model = os.environ.get("VISION_MODEL", "gpt-4o-mini")
    base = os.environ.get("VISION_API_BASE", "https://api.openai.com/v1").rstrip("/")
    prompt = (
        "Identify this collectible. Reply with JSON only: "
        '{"category":"mtg|comic|cards|funko|figure|manga|memorabilia|game|pi|other",'
        '"title":"","series":"","meta":"","mark":"","year":"","finish":"","publisher":"","note":"","confidence":0.0}'
    )
    body = {
        "model": model,
        "temperature": 0.1,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{base64.b64encode(image_bytes).decode()}"},
                    },
                ],
            }
        ],
    }
    request = urllib.request.Request(
        base + "/chat/completions",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode())
        text = payload["choices"][0]["message"]["content"]
        return json.loads(text)
    except Exception:
        return None


class Handler(BaseHTTPRequestHandler):
    server_version = "ColossalVault/0.1"

    def log_message(self, fmt: str, *args) -> None:
        print("%s - %s" % (self.address_string(), fmt % args))

    def _send(self, code: int, body: bytes, content_type: str) -> None:
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code: int, payload) -> None:
        self._send(code, json.dumps(payload).encode(), "application/json; charset=utf-8")

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length > 12_000_000:
            raise ValueError("too large")
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode() or "{}")

    def do_GET(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)
        if path.startswith("/api/v1/"):
            self.handle_api_get(path, query)
            return
        self.serve_static(path)

    def do_POST(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        self.handle_api_write("POST", parsed.path)

    def do_PATCH(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        self.handle_api_write("PATCH", parsed.path)

    def serve_static(self, path: str) -> None:
        rel = path.lstrip("/") or "index.html"
        if rel.endswith("/"):
            rel += "index.html"
        file_path = (ROOT / rel).resolve()
        if not str(file_path).startswith(str(ROOT)) or not file_path.is_file():
            self._json(404, {"error": "Not found"})
            return
        mime = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        if file_path.suffix == ".js":
            mime = "text/javascript"
        data = file_path.read_bytes()
        self._send(200, data, mime)

    def handle_api_get(self, path: str, query: dict) -> None:
        db = connect()
        try:
            init_db(db)
            if path == "/api/v1/health":
                self._json(200, {"ok": True, "vision": bool(vision_key())})
                return
            if path == "/api/v1/stats":
                self._json(200, stats_payload(db))
                return
            if path == "/api/v1/items":
                self._json(200, {"items": list_items(db, query)})
                return
            if path.startswith("/api/v1/items/"):
                item_id = path.split("/")[-1]
                row = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()
                if not row:
                    self._json(404, {"error": "No such title"})
                    return
                self._json(200, item_json(row))
                return
            if path == "/api/v1/jobs":
                rows = db.execute(
                    """
                    SELECT * FROM jobs ORDER BY
                      CASE status WHEN 'ready' THEN 0 WHEN 'needs_label' THEN 1 WHEN 'tracking' THEN 2 ELSE 3 END,
                      created_at DESC
                    """
                ).fetchall()
                self._json(200, {"jobs": [job_json(row) for row in rows]})
                return
            if path == "/api/v1/batch":
                row = db.execute("SELECT * FROM batch WHERE id = 'saturday'").fetchone()
                self._json(200, dict(row))
                return
            if path == "/api/v1/scryfall":
                q = query.get("q", [""])[0]
                self._json(200, {"cards": scryfall_search(q) if q else []})
                return
            if path == "/api/v1/export.csv":
                self.send_export(db)
                return
            if path.startswith("/api/v1/photos/"):
                photo_id = path.split("/")[-1]
                row = db.execute("SELECT * FROM photos WHERE id = ?", (photo_id,)).fetchone()
                if not row:
                    self._json(404, {"error": "No photo"})
                    return
                blob = (PHOTOS / row["filename"]).read_bytes()
                self._send(200, blob, row["mime"])
                return
            self._json(404, {"error": "No such route"})
        finally:
            db.close()

    def send_export(self, db: sqlite3.Connection) -> None:
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(
            ["id", "category", "title", "series", "meta", "year", "condition", "location", "value", "franchise", "tags", "note", "finish", "rarity"]
        )
        for row in db.execute("SELECT * FROM items ORDER BY title"):
            writer.writerow(
                [
                    row["id"], row["category"], row["title"], row["series"], row["meta"],
                    row["year"], row["condition"], row["location"], row["value"],
                    row["franchise"], row["tags_label"], row["note"], row["finish"], row["rarity"],
                ]
            )
        data = buffer.getvalue().encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/csv; charset=utf-8")
        self.send_header("Content-Disposition", "attachment; filename=colossal-vault.csv")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def handle_api_write(self, method: str, path: str) -> None:
        db = connect()
        try:
            init_db(db)
            try:
                body = self._read_json()
            except ValueError:
                self._json(413, {"error": "Upload is too large"})
                return
            except json.JSONDecodeError:
                self._json(400, {"error": "Expected JSON"})
                return
            if path == "/api/v1/captures" and method == "POST":
                self.create_capture(db, body)
                return
            if path == "/api/v1/batch/file" and method == "POST":
                self.file_batch(db)
                return
            if path == "/api/v1/import" and method == "POST":
                self.import_csv(db, body)
                return
            if path.startswith("/api/v1/items/") and method == "PATCH":
                self.patch_item(db, path.split("/")[-1], body)
                return
            if path.startswith("/api/v1/jobs/") and path.endswith("/file") and method == "POST":
                job_id = path.split("/")[-2]
                self.file_job(db, job_id, body)
                return
            self._json(404, {"error": "No such route"})
        finally:
            db.close()

    def create_capture(self, db: sqlite3.Connection, body: dict) -> None:
        encoded = body.get("data") or ""
        try:
            blob = base64.b64decode(encoded)
        except Exception:
            self._json(400, {"error": "Photo data is not base64"})
            return
        if not blob:
            self._json(400, {"error": "Empty photo"})
            return
        mime = body.get("mime") or "image/jpeg"
        photo_id = uuid.uuid4().hex[:12]
        ext = ".png" if "png" in mime else ".webp" if "webp" in mime else ".jpg"
        (PHOTOS / f"{photo_id}{ext}").write_bytes(blob)
        stamp = now()
        db.execute(
            "INSERT INTO photos (id, item_id, filename, mime, created_at) VALUES (?, NULL, ?, ?, ?)",
            (photo_id, f"{photo_id}{ext}", mime, stamp),
        )
        guess = identify_photo(blob, mime)
        category = (guess or {}).get("category") or "other"
        if category not in AISLE_NAME:
            category = "other" if category == "other" else category
            if category not in AISLE_NAME:
                category = "comic"
        title = (guess or {}).get("title") or "Needs a title"
        status = "ready" if guess and guess.get("title") else "needs_label"
        confidence = float((guess or {}).get("confidence") or 0)
        job_id = "job-" + uuid.uuid4().hex[:8]
        db.execute(
            """
            INSERT INTO jobs (
              id, item_id, photo_id, title, category, aisle, meta, status,
              confidence, note, value, location, created_at, updated_at
            ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, NULL, '', ?, ?)
            """,
            (
                job_id,
                photo_id,
                title,
                category,
                AISLE_NAME.get(category, "Other"),
                (guess or {}).get("meta") or "",
                status,
                confidence,
                (guess or {}).get("note") or "Added from this desk",
                stamp,
                stamp,
            ),
        )
        db.commit()
        row = db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
        self._json(201, {"job": job_json(row), "vision": bool(guess)})

    def file_batch(self, db: sqlite3.Connection) -> None:
        batch = db.execute("SELECT * FROM batch WHERE id = 'saturday'").fetchone()
        ready = batch["ready"]
        current = int(db.execute("SELECT value FROM meta WHERE key = 'bulk_filed'").fetchone()["value"])
        db.execute("UPDATE meta SET value = ? WHERE key = 'bulk_filed'", (str(current + ready),))
        db.execute("UPDATE batch SET ready = 0 WHERE id = 'saturday'")
        db.commit()
        self._json(200, {"filed": ready, "stats": stats_payload(db)})

    def patch_item(self, db: sqlite3.Connection, item_id: str, body: dict) -> None:
        row = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()
        if not row:
            self._json(404, {"error": "No such title"})
            return
        fields = {
            "title": body.get("title", row["title"]),
            "category": body.get("category", row["category"]),
            "condition": body.get("condition", row["condition"]),
            "location": body.get("location", row["location"]),
            "note": body.get("note", row["note"]),
            "finish": body.get("finish", row["finish"]),
            "meta": body.get("meta", row["meta"]),
            "value": body.get("value", row["value"]),
        }
        if "value" in body and body["value"] != row["value"] and row["category"] in AISLE_NAME:
            delta = float(body["value"] or 0) - float(row["value"] or 0)
            db.execute("UPDATE aisles SET value = value + ? WHERE id = ?", (delta, row["category"]))
        db.execute(
            """
            UPDATE items SET title=?, category=?, condition=?, location=?, note=?, finish=?, meta=?, value=?, updated_at=?
            WHERE id=?
            """,
            (
                fields["title"], fields["category"], fields["condition"], fields["location"],
                fields["note"], fields["finish"], fields["meta"], fields["value"], now(), item_id,
            ),
        )
        db.commit()
        fresh = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()
        self._json(200, item_json(fresh))

    def file_job(self, db: sqlite3.Connection, job_id: str, body: dict) -> None:
        job = db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
        if not job:
            self._json(404, {"error": "No such drop"})
            return
        if job["status"] == "filed":
            self._json(200, {"job": job_json(job), "already": True})
            return
        title = body.get("title") or job["title"] or "Untitled"
        category = body.get("category") or job["category"] or "comic"
        if category not in AISLE_NAME:
            category = "comic"
        value = body.get("value", job["value"])
        try:
            value = float(value) if value not in (None, "", "—") else 0
        except (TypeError, ValueError):
            value = 0
        location = body.get("location") or job["location"] or ""
        stamp = now()
        item_id = job["item_id"]
        if not item_id:
            item_id = "item-" + uuid.uuid4().hex[:8]
            db.execute(
                """
                INSERT INTO items (
                  id, category, title, spine, short, series, meta, mark, year,
                  condition, location, value, delta, franchise, tags_label, note,
                  finish, rarity, confidence, guide, publisher, recent, status,
                  created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, '', ?, '', '', '', ?, ?, 0, '', '', ?, ?, '', ?, 'Shelf estimate', '', 0, 'confirmed', ?, ?)
                """,
                (
                    item_id, category, title, title[:18], title.upper()[:16],
                    body.get("meta") or job["meta"] or "", location, value,
                    job["note"] or "", body.get("finish") or "", job["confidence"], stamp, stamp,
                ),
            )
            db.execute(
                "UPDATE aisles SET count = count + 1, value = value + ? WHERE id = ?",
                (value, category),
            )
            if job["photo_id"]:
                db.execute("UPDATE photos SET item_id = ? WHERE id = ?", (item_id, job["photo_id"]))
        db.execute(
            """
            UPDATE jobs SET item_id=?, title=?, category=?, aisle=?, status='filed',
              value=?, location=?, meta=?, updated_at=? WHERE id=?
            """,
            (item_id, title, category, AISLE_NAME[category], value, location, body.get("meta") or job["meta"], stamp, job_id),
        )
        db.commit()
        fresh = db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
        self._json(200, {"job": job_json(fresh), "itemId": item_id})

    def import_csv(self, db: sqlite3.Connection, body: dict) -> None:
        text = body.get("csv") or ""
        reader = csv.DictReader(io.StringIO(text))
        added = 0
        stamp = now()
        for record in reader:
            title = (record.get("title") or "").strip()
            if not title:
                continue
            category = (record.get("category") or "comic").strip()
            if category not in AISLE_NAME:
                category = "comic"
            item_id = (record.get("id") or "").strip() or ("csv-" + uuid.uuid4().hex[:8])
            try:
                value = float(record.get("value") or 0)
            except ValueError:
                value = 0
            existing = db.execute("SELECT id FROM items WHERE id = ?", (item_id,)).fetchone()
            if existing:
                continue
            db.execute(
                """
                INSERT INTO items (
                  id, category, title, spine, short, series, meta, mark, year,
                  condition, location, value, delta, franchise, tags_label, note,
                  finish, rarity, confidence, guide, publisher, recent, status,
                  created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, NULL, 'Shelf estimate', '', 0, 'confirmed', ?, ?)
                """,
                (
                    item_id, category, title, title[:18], title.upper()[:14],
                    record.get("series") or "", record.get("meta") or "",
                    record.get("year") or "", record.get("condition") or "",
                    record.get("location") or "", value, record.get("franchise") or "",
                    record.get("tags") or "", record.get("note") or "",
                    record.get("finish") or "", record.get("rarity") or "", stamp, stamp,
                ),
            )
            db.execute(
                "UPDATE aisles SET count = count + 1, value = value + ? WHERE id = ?",
                (value, category),
            )
            added += 1
        db.commit()
        self._json(200, {"added": added})


def main() -> None:
    db = connect()
    init_db(db)
    db.close()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Colossal Vault on http://127.0.0.1:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
