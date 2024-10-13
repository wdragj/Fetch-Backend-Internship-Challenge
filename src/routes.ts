import { Request, Response } from 'express';

// Transaction interface to represent a transaction
interface Transaction {
    payer: string;
    points: number;
    timestamp: Date;
}

// Global variables
let transactions: Transaction[] = []; // Transactions history represented as Transactions array to store all transactions
let pointsBalance: Record<string, number> = {}; // Points balance represented as Record<string, number> to store points balance by payer

// POST /add Endpoint
export const addPoints = (req: Request, res: Response) => {
    const { payer, points, timestamp } = req.body; // Destructure payer, points, and timestamp from request body

    // Check if payer, points, or timestamp is missing
    if (!payer || !points || !timestamp) {
        res.status(400).json({ error: "Invalid request body" }); // Return a status code of 400 and a message saying the request body is invalid
        return;
    }

    // Create new transaction
    const newTransaction: Transaction = { payer, points, timestamp: new Date(timestamp) };

    // Add transaction
    transactions.push(newTransaction);

    // Update balance by payer
    if (!pointsBalance[payer]) {
        pointsBalance[payer] = 0;
    }
    pointsBalance[payer] += points;

    res.sendStatus(200); // Respond with a status code of 200, no response body needed
};

// POST /spend Endpoint
export const spendPoints = (req: Request, res: Response) => {
    const { points } = req.body; // Destructure points from request body

    // Check if points is missing or invalid
    if (!points || points <= 0) {
        res.status(400).json({ error: "Invalid points" }); // Return a status code of 400 and a message saying the points are invalid
        return;
    }

    // Calculate total points
    const totalPoints = Object.values(pointsBalance).reduce((sum, curr) => sum + curr, 0);

     // Check if a request was made to spend more points than what a user has in total
    if (points > totalPoints) {
        res.status(400).send("Not enough points."); // Return a status code of 400 and a message saying the user does not have enough points
        return;
    }

    // Sort transactions by timestamp (FIFO)
    transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let pointsToSpend = points; // Current points to spend
    const spentPoints: Record<string, number> = {}; // Points spent by payer

    // Calculate who to remove points from by iterating through transactions
    for (const transaction of transactions) {
        if (pointsToSpend === 0) break;

        const availablePoints = Math.min(transaction.points, pointsToSpend);

        // Update balance, transaction, and current points to spend
        pointsBalance[transaction.payer] -= availablePoints;
        transaction.points -= availablePoints;
        pointsToSpend -= availablePoints;

        // Update points spent by payer
        if (!spentPoints[transaction.payer]) {
            spentPoints[transaction.payer] = 0;
        }
        spentPoints[transaction.payer] -= availablePoints;
    }
    
    // Remove fully spent transactions
    transactions = transactions.filter(transaction => transaction.points !== 0);

    // Format response
    const result = Object.keys(spentPoints).map(payer => ({
        payer,
        points: spentPoints[payer],
    }));

    res.status(200).json(result); // Respond with a status code of 200 and a list of payer names and the number of points that were subtracted
};

// GET /balance Endpoint
export const getBalance = (_req: Request, res: Response) => {
    res.status(200).json(pointsBalance); // Respond with a status code of 200 and the points balance
};
