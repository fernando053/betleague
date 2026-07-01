import cron from 'node-cron';
import { betService } from '../services/bet.service';

let isRunning = false;

export function startBetSettlement() {
  // Run immediately on startup
  runSettlement();

  // Then every 2 minutes
  cron.schedule('*/2 * * * *', () => runSettlement());

  console.log('[BetSettlement] Started - runs every 2 minutes + on startup');
}

async function runSettlement() {
  if (isRunning) return;
  isRunning = true;
  try {
    await betService.settlePendingBets();
    console.log('[BetSettlement] Settled pending bets');
  } catch (error) {
    console.error('[BetSettlement] Error:', error);
  } finally {
    isRunning = false;
  }
}
