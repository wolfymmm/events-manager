import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data: RegisterDto = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({ 
      data: { 
        email: data.email, 
        name: data.name, 
        password: hashedPassword 
      } 
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User successfully registered', 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    next(error); 
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data: LoginDto = req.body;
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    next(error);
  }
};