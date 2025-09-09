import express from 'express';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;