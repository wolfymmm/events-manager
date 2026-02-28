import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ message: "Database is connected!", users: userCount });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});