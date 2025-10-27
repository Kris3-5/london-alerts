import requests
import feedparser
import json
from datetime import datetime

def save_json(filename, data):
    with open(f"data/{filename}", "w") as f:
        json.dump(data, f, indent=2)

# --- Police Alerts ---
def fetch_police_alerts():
    url = "https://data.police.uk/api/crimes-street/all-crime?lat=51.5074&lng=-0.1278&date=2025-10"
    try:
        response = requests.get(url)
        crimes = response.json()
        alerts = [{"title": crime["category"].replace("-", " ").title(), 
                   "date": crime["month"]} for crime in crimes[:10]]
        save_json("police.json", alerts)
    except Exception as e:
        print("Police fetch error:", e)

# --- Fire Alerts ---
def fetch_fire_alerts():
    url = "https://www.london-fire.gov.uk/feeds/rss-feed.xml"
    try:
        feed = feedparser.parse(url)
        alerts = [{"title": entry.title, "date": entry.published} for entry in feed.entries[:10]]
        save_json("fire.json", alerts)
    except Exception as e:
        print("Fire fetch error:", e)

# --- NHS Alerts ---
def fetch_nhs_alerts():
    url = "https://www.england.nhs.uk/feed/"
    try:
        feed = feedparser.parse(url)
        alerts = [{"title": entry.title, "date": entry.published} for entry in feed.entries[:10]]
        save_json("nhs.json", alerts)
    except Exception as e:
        print("NHS fetch error:", e)

# --- Weather Alerts ---
def fetch_weather_alerts():
    url = "https://www.metoffice.gov.uk/public/data/core/uk_forecast/rss/all.xml"
    try:
        feed = feedparser.parse(url)
        alerts = [{"title": entry.title, "date": entry.published} for entry in feed.entries[:10]]
        save_json("weather.json", alerts)
    except Exception as e:
        print("Weather fetch error:", e)

if __name__ == "__main__":
    fetch_police_alerts()
    fetch_fire_alerts()
    fetch_nhs_alerts()
    fetch_weather_alerts()
    print("All alerts updated successfully at", datetime.now())

