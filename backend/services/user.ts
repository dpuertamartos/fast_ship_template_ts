import bcrypt from 'bcrypt';
import logger from '../utils/logger';
// import { DOMINIO, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils/config';
// import { User } from '../models';
// import axios from 'axios';
// import jwt from 'jsonwebtoken';

const generatePasswordHash = async (password: string): Promise<string> => {
  try {
    const saltRounds: number = 10;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const passwordHash: string = await bcrypt.hash(password, saltRounds);
    return passwordHash;
  } catch (error) {
    logger.error('Error generating password hash:', error);
    throw new Error('Failed to generate password hash');
  }
};

// const handleGoogleLogin = async (code: string, redirectUri: string) => {
//     const ALLOWED_REDIRECT_URIS = [
//       `http://${DOMINIO}/auth/google/callback`,
//       `https://${DOMINIO}/auth/google/callback`,
//     ];
  
//     if (!ALLOWED_REDIRECT_URIS.includes(redirectUri)) {
//       logger.error('Invalid redirect URI:', redirectUri);
//       throw new Error(`Invalid redirect URI. Must be one of: ${ALLOWED_REDIRECT_URIS.join(', ')}`);
//     }
  
//     try {
//       // Exchange authorization code for tokens
//       const params = new URLSearchParams({
//         code,
//         client_id: GOOGLE_CLIENT_ID,
//         client_secret: GOOGLE_CLIENT_SECRET,
//         redirect_uri: redirectUri,
//         grant_type: 'authorization_code',
//       }).toString();
  
//       const tokenResponse = await axios.post(
//         'https://oauth2.googleapis.com/token',
//         params,
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       )
  
//       const { id_token } = tokenResponse.data as { id_token: string };
//       if (!id_token) {
//         logger.error('No id_token in response:', tokenResponse.data)
//         throw new Error('Invalid response from Google')
//       }
  
//       const userInfo: string = jwt.decode(id_token);
//       const { email } = userInfo
  
//       // Find or create user
//       let user = await User.findOne({
//         where: { email },
//         include: [{
//           model: models.TenantUser,
//           attributes: ['tenant_id', 'role'],
//           include: [{
//             model: models.Tenant,
//             attributes: ['code']
//           }]
//         }]
//       })
  
//       if (!user) {
//         user = await User.create({
//           email,
//         })
//       }
  
//       return user
  
//     } catch (error) {
//       logger.error('Google OAuth error:', {
//         message: error.message,
//         response: error.response?.data,
//         redirect_uri: redirectUri
//       })
  
//       if (error.response?.data?.error === 'invalid_grant') {
//         throw new Error('Authorization code expired or already used. Please try logging in again.')
//       }
  
//       throw error
//     }
//   }

export {
  generatePasswordHash,
//  handleGoogleLogin
};