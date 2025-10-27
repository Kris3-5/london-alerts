import requests
import feedparser
import json
from datetime import datetime

feeds = {
    "police": "https://www.met.police.uk/feed.rss",
    "fire": "https://www.london-fire.gov.uk/feed.rss",
    "nhs": "https://www.england.nhs.uk/feed/",
    "weather": "https://www.metoffice.gov.uk/public/data/rss/feed.rss"
}

for category, url in feeds.items():
    feed = feedparser.parse(url)
    alerts = []
    for entry in feed.entries[:10]:
        alerts.append({
            "title": entry.title,
            "date": getattr(entry, "published", datetime.now().isoformat()),
            "description": getattr(entry, "summary", "")
        })
    with open(f"data/{category}.json", "w") as f:
        json.dump(alerts, f, indent=2)

