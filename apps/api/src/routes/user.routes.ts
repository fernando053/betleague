import { Router } from 'express';
import { z } from 'zod';
import { userService } from '../services/user.service';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { updateProfileSchema } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userService.getProfile(req.userId!);
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Utilizador não encontrado';
    res.status(404).json({ error: message });
  }
});

router.patch('/me', authenticate, validate(updateProfileSchema), async (req: AuthRequest, res) => {
  try {
    const user = await userService.updateProfile(req.userId!, req.body);
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
    res.status(400).json({ error: message });
  }
});

router.post('/change-password', authenticate, validate(changePasswordSchema), async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.userId!, currentPassword, newPassword);
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao alterar password';
    res.status(400).json({ error: message });
  }
});

export default router;
