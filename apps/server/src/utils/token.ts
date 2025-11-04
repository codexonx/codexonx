import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

type TokenType = 'RESET_PASSWORD' | 'VERIFY_EMAIL';

export const generateToken = async (userId: string, type: TokenType, expiresIn: string = '1d') => {
  // Generate random token
  const token = randomBytes(32).toString('hex');

  // Calculate expiration date
  const expiresAt = new Date();
  const timeValue = parseInt(expiresIn.substring(0, expiresIn.length - 1));
  const timeUnit = expiresIn.substring(expiresIn.length - 1);

  switch (timeUnit) {
    case 'h': // hours
      expiresAt.setHours(expiresAt.getHours() + timeValue);
      break;
    case 'd': // days
      expiresAt.setDate(expiresAt.getDate() + timeValue);
      break;
    case 'w': // weeks
      expiresAt.setDate(expiresAt.getDate() + timeValue * 7);
      break;
    default:
      expiresAt.setHours(expiresAt.getHours() + 24); // default: 24 hours
  }

  // Delete any existing tokens of the same type for this user
  await prisma.token.deleteMany({
    where: {
      userId,
      type,
    },
  });

  // Create token in database
  const tokenRecord = await prisma.token.create({
    data: {
      token,
      type,
      expiresAt,
      userId,
    },
  });

  return tokenRecord;
};
