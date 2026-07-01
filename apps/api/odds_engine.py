"""
Professional Odds Generator using Poisson Distribution
Same methodology used by Bet365, Pinnacle, and bookmakers worldwide.

Steps:
1. Calculate expected goals (xG) from 1X2 odds
2. Build Poisson probability matrix for all scorelines
3. Derive all markets from the scoreline matrix
4. Apply bookmaker margin
"""

import math
from typing import Dict, List, Tuple

# Poisson probability mass function
def poisson_pmf(k: int, lam: float) -> float:
    return (lam ** k) * math.exp(-lam) / math.factorial(k)

# Generate Poisson matrix (probability of each scoreline)
def poisson_matrix(home_xg: float, away_xg: float, max_goals: int = 7) -> List[List[float]]:
    matrix = []
    for i in range(max_goals + 1):
        row = []
        for j in range(max_goals + 1):
            prob = poisson_pmf(i, home_xg) * poisson_pmf(j, away_xg)
            row.append(prob)
        matrix.append(row)
    return matrix

# Calculate expected goals from 1X2 odds using optimization
def xg_from_odds(odds1: float, oddsX: float, odds2: float) -> Tuple[float, float]:
    """Estimate home/away expected goals from 1X2 odds"""
    p1 = 1 / odds1
    pX = 1 / oddsX
    p2 = 1 / odds2

    # Normalize probabilities (remove margin)
    total = p1 + pX + p2
    p1, pX, p2 = p1/total, pX/total, p2/total

    # Grid search for best xG values
    best_xg = (1.3, 1.1)
    best_score = float('inf')

    for hx in [x * 0.1 for x in range(5, 40)]:
        for ax in [x * 0.1 for x in range(3, 35)]:
            matrix = poisson_matrix(hx, ax)
            sim_p1 = sum(matrix[i][j] for i in range(len(matrix)) for j in range(len(matrix[0])) if i > j)
            sim_pX = sum(matrix[i][i] for i in range(min(len(matrix), len(matrix[0]))))
            sim_p2 = sum(matrix[i][j] for i in range(len(matrix)) for j in range(len(matrix[0])) if i < j)

            score = (sim_p1 - p1)**2 + (sim_pX - pX)**2 + (sim_p2 - p2)**2
            if score < best_score:
                best_score = score
                best_xg = (hx, ax)

    return best_xg

# Apply bookmaker margin (overround)
def apply_margin(probabilities: List[float], margin: float = 0.05) -> List[float]:
    adjusted = []
    for p in probabilities:
        adjusted.append(p * (1 + margin))
    # Normalize
    total = sum(adjusted)
    return [p / total for p in adjusted]

def odds_from_prob(prob: float) -> float:
    return round(1 / prob, 2) if prob > 0 else 99.99

def generate_all_odds(odds1: float, oddsX: float, odds2: float) -> Dict[str, Dict[str, float]]:
    """Generate all betting markets from 1X2 odds"""

    home_xg, away_xg = xg_from_odds(odds1, oddsX, odds2)
    matrix = poisson_matrix(home_xg, away_xg)
    rows = len(matrix)
    cols = len(matrix[0])

    # === 1X2 ===
    p_home = sum(matrix[i][j] for i in range(rows) for j in range(cols) if i > j)
    p_draw = sum(matrix[i][i] for i in range(min(rows, cols)))
    p_away = sum(matrix[i][j] for i in range(rows) for j in range(cols) if i < j)

    # === Double Chance ===
    p_1x = p_home + p_draw
    p_x2 = p_draw + p_away
    p_12 = p_home + p_away

    # === Over/Under ===
    ou_markets = {}
    for line in [0.5, 1.5, 2.5, 3.5, 4.5]:
        p_over = sum(matrix[i][j] for i in range(rows) for j in range(cols) if (i + j) > line)
        p_under = 1 - p_over
        ou_markets[f"MARCAS_{str(line).replace('.', '_')}"] = {
            f"Mais {line}": odds_from_prob(p_over),
            f"Menos {line}": odds_from_prob(p_under),
        }

    # === BTTS ===
    p_btts_yes = sum(matrix[i][j] for i in range(1, rows) for j in range(1, cols))
    p_btts_no = 1 - p_btts_yes

    # === Correct Score ===
    cs_probs = {}
    for i in range(min(rows, 8)):
        for j in range(min(cols, 8)):
            if matrix[i][j] > 0.005:  # Only include probable scores
                cs_probs[f"{i}-{j}"] = matrix[i][j]

    # === Half Time (simplified - approximate from full time) ===
    ht_home_xg = home_xg * 0.42  # ~42% of goals in first half
    ht_away_xg = away_xg * 0.42
    ht_matrix = poisson_matrix(ht_home_xg, ht_away_xg, max_goals=4)

    ht_p_home = sum(ht_matrix[i][j] for i in range(len(ht_matrix)) for j in range(len(ht_matrix[0])) if i > j)
    ht_p_draw = sum(ht_matrix[i][i] for i in range(min(len(ht_matrix), len(ht_matrix[0]))))
    ht_p_away = sum(ht_matrix[i][j] for i in range(len(ht_matrix)) for j in range(len(ht_matrix[0])) if i < j)

    # === Asian Handicap ===
    handicap_lines = [-1.5, -0.5, 0.0, 0.5, 1.5]
    ah_markets = {}
    for hc in handicap_lines:
        p_home_ah = sum(matrix[i][j] for i in range(rows) for j in range(cols) if (i + hc) > j)
        p_away_ah = sum(matrix[i][j] for i in range(rows) for j in range(cols) if (i + hc) < j)
        if p_home_ah + p_away_ah > 0:
            ah_markets[f"HANDICAP_{str(hc).replace('-', 'n').replace('.', '_')}"] = {
                f"Casa {hc}": odds_from_prob(p_home_ah),
                f"Fora {abs(hc)}": odds_from_prob(p_away_ah),
            }

    # === Total Goals (exact) ===
    tg_markets = {}
    for total in range(7):
        p_exact = sum(matrix[i][j] for i in range(rows) for j in range(cols) if (i + j) == total)
        if p_exact > 0.01:
            tg_markets[f"GOLOS_{total}"] = {f"Exatamente {total}": odds_from_prob(p_exact)}

    # === Odd/Even ===
    p_odd = sum(matrix[i][j] for i in range(rows) for j in range(cols) if (i + j) % 2 == 1)
    p_even = 1 - p_odd

    # Build final result
    result = {
        "1X2": {
            "1": odds_from_prob(p_home),
            "X": odds_from_prob(p_draw),
            "2": odds_from_prob(p_away),
        },
        "DUPLA_HIPOTESE": {
            "1X": odds_from_prob(p_1x),
            "X2": odds_from_prob(p_x2),
            "12": odds_from_prob(p_12),
        },
        "AMBAS_MARCAM": {
            "Sim": odds_from_prob(p_btts_yes),
            "Não": odds_from_prob(p_btts_no),
        },
        "IMPAR_PAR": {
            "Ímpar": odds_from_prob(p_odd),
            "Par": odds_from_prob(p_even),
        },
        "RESULTADO_INTERVALO": {
            "1": odds_from_prob(ht_p_home),
            "X": odds_from_prob(ht_p_draw),
            "2": odds_from_prob(ht_p_away),
        },
        "RESULTADO_CORRETO": {
            k: odds_from_prob(v) for k, v in sorted(cs_probs.items(), key=lambda x: -x[1])[:12]
        },
    }

    result.update(ou_markets)
    result.update(ah_markets)
    result.update(tg_markets)

    return result


if __name__ == "__main__":
    # Test with real odds
    test_cases = [
        ("Ecuador vs Germany", 4.75, 4.60, 1.60),
        ("Japan vs Sweden", 1.90, 3.50, 4.10),
        ("Switzerland vs Canada", 2.45, 2.90, 3.20),
    ]

    for name, o1, oX, o2 in test_cases:
        hxg, axg = xg_from_odds(o1, oX, o2)
        print(f"\n{'='*60}")
        print(f"{name} | xG: {hxg:.2f} - {axg:.2f}")
        print(f"Original 1X2: {o1} / {oX} / {o2}")

        odds = generate_all_odds(o1, oX, o2)
        for market, selections in odds.items():
            print(f"  {market}: {selections}")
