import feedparser, json
from datetime import datetime

feeds = {
    "police": "https://news.met.police.uk/rss/news",
    "fire": "https://www.london-fire.gov.uk/news/feed/",
    "nhs": "https://www.england.nhs.uk/feed/",
    "weather": "https://www.metoffice.gov.uk/weather/warnings-and-advice/rss"
}

def fetch_feed(url):
    try:
        parsed = feedparser.parse(url)
        items = []
        for entry in parsed.entries[:15]:
            title = entry.get("title", "No Title")
            desc = entry.get("description", entry.get("summary", ""))
            date = datetime.now().isoformat()
            items.append({"title": title, "description": desc, "date": date})
        return items or [{"title": "No recent alerts", "description": "None currently.", "date": datetime.now().isoformat()}]
    except Exception as e:
        return [{"title": "Error fetching", "description": str(e), "date": datetime.now().isoformat()}]

for category, url in feeds.items():
    data = {"last_updated": datetime.now().isoformat(), "alerts": fetch_feed(url)}
    with open(f"data/{category}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
