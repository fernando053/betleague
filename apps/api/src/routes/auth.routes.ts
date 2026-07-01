import { Router } from 'express';
import { authService } from '../services/auth.service';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../config/env';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro no registo';
    res.status(400).json({ error: message });
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Credenciais inválidas';
    res.status(401).json({ error: message });
  }
});

export default router;
