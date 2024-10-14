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

// Prevent the server from starting automatically when running tests
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;