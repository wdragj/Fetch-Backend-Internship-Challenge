import request from 'supertest';
import app from '../src/index';
import { transactions, pointsBalance } from '../src/routes';

// Reset the state before each test
beforeEach(() => {
    transactions.length = 0; // Clear the transactions array
    for (const payer in pointsBalance) {
        delete pointsBalance[payer]; // Clear the pointsBalance object
    }
});

// Tests for adding points (POST /add)
describe('POST /add - Adding Points API', () => {
    it('should add points successfully', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });
        
        expect(response.status).toBe(200);
    });
    
    it('should return an error of status 400 if there is no request body', async () => {
        const response = await request(app).post('/add');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid body length');
    });

    it('should return an error of status 400 if the request body length is 1', async () => {
        const response = await request(app)
        .post('/add')
        .send({ payer: 'DANNON' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid body length');
    });

    it('should return an error of status 400 if the request body length is 2', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            points: 5000
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid body length');
    });

    it('should return an error of status 400 if the request body length is greater than 3', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z',
            method: 'credit card',
            location: 'US',
            zipcode: 53703
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid body length');
    });

    it('should return an error of status 400 if payer is missing', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            buyer: 'DANNON',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid request: 'payer', 'points', or 'timestamp' is missing");
    });

    it('should return an error of status 400 if points is missing', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            money: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid request: 'payer', 'points', or 'timestamp' is missing");
    });

    it('should return an error of status 400 if timestamp is missing', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            points: 5000,
            time: '2020-11-02T14:00:00Z'
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid request: 'payer', 'points', or 'timestamp' is missing");
    });

    it('should return an error of status 400 if there is invalid data type for payer', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 123,
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid data types for payer, points, or timestamp');
    });

    it('should return an error of status 400 if there is invalid data type for points', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            points: '5000',
            timestamp: '2020-11-02T14:00:00Z'
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid data types for payer, points, or timestamp');
    });

    it('should return an error of status 400 if there is invalid data type for timestamp', async () => {
        const response = await request(app)
        .post('/add')
        .send({
            payer: 'DANNON',
            points: 5000,
            timestamp: 2020
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid data types for payer, points, or timestamp');
    });
});

// Tests for spending points (POST /spend)
describe('POST /spend - Spending Points API', () => {
    it('should spend points successfully', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        // Spend 3000 points; should return an array with payer: FREDDY and points: -3000
        const spendResponse = await request(app)
        .post('/spend')
        .send({ points: 3000 });

        expect(spendResponse.status).toBe(200);
        expect(spendResponse.body).toEqual([{"payer": "FREDDY", "points": -3000}]);

        // Check the balance; should be 2000 points left with payer: FREDDY
        const balanceResponse = await request(app).get('/balance');

        expect(balanceResponse.status).toBe(200);
        expect(balanceResponse.body).toEqual({ FREDDY: 2000 });
    });

    it('should return an error of status 400 if there is no request body', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        const response = await request(app).post('/spend');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid body length');
    });

    it('should return an error of status 400 if the request body length greater than 1', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        const response = await request(app)
        .post('/spend')
        .send({ points: 1000, method: 'credit card' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid body length');
    });

    it('should return an error of status 400 if there is invalid data type for points', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        const response = await request(app)
        .post('/spend')
        .send({ points: '1000' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid data type for points');
    });

    it('should return an error of status 400 if points is missing', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        const response = await request(app)
        .post('/spend')
        .send({ money: 10000 });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid request: 'points' is missing");
    });

    it('should return an error of status 400 if points is invalid: points < 0', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        const response = await request(app)
        .post('/spend')
        .send({ points: -2000 });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid points');
    });

    it('should return an error of status 400 if points is invalid: points = 0', async () => {
        // Add some points so there are enough to spend
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        const response = await request(app)
        .post('/spend')
        .send({ points: 0 });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Invalid points');
    });

    it('should return an error of status 400 if there are not enough points to spend when totalPoints > 0', async () => {
        // Add 1000 points
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 1000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        // Spend 3000 points; should return an error because there are only 1000 points
        const response = await request(app)
        .post('/spend')
        .send({ points: 3000 });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Not enough points');
    });

    it('should return an error of status 400 if there are not enough points to spend when totalPoints = 0', async () => {
        // Spend 3000 points; should return an error because there are no points to spend
        const response = await request(app)
        .post('/spend')
        .send({ points: 1000 });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Not enough points');
    });

    it('should spend points successfully with multiple payers (Spending just enough with resulting balance 0)', async () => {
        // Add a total of 8000 points
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 1000,
            timestamp: '2020-11-03T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'UNILEVER',
            points: 2000,
            timestamp: '2020-11-04T14:00:00Z'
        });

        // Spend 8000 points
        const spendResponse = await request(app)
        .post('/spend')
        .send({ points: 8000 });

        expect(spendResponse.status).toBe(200);
        expect(spendResponse.body).toEqual([
            { payer: 'FREDDY', points: -5000 },
            { payer: 'DANNON', points: -1000 },
            { payer: 'UNILEVER', points: -2000 }
        ]);

        // Check the balance; should be 2000 points left with payer: FREDDY and 0 points with payer: DANNON
        const balanceResponse = await request(app).get('/balance');

        expect(balanceResponse.status).toBe(200);
        expect(balanceResponse.body).toEqual({
            FREDDY: 0,
            DANNON: 0,
            UNILEVER: 0
        });
    });

    it('should spend points successfully with multiple payers (Spending more than enough with resulting balance > 0)', async () => {
        // Add a total of 10000 points
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 3000,
            timestamp: '2020-11-03T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'UNILEVER',
            points: 2000,
            timestamp: '2020-11-04T14:00:00Z'
        });

        // Spend 7000 points
        const spendResponse = await request(app)
        .post('/spend')
        .send({ points: 7000 });

        expect(spendResponse.status).toBe(200);
        expect(spendResponse.body).toEqual([
            { payer: 'FREDDY', points: -5000 },
            { payer: 'DANNON', points: -2000 }
        ]);

        // Check the balance
        const balanceResponse = await request(app).get('/balance');

        expect(balanceResponse.status).toBe(200);
        expect(balanceResponse.body).toEqual({
            FREDDY: 0,
            DANNON: 1000,
            UNILEVER: 2000
        });
    });

    it('should return an error of status 400 if there are not enough points to spend with multiple payers', async () => {
        // Add a total of 10000 points
        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 3000,
            timestamp: '2020-11-03T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'UNILEVER',
            points: 2000,
            timestamp: '2020-11-04T14:00:00Z'
        });

        // Spend 11000 points; should return an error because there are only 10000 points
        const response = await request(app)
        .post('/spend')
        .send({ points: 11000 });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid request: Not enough points');
    });

    it('should spend points successfully with multiple payers and negative transaction', async () => {
        // Add a total of 11300 points
        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 300,
            timestamp: '2022-10-31T10:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'UNILEVER',
            points: 200,
            timestamp: '2022-10-31T11:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'DANNON',
            points: -200,
            timestamp: '2022-10-31T15:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'MILLER COORS',
            points: 10000,
            timestamp: '2022-11-01T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 1000,
            timestamp: '2022-11-02T14:00:00Z'
        });

        // Spend 5000 points
        const spendResponse = await request(app)
        .post('/spend')
        .send({ points: 5000 });

        expect(spendResponse.status).toBe(200);
        expect(spendResponse.body).toEqual([
            { payer: 'DANNON', points: -100 },
            { payer: 'UNILEVER', points: -200 },
            { payer: 'MILLER COORS', points: -4700 }
        ]);

        // Check the balance
        const balanceResponse = await request(app).get('/balance');

        expect(balanceResponse.status).toBe(200);
        expect(balanceResponse.body).toEqual({
            'DANNON': 1000,
            'UNILEVER': 0,
            'MILLER COORS': 5300
        });
    });

    it('should spend points successfully while maintaining the order of transactions', async () => {
        // Add a total of 4000 points
        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 1000,
            timestamp: '2022-12-31T10:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'UNILEVER',
            points: 1000,
            timestamp: '2021-10-31T11:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 1000,
            timestamp: '2022-11-01T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 1000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        // Spend 3500 points
        const spendResponse = await request(app)
        .post('/spend')
        .send({ points: 3500 });

        expect(spendResponse.status).toBe(200);
        expect(spendResponse.body).toEqual([
            { payer: 'DANNON', points: -1500 },
            { payer: 'UNILEVER', points: -1000 },
            { payer: 'FREDDY', points: -1000 }
        ]);

        // Check the balance
        const balanceResponse = await request(app).get('/balance');

        expect(balanceResponse.status).toBe(200);
        expect(balanceResponse.body).toEqual({
            'DANNON': 500,
            'UNILEVER': 0,
            'FREDDY': 0
        });
    });
});

// Tests for getting balance (GET /balance)
describe('GET /balance - Getting Balance API', () => {
    it('should get the balance successfully', async () => {
        // Add some points
        await request(app).post('/add').send({
            payer: 'DANNON',
            points: 5000,
            timestamp: '2020-11-02T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'FREDDY',
            points: 3000,
            timestamp: '2020-11-03T14:00:00Z'
        });

        await request(app).post('/add').send({
            payer: 'UNILEVER',
            points: 2000,
            timestamp: '2020-11-04T14:00:00Z'
        });

        // Get the balance
        const response = await request(app).get('/balance');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            DANNON: 5000,
            FREDDY: 3000,
            UNILEVER: 2000
        });
    });

    it('should get an empty balance if there are no transactions', async () => {
        const response = await request(app).get('/balance');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });
});