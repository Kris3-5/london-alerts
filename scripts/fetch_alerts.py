import feedparser
import json
from datetime import datetime

feeds = {
    "police": "https://news.met.police.uk/feed/",
    "fire": "https://www.london-fire.gov.uk/news/feed/",
    "nhs": "https://www.england.nhs.uk/feed/",
    "weather": "https://www.bbc.co.uk/weather/feeds"
}

def fetch_feed(url):
    try:
        parsed = feedparser.parse(url)
        items = []
        for entry in parsed.entries[:20]:
            title = entry.get("title", "No Title")
            description = entry.get("description", "") or entry.get("summary", "")
            try:
                date_iso = datetime(*entry.published_parsed[:6]).isoformat()
            except:
                date_iso = datetime.now().isoformat()
            items.append({
                "title": title,
                "description": description,
                "date": date_iso
            })
        if not items:
            items.append({
                "title": "No recent alerts",
                "description": "There are currently no alerts for this category.",
                "date": datetime.now().isoformat()
            })
        return items
    except Exception as e:
        return [{
            "title": "Error fetching alerts",
            "description": str(e),
            "date": datetime.now().isoformat()
        }]

for category, url in feeds.items():
    alerts = fetch_feed(url)
    data = {
        "last_updated": datetime.now().isoformat(),
        "alerts": alerts
    }
    with open(f"data/{category}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
