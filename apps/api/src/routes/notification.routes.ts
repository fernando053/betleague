import { Router } from 'express';
import { notificationService } from '../services/notification.service';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await notificationService.listByUser(req.userId!);
    res.json(notifications);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.get('/unread-count', authenticate, async (req: AuthRequest, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.userId!);
    res.json({ count });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.patch('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    await notificationService.markRead(req.params.id, req.userId!);
    res.json({ message: 'Marked as read' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Notificação não encontrada';
    res.status(403).json({ error: message });
  }
});

router.post('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await notificationService.markAllRead(req.userId!);
    res.json({ message: 'All marked as read' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

export default router;
