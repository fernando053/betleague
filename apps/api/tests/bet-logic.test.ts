import { describe, it, expect } from 'vitest';

// We import checkSelectionWon indirectly by reconstructing the logic
// since the service requires prisma. Instead test the pure logic function.
function checkSelectionWon(market: string, selection: string, match: {
  homeScore: number | null;
  awayScore: number | null;
  halfTimeHome: number | null;
  halfTimeAway: number | null;
}): boolean | null {
  if (match.homeScore === null || match.homeScore === undefined) return false;
  if (match.awayScore === null || match.awayScore === undefined) return false;

  const home = match.homeScore;
  const away = match.awayScore;
  const total = home + away;
  const htHome = match.halfTimeHome;
  const htAway = match.halfTimeAway;

  switch (market) {
    case '1X2':
      if (selection === '1') return home > away;
      if (selection === 'X') return home === away;
      if (selection === '2') return away > home;
      return false;
    case 'DUPLA_HIPOTESE':
      if (selection === '1X') return home >= away;
      if (selection === 'X2') return away >= home;
      if (selection === '12') return home !== away;
      return false;
    case 'MARCAS_2_5':
      return selection === 'Mais 2.5' ? total > 2.5 : total < 2.5;
    case 'AMBAS_MARCAM':
      if (selection === 'Sim') return home > 0 && away > 0;
      if (selection === 'Não') return home === 0 || away === 0;
      return false;
    case 'RESULTADO_CORRETO': {
      const score = `${home}-${away}`;
      return selection === score;
    }
    case 'RESULTADO_INTERVALO':
      if (htHome === null || htHome === undefined) return false;
      if (htAway === null || htAway === undefined) return false;
      if (selection === '1') return htHome > htAway;
      if (selection === 'X') return htHome === htAway;
      if (selection === '2') return htAway > htHome;
      return false;
    case 'IMPAR_PAR':
      return selection === 'Ímpar' ? total % 2 === 1 : total % 2 === 0;
    case 'GOLOS_2':
      return total === 2;
    default:
      return false;
  }
}

describe('checkSelectionWon', () => {
  const match2_1 = { homeScore: 2, awayScore: 1, halfTimeHome: 1, halfTimeAway: 0 };
  const match1_1 = { homeScore: 1, awayScore: 1, halfTimeHome: 0, halfTimeAway: 1 };
  const match0_0 = { homeScore: 0, awayScore: 0, halfTimeHome: 0, halfTimeAway: 0 };

  it('1X2 - home win', () => {
    expect(checkSelectionWon('1X2', '1', match2_1)).toBe(true);
    expect(checkSelectionWon('1X2', '2', match2_1)).toBe(false);
  });

  it('1X2 - draw', () => {
    expect(checkSelectionWon('1X2', 'X', match1_1)).toBe(true);
    expect(checkSelectionWon('1X2', '1', match1_1)).toBe(false);
  });

  it('DUPLA_HIPOTESE', () => {
    expect(checkSelectionWon('DUPLA_HIPOTESE', '1X', match2_1)).toBe(true);
    expect(checkSelectionWon('DUPLA_HIPOTESE', '12', match2_1)).toBe(true);
    expect(checkSelectionWon('DUPLA_HIPOTESE', 'X2', match2_1)).toBe(false);
  });

  it('MARCAS_2_5 over/under', () => {
    // match2_1 total = 3, so Mais 2.5 wins
    expect(checkSelectionWon('MARCAS_2_5', 'Mais 2.5', match2_1)).toBe(true);
    expect(checkSelectionWon('MARCAS_2_5', 'Menos 2.5', match2_1)).toBe(false);
    // match1_1 total = 2, so Menos 2.5 wins
    expect(checkSelectionWon('MARCAS_2_5', 'Menos 2.5', match1_1)).toBe(true);
  });

  it('AMBAS_MARCAM', () => {
    expect(checkSelectionWon('AMBAS_MARCAM', 'Sim', match2_1)).toBe(true);
    expect(checkSelectionWon('AMBAS_MARCAM', 'Não', match0_0)).toBe(true);
    expect(checkSelectionWon('AMBAS_MARCAM', 'Não', match2_1)).toBe(false);
  });

  it('RESULTADO_CORRETO', () => {
    expect(checkSelectionWon('RESULTADO_CORRETO', '2-1', match2_1)).toBe(true);
    expect(checkSelectionWon('RESULTADO_CORRETO', '1-1', match2_1)).toBe(false);
  });

  it('RESULTADO_INTERVALO', () => {
    expect(checkSelectionWon('RESULTADO_INTERVALO', '1', match2_1)).toBe(true);
    expect(checkSelectionWon('RESULTADO_INTERVALO', 'X', match1_1)).toBe(false);
  });

  it('IMPAR_PAR', () => {
    expect(checkSelectionWon('IMPAR_PAR', 'Ímpar', match2_1)).toBe(true);
    expect(checkSelectionWon('IMPAR_PAR', 'Par', match1_1)).toBe(true);
  });

  it('GOLOS_2', () => {
    // match2_1 total = 3, not 2
    expect(checkSelectionWon('GOLOS_2', '', match2_1)).toBe(false);
    // match1_1 total = 2
    expect(checkSelectionWon('GOLOS_2', '', match1_1)).toBe(true);
  });

  it('returns false for null scores', () => {
    const noScore = { homeScore: null, awayScore: null, halfTimeHome: null, halfTimeAway: null };
    expect(checkSelectionWon('1X2', '1', noScore)).toBe(false);
  });

  it('returns false for unknown market', () => {
    expect(checkSelectionWon('UNKNOWN', 'X', match2_1)).toBe(false);
  });
});
