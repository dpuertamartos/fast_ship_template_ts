import logger from '../utils/logger';
import { JWT_SECRET, TOKEN_EXPIRATION } from '../utils/config';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user';
import { User } from '../models';

const router = Router();


router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    // Check if the email is already registered
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

router.post('/google_login', async (req, res) => {
    const { code, redirectUri } = req.body as { code: string; redirectUri: string };
  
    try {
      const user = await userService.handleGoogleLogin(code, redirectUri);
  
      const userForToken = {
        email: user.get('email'),
        id: user.get('id'),
        //roles: user.get('roles'), // TODO: Add roles to user token
        token_version: user.get('token_version')
      };
  
      const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      res.status(200).send({
        token,
        email: user.get('email')
        //roles: user.roles // TODO: Add roles to response
      });
    } catch (error) {
      logger.error('Error during Google login:', error);
      res.status(401).json({
        error: 'Google authentication failed'
      });
    }
});

export default router;