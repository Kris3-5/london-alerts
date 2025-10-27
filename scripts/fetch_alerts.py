import feedparser
import json
from datetime import datetime

# RSS feeds
feeds = {
    "police": "https://news.met.police.uk/feed",      # Example feed URL
    "fire": "https://www.london-fire.gov.uk/feed",    # Example feed URL
    "nhs": "https://www.england.nhs.uk/feed",         # Example feed URL
    "weather": "https://www.metoffice.gov.uk/public-data/feed" # Example feed URL
}

# Function to fetch and parse feed
def fetch_feed(url):
    parsed = feedparser.parse(url)
    items = []
    for entry in parsed.entries[:20]:  # Limit latest 20 items
        title = entry.get("title", "No Title")
        description = entry.get("description", "") or entry.get("summary", "")
        published = entry.get("published", "") or entry.get("updated", "")
        try:
            date_iso = datetime.strptime(published[:25], "%a, %d %b %Y %H:%M:%S").isoformat()
        except:
            date_iso = datetime.now().isoformat()
        items.append({
            "title": title,
            "description": description,
            "date": date_iso
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

print("Alerts JSON updated successfully.")
