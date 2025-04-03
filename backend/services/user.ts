import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import { DOMINIO, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, TOKEN_EXPIRATION } from '../utils/config';
import { User, Role, UserRole } from '../models';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const generatePasswordHash = async (password: string): Promise<string> => {
  try {
    const saltRounds: number = 10;
     
    const passwordHash: string = await bcrypt.hash(password, saltRounds);
    return passwordHash;
  } catch (error) {
    logger.error('Error generating password hash:', error);
    throw new Error('Failed to generate password hash');
  }
};

const createUser = async (email: string, password: string | undefined): Promise<User> => {

    const userCreationObject = {
        email,
        ...(password && { passwordHash: await generatePasswordHash(password) })
    };

    const result = await User.sequelize!.transaction(async (t) => {
        const user = await User.create(userCreationObject, { transaction: t });
  
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
    
    return result;

};

const getUserWithRoles = async (email: string): Promise<User | null> => {
  return User.findOne({ 
    where: { email },
    include: [{
      model: Role,
      attributes: ['name'],
      through: { attributes: [] }
    }]
  });
};

const handleGoogleLogin = async (code: string, redirectUri: string): Promise<LoginResponse> => {
    const ALLOWED_REDIRECT_URIS = [
      `http://${DOMINIO}/auth/google/callback`,
      `https://${DOMINIO}/auth/google/callback`,
    ];
  
    if (!ALLOWED_REDIRECT_URIS.includes(redirectUri)) {
      logger.error('Invalid redirect URI:', redirectUri);
      throw new Error(`Invalid redirect URI. Must be one of: ${ALLOWED_REDIRECT_URIS.join(', ')}`);
    }
  
    try {
      // Exchange authorization code for tokens
      const params = new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString();
  
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const { id_token } = tokenResponse.data as { id_token: string };
      if (!id_token) {
        logger.error('No id_token in response:', tokenResponse.data);
        throw new Error('Invalid response from Google');
      }
  
      const userInfo = jwt.decode(id_token);
      const { email } = userInfo as { email: string };
  
      // Find or create user
      let user: User | null = await getUserWithRoles(email);
  
      if (!user) {
        await createUser(email, undefined);
        user = await getUserWithRoles(email);
        
        if (!user) {
          throw new Error('Failed to create user');
        }
      }
  
      return generateLoginResponse(user);
  
    } catch (error: unknown) {
      logger.error('Google OAuth error:', {
        message: error instanceof Error ? error.message : String(error),
        response: error instanceof Error && 'response' in error 
          ? (error.response as { data?: unknown })?.data 
          : undefined,
        redirect_uri: redirectUri
      });
      if (error instanceof Error && 'response' in error && 
          (error.response as { data?: { error?: string } })?.data?.error === 'invalid_grant') {
        throw new Error('Authorization code expired or already used. Please try logging in again.');
      }
  
      throw error;
    }
};

interface LoginResponse {
  token: string;
  email: string;
  roles: string[];
}

const generateLoginResponse = (user: User): LoginResponse => {
  const roles = user.get('roles') as Role[] || [];
  const roleNames: string[] = roles.map((role: Role) => role.get('name') as string);

  const userForToken = {
    email: user.get('email') as string,
    id: user.get('id') as number,
    roles: roleNames
  };
  
  const token: string = jwt.sign(userForToken, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return {
    token,
    email: user.get('email') as string,
    roles: roleNames
  };
};

const login = async (email: string, password: string): Promise<LoginResponse> => {
  const user = await getUserWithRoles(email);

  if (!user) {
    throw new Error('User not found');
  }

  const passwordHash = user.get('passwordHash') as string | null;

  if (!passwordHash) {
    throw new Error('Password login not available for this user. Try Google Sign-In.');
  }

  const passwordCorrect: boolean = await bcrypt.compare(password, passwordHash);
  
  if (!passwordCorrect) {
    throw new Error('Invalid email or password');
  }

  return generateLoginResponse(user);
};

export {
  createUser,
  handleGoogleLogin,
  login
};