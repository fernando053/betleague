import { Router } from 'express';
import { z } from 'zod';
import { adminService } from '../services/admin.service';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  balance: z.number().min(0).max(1000000).optional().default(100),
});

const updateUserSchema = z.object({
  balance: z.number().min(0).max(1000000).optional(),
  isBlocked: z.boolean().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'Pelo menos um campo obrigatório' });

router.get('/stats', async (_req: AuthRequest, res) => {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.get('/users', async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await adminService.listUsers(page);
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.post('/users', validate(createUserSchema), async (req: AuthRequest, res) => {
  try {
    const { name, email, password, balance } = req.body;
    const user = await adminService.createUser(name, email, password, balance);
    res.status(201).json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar utilizador';
    res.status(400).json({ error: message });
  }
});

router.patch('/users/:id', validate(updateUserSchema), async (req: AuthRequest, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar utilizador';
    res.status(400).json({ error: message });
  }
});

router.delete('/users/:id', async (req: AuthRequest, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ message: 'Utilizador eliminado' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar utilizador';
    res.status(400).json({ error: message });
  }
});

router.get('/groups', async (_req: AuthRequest, res) => {
  try {
    const groups = await adminService.listGroups();
    res.json(groups);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ error: message });
  }
});

router.delete('/groups/:id', async (req: AuthRequest, res) => {
  try {
    await adminService.deleteGroup(req.params.id);
    res.json({ message: 'Grupo eliminado' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar grupo';
    res.status(400).json({ error: message });
  }
});

export default router;
