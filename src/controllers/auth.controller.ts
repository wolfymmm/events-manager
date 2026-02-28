import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    console.log('Дані з форми:', email, name);
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, password: hashedPassword } })

    res.status(201).json({ id: user.id, email: user.email });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            process.env.JWT_SECRET || 'secret_key', 
            { expiresIn: '24h' }
        );

        res.json({ 
            message: 'Login successful', 
            token,
            user: { id: user.id, email: user.email } 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};