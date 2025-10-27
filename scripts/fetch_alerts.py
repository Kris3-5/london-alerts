import feedparser
import json
from datetime import datetime

# Real RSS feeds
feeds = {
    "police": "https://news.met.police.uk/feed/",
    "fire": "https://www.london-fire.gov.uk/news/feed/",
    "nhs": "https://www.england.nhs.uk/feed/",
    "weather": "https://www.metoffice.gov.uk/public/data/feed/"  # Example feed
}

def fetch_feed(url):
    parsed = feedparser.parse(url)
    items = []

    # Limit to latest 20 entries
    for entry in parsed.entries[:20]:
        title = entry.get("title", "No Title")
        description = entry.get("description", "") or entry.get("summary", "")
        published = entry.get("published", "") or entry.get("updated", "")

        # Try to parse date, fallback to now
        try:
            # Many RSS feeds use RFC 822 format
            date_iso = datetime(*entry.published_parsed[:6]).isoformat()
        except:
            date_iso = datetime.now().isoformat()

        items.append({
            "title": title,
            "description": description,
            "date": date_iso
        })

    # Fallback alert if feed is empty
    if not items:
        items.append({
            "title": "No recent alerts",
            "description": "There are currently no alerts for this category.",
            "date": datetime.now().isoformat()
        })

    return items

# Fetch all feeds and save JSON
for category, url in feeds.items():
    alerts = fetch_feed(url)
    data = {
        "last_updated": datetime.now().isoformat(),
        "alerts": alerts
    }
    with open(f"data/{category}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Alerts JSON updated successfully.")
