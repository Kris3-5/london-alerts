import feedparser, json, os, sys

feeds = {
  "police":"https://news.met.police.uk/rss/all-news",
  "fire":"https://www.london-fire.gov.uk/news/rss/",
  "nhs":"https://www.england.nhs.uk/news/feed/",
  "weather":"https://www.metoffice.gov.uk/weather/warnings-and-advice/rss"
}

def fetch_feed(url):
  try:
      d = feedparser.parse(url)
      alerts = []
      if d.bozo:
          print(f"Warning: feed parse error for {url}")
      for e in d.entries[:5]: # latest 5 entries
          full_text = ""
          if 'content' in e:
             full_text = e.content[0].value
          elif 'summary' in e:
             full_text = e.summary
          elif 'description' in e:
             full_text = e.description
          alerts.append({
             "title": e.get("title","No title"),
             "description": full_text,
             "published": e.get("published","")
          })
      if not alerts: 
          alerts.append({"title":"No recent alerts","description":"None currently."})
      return alerts
  except Exception as e:
      print(f"Error fetching {url}: {e}")
      return [{"title":"Error","description":str(e)}]

os.makedirs("data", exist_ok=True)

for key, url in feeds.items():
    data = fetch_feed(url)
    try:
        with open(f"data/{key}.json", "w", encoding="utf-8") as f:
             json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error writing {key}.json: {e}")
        sys.exit(1)
