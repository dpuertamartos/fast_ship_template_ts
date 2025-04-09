import logger from '../utils/logger';
import { Request, Response, Router, NextFunction } from 'express';
import * as userService from '../services/user';
import { User } from '../models';
import { emailPasswordSchema, googleLoginSchema } from '../schemas/userSchema';
import createError from 'http-errors';


const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = emailPasswordSchema.parse(req.body);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      next(createError(400, 'Email already registered'));
    }

    const user = await userService.createUser(email, password);

    res.status(201).json({
      id: user.get('id'),
      email: user.get('email')
    });

  } catch (error) {
    logger.error('Error registering user.');
    next(error);
  }
});

router.post('/google_login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, redirectUri } = googleLoginSchema.parse(req.body);
    const loginResponse = await userService.handleGoogleLogin(code, redirectUri);
    res.status(200).json(loginResponse);
  } catch (error) {
    logger.error('Error during Google login.');

    if (error instanceof Error) {
        if (error.message.includes('Authorization code expired')) {
          next(createError(401, error.message));
        }
        if (error.message.includes('Invalid redirect URI')) {
          next(createError(400, error.message));
        }
    }
    
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = emailPasswordSchema.parse(req.body);
    const loginResponse = await userService.login(email, password);
    res.status(200).json(loginResponse);
  } catch (error) {
    logger.error('Error during login.');

    if (error instanceof Error) {
      if (error.message === 'User not found') {
        next(createError(404, 'User not found'));
      } else if (error.message === 'Invalid email or password') {
        next(createError(401, 'Invalid email or password'));
      } else if (error.message.includes('Password login not available')) {
        next(createError(400, error.message));
     }
    }

    next(error);
  }
});

export default router;