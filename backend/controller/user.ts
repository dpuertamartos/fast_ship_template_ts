import logger from '../utils/logger';
import { Request, Response, Router } from 'express';
import * as userService from '../services/user';
import { User } from '../models';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  // Validate email and password
  if (!email || !password) {
    res.status(400).json({ error: 'Email and Password are required' });
    return;
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await userService.generatePasswordHash(password);

    // Create the user
    const user = await User.create({
      email,
      passwordHash
    });

    res.status(201).json({
      id: user.get('id'),
      email: user.get('email')
    });

  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again later.' });
  }
});

export default router;