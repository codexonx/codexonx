import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';
import { sendEmail } from '../utils/email';
import { generateToken } from '../utils/token';

const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
});

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Şifre gereklidir'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
});

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { email, password, name } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('Bu e-posta adresi zaten kullanımda', 409));
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate verification token
    const verificationToken = await generateToken(user.id, 'VERIFY_EMAIL', '1d');

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken.token}`;
    await sendEmail({
      to: email,
      subject: 'E-posta Adresinizi Doğrulayın',
      text: `E-posta adresinizi doğrulamak için lütfen şu bağlantıya tıklayın: ${verificationUrl}`,
      html: `
        <h1>Hoş Geldiniz!</h1>
        <p>Codexonx platformuna kaydolduğunuz için teşekkür ederiz.</p>
        <p>E-posta adresinizi doğrulamak için lütfen aşağıdaki düğmeye tıklayın:</p>
        <a href="${verificationUrl}" style="padding:10px 20px; background:#4338ca; color:white; text-decoration:none; border-radius:5px;">
          E-posta Adresimi Doğrula
        </a>
        <p>Bu bağlantı 24 saat sonra geçerliliğini yitirecektir.</p>
      `,
    });

    res.status(201).json({
      status: 'success',
      message: 'Kayıt başarılı. Lütfen e-postanızı doğrulayın.',
    });
  } catch (err) {
    next(err);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError('Geçersiz e-posta veya şifre', 401));
    }

    // Check password
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return next(new AppError('Geçersiz e-posta veya şifre', 401));
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return next(new AppError('Lütfen önce e-posta adresinizi doğrulayın', 403));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Logout user
export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Çıkış başarılı',
  });
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { email } = forgotPasswordSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı', 404));
    }

    // Generate reset token
    const resetToken = await generateToken(user.id, 'RESET_PASSWORD', '1h');

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}`;
    await sendEmail({
      to: email,
      subject: 'Şifre Sıfırlama',
      text: `Şifrenizi sıfırlamak için lütfen şu bağlantıya tıklayın: ${resetUrl}`,
      html: `
        <h1>Şifre Sıfırlama</h1>
        <p>Şifrenizi sıfırlamak için aşağıdaki düğmeye tıklayın:</p>
        <a href="${resetUrl}" style="padding:10px 20px; background:#4338ca; color:white; text-decoration:none; border-radius:5px;">
          Şifremi Sıfırla
        </a>
        <p>Bu bağlantı 1 saat sonra geçerliliğini yitirecektir.</p>
        <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelin.</p>
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
    });
  } catch (err) {
    next(err);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { token, password } = resetPasswordSchema.parse(req.body);

    // Find token
    const resetToken = await prisma.token.findUnique({
      where: {
        token,
        type: 'RESET_PASSWORD',
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return next(new AppError('Geçersiz veya süresi dolmuş token', 400));
    }

    // Check if token is expired
    if (resetToken.expiresAt && new Date(resetToken.expiresAt) < new Date()) {
      await prisma.token.delete({
        where: { id: resetToken.id },
      });
      return next(new AppError('Geçersiz veya süresi dolmuş token', 400));
    }

    // Hash new password
    const hashedPassword = await argon2.hash(password);

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
      },
    });

    // Delete used token
    await prisma.token.delete({
      where: { id: resetToken.id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz.',
    });
  } catch (err) {
    next(err);
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Find token
    const verifyToken = await prisma.token.findUnique({
      where: {
        token,
        type: 'VERIFY_EMAIL',
      },
    });

    if (!verifyToken) {
      return next(new AppError('Geçersiz veya süresi dolmuş token', 400));
    }

    // Check if token is expired
    if (verifyToken.expiresAt && new Date(verifyToken.expiresAt) < new Date()) {
      await prisma.token.delete({
        where: { id: verifyToken.id },
      });
      return next(new AppError('Geçersiz veya süresi dolmuş token', 400));
    }

    // Update user email verification status
    await prisma.user.update({
      where: { id: verifyToken.userId },
      data: {
        emailVerified: true,
      },
    });

    // Delete used token
    await prisma.token.delete({
      where: { id: verifyToken.id },
    });

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    next(err);
  }
};
