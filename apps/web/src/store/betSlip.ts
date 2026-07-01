import { create } from 'zustand';

interface BetSelection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  odds: number;
}

interface BetSlipStore {
  selections: BetSelection[];
  stake: number;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (matchId: string, market: string) => void;
  setStake: (stake: number) => void;
  clear: () => void;
  totalOdds: () => number;
}

export const useBetSlip = create<BetSlipStore>((set, get) => ({
  selections: [],
  stake: 10,

  addSelection: (selection) => {
    set((state) => {
      const exists = state.selections.find(
        (s) => s.matchId === selection.matchId && s.market === selection.market
      );
      if (exists) {
        return {
          selections: state.selections.map((s) =>
            s.matchId === selection.matchId && s.market === selection.market
              ? selection
              : s
          ),
        };
      }
      return { selections: [...state.selections, selection] };
    });
  },

  removeSelection: (matchId, market) => {
    set((state) => ({
      selections: state.selections.filter(
        (s) => !(s.matchId === matchId && s.market === market)
      ),
    }));
  },

  setStake: (stake) => set({ stake }),

  clear: () => set({ selections: [], stake: 10 }),

  totalOdds: () => {
    const { selections } = get();
    return selections.reduce((acc, s) => acc * s.odds, 1);
  },
}));

// Selector for derived totalOdds — use this in components instead of calling totalOdds()
export const selectTotalOdds = (state: BetSlipStore) =>
  state.selections.reduce((acc, s) => acc * s.odds, 1);
