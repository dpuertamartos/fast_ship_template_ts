import logger from '../utils/logger';
import { Request, Response, Router } from 'express';
import * as userService from '../services/user';
import { User } from '../models';

const router = Router();


router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
    }

    const user = await userService.createUser(email, password);

    res.status(201).json({
      id: user.get('id'),
      email: user.get('email')
    });

  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again later.' });
  }
});

router.post('/google_login', async (req: Request, res: Response) => {
    const { code, redirectUri } = req.body as { code: string; redirectUri: string };
  
    try {
      const loginResponse = await userService.handleGoogleLogin(code, redirectUri);
      res.status(200).json(loginResponse);
    } catch (error) {
      logger.error('Error during Google login:', error);
      res.status(401).json({
        error: 'Google authentication failed'
      });
    }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({
      error: 'email and password are required'
    });
  }

  try {
    const loginResponse = await userService.login(email, password);
    res.status(200).json(loginResponse);
  } catch (error: unknown) {
    logger.error('Error during login:', error);

    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        error: 'User not found'
      });
    } else if (error instanceof Error && error.message === 'Invalid email or password') {
      res.status(401).json({
        error: 'Invalid email or password'
      });
    } else if (error instanceof Error && error.message.includes('Authorization code expired')) {
      res.status(401).json({
        error: error.message
      });
    } else {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
});

export default router;