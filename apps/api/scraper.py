import json
import sys
import os

# Get script directory dynamically
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from scrapling.fetchers import Fetcher
from odds_engine import generate_all_odds

def scrape_odds():
    url = "https://oddspedia.com/football/world/world-cup"
    print(f"Scraping {url}...")
    page = Fetcher.get(url, stealthy_headers=True)

    match_rows = page.css('.match-row')
    print(f"Found {len(match_rows)} matches")

    matches = []
    for row in match_rows:
        try:
            texts = [t.strip() for t in row.css('::text').getall() if t.strip()]
            odds_vals = [o.text.strip() for o in row.css('.odd-box__value') if o.text and o.text.strip()]

            if len(odds_vals) < 3:
                continue

            teams = []
            for t in texts:
                if t in ['Home', 'Draw', 'Away', 'FT', 'HT'] or '.' in t:
                    continue
                if t.replace(' ', '').isdigit():
                    continue
                if 'Jun' in t or 'Jul' in t or ':' in t:
                    continue
                teams.append(t)

            if len(teams) < 2:
                continue

            odds1 = float(odds_vals[0])
            oddsX = float(odds_vals[1])
            odds2 = float(odds_vals[2])

            status = 'finished' if 'FT' in texts else 'live' if any(':' in t for t in texts) else 'scheduled'

            # Generate all markets using Poisson model
            all_odds = generate_all_odds(odds1, oddsX, odds2)

            matches.append({
                "homeTeam": teams[0],
                "awayTeam": teams[1],
                "status": status,
                "allOdds": all_odds,
            })

        except Exception as e:
            print(f"Error: {e}")
            continue

    output_path = os.path.join(SCRIPT_DIR, "odds.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(matches, f, ensure_ascii=False, indent=2)

    print(f"\nSaved {len(matches)} matches with Poisson-generated odds")
    for m in matches[:3]:
        print(f"\n{m['homeTeam']} vs {m['awayTeam']}:")
        for market, selections in list(m['allOdds'].items())[:5]:
            print(f"  {market}: {selections}")

    return matches

if __name__ == "__main__":
    scrape_odds()
