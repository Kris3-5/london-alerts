import feedparser, json, time

# Example feeds – replace with real RSS URLs
feeds = {
    "police": "https://news.met.police.uk/rss/all-news",
    "fire": "https://www.london-fire.gov.uk/news/rss/",
    "nhs": "https://www.england.nhs.uk/news/feed/",
    "weather": "https://www.metoffice.gov.uk/weather/warnings-and-advice/rss"
}

def fetch_feed(url):
    d = feedparser.parse(url)
    alerts = []
    for e in d.entries[:5]:
        alerts.append({
            "title": e.get("title", "No title"),
            "description": e.get("summary", ""),
            "link": e.get("link", "")
        })
    return alerts

for key, url in feeds.items():
    try:
        data = fetch_feed(url)
        with open(f"data/{key}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error fetching {key}: {e}")

print("✅ Feeds updated at", time.ctime())
