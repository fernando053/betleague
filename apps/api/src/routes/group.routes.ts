import { Router } from 'express';
import { groupService } from '../services/group.service';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createGroupSchema, joinGroupSchema } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, validate(createGroupSchema), async (req: AuthRequest, res) => {
  try {
    const group = await groupService.create(req.userId!, req.body.name);
    res.status(201).json(group);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar grupo';
    res.status(400).json({ error: message });
  }
});

router.post('/join', authenticate, validate(joinGroupSchema), async (req: AuthRequest, res) => {
  try {
    const group = await groupService.join(req.userId!, req.body.inviteCode);
    res.json(group);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar grupo';
    res.status(400).json({ error: message });
  }
});

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const groups = await groupService.listByUser(req.userId!);
    res.json(groups);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const group = await groupService.getById(req.params.id, req.userId!);
    res.json(group);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Acesso negado';
    res.status(403).json({ error: message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await groupService.delete(req.params.id, req.userId!);
    res.json({ message: 'Group deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar grupo';
    res.status(400).json({ error: message });
  }
});

export default router;
