import logger from '../utils/logger';
import { Request, Response, Router } from 'express';
import * as userService from '../services/user';
import { User, Role, UserRole } from '../models';

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

    const passwordHash = await userService.generatePasswordHash(password);

    // Use a transaction to ensure all database operations succeed or fail together
    const result = await User.sequelize!.transaction(async (t) => {
      const user = await User.create({
        email,
        passwordHash
      }, { transaction: t });

      const freeRole = await Role.findOne({ 
        where: { name: 'FREE' },
        transaction: t
      });
      
      if (!freeRole) {
        throw new Error('Free role not found');
      }

      await UserRole.create({
        userId: user.get('id'),
        roleId: freeRole.get('id')
      }, { transaction: t });

      return user;
    });

    res.status(201).json({
      id: result.get('id'),
      email: result.get('email')
    });

  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again later.' });
  }
});

// router.post('/google_login', async (req, res) => {
//     const { code, redirectUri, client_id } = req.body as { code: string; redirectUri: string, client_id: string};
  
//     try {
//       const user = await userService.handleGoogleLogin(code, redirectUri);
  
//       // Get all tenant roles for this user
//       const tenantRoles = user.TenantUsers ? user.TenantUsers.map(tu => ({
//         tenant_id: tu.tenant_id,
//         role: tu.role,
//         tenant_code: tu.Tenant.code
//       })) : [];
  
//       const userForToken = {
//         email: user.email,
//         id: user.id,
//         tenantRoles,
//         token_version: user.token_version
//       };
  
//       const token = jwt.sign(userForToken, config.JWT_SECRET, { expiresIn: config.TOKEN_EXPIRATION });
  
//       // Associate anonymous orders with the user
//       await associateAnonymousOrders(user.id, client_id, req.models);
  
//       res.status(200).send({
//         token,
//         email: user.email,
//         tenantRoles
//       });
//     } catch (error) {
//       logger.error('Error during Google login:', error);
//       res.status(401).json({
//         error: 'Google authentication failed'
//       });
//     }
// });

export default router;