import cron from 'node-cron';
import { matchService } from '../services/match.service';

let isRunning = false;

export function startMatchSync() {
  cron.schedule('*/30 * * * *', async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      const count = await matchService.syncMatches();
      console.log(`[MatchSync] Synced ${count} matches`);
    } catch (error) {
      console.error('[MatchSync] Error:', error);
    } finally {
      isRunning = false;
    }
  });

  console.log('[MatchSync] Started - runs every 30 minutes');
}
