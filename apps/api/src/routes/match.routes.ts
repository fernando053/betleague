import { Router } from 'express';
import { matchService } from '../services/match.service';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const cursor = req.query.cursor as string | undefined;
    const matches = await matchService.listUpcoming(limit, cursor);
    res.json(matches);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.get('/live', authenticate, async (_req: AuthRequest, res) => {
  try {
    const matches = await matchService.listLive();
    res.json(matches);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const match = await matchService.getById(req.params.id);
    res.json(match);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Jogo não encontrado';
    res.status(404).json({ error: message });
  }
});

router.post('/sync', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const count = await matchService.syncMatches();
    res.json({ message: `Synced ${count} matches` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.post('/sync-odds', authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const count = await matchService.applyScrapedOdds();
    res.json({ message: `Applied scraped odds to ${count} matches` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

export default router;
