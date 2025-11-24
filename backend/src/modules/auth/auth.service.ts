import { prisma } from '../../lib/prisma';
import { comparePassword } from '../../lib/crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../lib/tokens';
import { UnauthorizedError } from '../../core/error';
import type { LoginInput, RefreshInput } from './auth.schemas';

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedError('User account is not active');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role.name,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
    },
  };
};

export const refreshSession = async ({ refreshToken }: RefreshInput) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedError();
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User account is not active');
    }

    const newPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      accessToken: generateAccessToken(newPayload),
      refreshToken: generateRefreshToken(newPayload),
    };
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }
};

