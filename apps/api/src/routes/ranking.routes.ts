import { Router } from 'express';
import { rankingService } from '../services/ranking.service';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/global', authenticate, async (_req: AuthRequest, res) => {
  try {
    const rankings = await rankingService.getGlobal();
    res.json(rankings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.get('/group/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const rankings = await rankingService.getGroup(req.params.id, req.userId!);
    res.json(rankings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Acesso negado';
    res.status(403).json({ error: message });
  }
});

export default router;
