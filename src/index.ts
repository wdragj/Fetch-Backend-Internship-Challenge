import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { addPoints, spendPoints, getBalance } from './routes';

// Initialize Express app with port 8000
const app = express();
const PORT = 8000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.post('/add', addPoints);
app.post('/spend', spendPoints);
app.get('/balance', getBalance);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
