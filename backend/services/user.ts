import bcrypt from 'bcrypt';
import logger from '../utils/logger';

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

export {
  generatePasswordHash
};