import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import userRoutes from './routes/user.routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app; 