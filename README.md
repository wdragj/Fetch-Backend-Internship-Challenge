# Fetch-Backend-Internship-Challenge

A backend REST API that will help keep track of points and point transactions.
The API is served on port 8000, and endpoints accept and return JSON when required.
The transactions that are implemented are:

- Adding points
- Spending points
- Fetching the current point balance

### Assignment note:

**Although we normally keep track of many users with different IDs/accounts, this functionality is out of the scope of the assignment. Your code can assume it is only working with a single user and their point transactions.**

## Documentation

- [Development Tools](#development-tools)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
    - [POST /add (Add Points)](#1-add-points)
    - [POST /spend (Spend Points)](#2-spend-points)
    - [GET /balance (Get Balance)](#3-get-balance)
- [Testing](#testing)

## Development Tools

The following tools are used in this project:

- [`Node.js`](https://nodejs.org/en) (v20.18.0): Backend JavaScript runtime.
- [`Express`](https://expressjs.com/) (v4.21.1): Web framework for building the API.
- [`TypeScript`](https://www.typescriptlang.org/) (v5.6.3): Typed superset of JavaScript for safer development.
- [`Jest`](https://jestjs.io/) (v29.7.0): Testing framework for JavaScript and TypeScript.
- [`Nodemon`](https://www.npmjs.com/package/nodemon) (v3.1.7): Hot-reload tool to restart the server automatically when files change.
- [`Supertest`](https://www.npmjs.com/package/supertest) (v7.0.0): HTTP assertions library for testing API endpoints.
- [`ts-jest`](https://www.npmjs.com/package/ts-jest) (v29.2.5): Jest TypeScript preprocessor with source map support.
- [`ts-node`](https://www.npmjs.com/package/ts-node) (v10.9.2): TypeScript execution engine to run .ts files directly.
- [`Body-parser`](https://www.npmjs.com/package/body-parser) (v1.20.3): Middleware to parse incoming JSON request bodies.

To ensure proper TypeScript functionality, the following TypeScript types are included:

- [`@types/express`](https://www.npmjs.com/package/@types/express) (v5.0.0): TypeScript definitions for Express.
- [`@types/jest`](https://www.npmjs.com/package/@types/jest) (v29.5.13): TypeScript definitions for Jest.
- [`@types/node`](https://www.npmjs.com/package/@types/node) (v22.7.5): TypeScript definitions for Node.js.
- [`@types/supertest`](https://www.npmjs.com/package/@types/supertest) (v6.0.2): TypeScript definitions for Supertest.

## Quick Start

1. **Clone the repository**:
    ```bash
    git clone https://github.com/wdragj/Fetch-Backend-Internship-Challenge.git
    ```
2. **Cd into the project directory**:
    ```bash
    cd Fetch-Backend-Internship-Challenge
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Start the server**:
    - **For Development**: (For most development tasks, running `npm run dev` is sufficient)
        - **Run the development server** (To run the project directly with ts-node without needing a dist folder):
            ```bash
            npm run dev
            ```
    - **For Production**:
        - **Build the project for production** (Compiles the TypeScript files into JavaScript and stores them in the `dist/` folder):
            ```bash
            npm run build
            ```
        - **Run the production build** (runs the compiled JavaScript files from the `dist/` folder):
            ```bash
            npm start
            ```

## API Reference

### Base URL

All endpoints are served at `http://localhost:8000`.

### 1. Add Points

- **Route**: `/add`
- **Method**: `POST`
- **Description**: Add points from a specific payer with a timestamp.
- **Request Body (example)**:

    ```json
    {
        "payer": "DANNON",
        "points": 5000,
        "timestamp": "2020-11-02T14:00:00Z"
    }
    ```
    - Example `curl` in Windows CMD:
        ```bash
        curl -X POST http://localhost:8000/add -H "Content-Type: application/json" -d "{\"payer\": \"DANNON\", \"points\": 5000, \"timestamp\": \"2020-11-02T14:00:00Z\"}"
        ```

- **Response**:
    - Status `200`: Points added successfully. No response body.
    - Status `400`:
        - Invalid request: Invalid body length. No response body.
        - Invalid request: 'payer', 'points', or 'timestamp' is missing. No response body.
        - Invalid request: Invalid data types for payer, points. No response body.

### 2. Spend Points

- **Route**: `/spend`
- **Method**: `POST`
- **Description**: Spend points. Points will be deducted starting with the oldest transactions, and no payer’s balance will go negative.
- **Request Body (example)**:

    ```json
    { "points": 5000 }
    ```
    - Example `curl` in Windows CMD:
        ```bash
        curl -X POST http://localhost:8000/spend -H "Content-Type: application/json" -d "{\"points\": 5000}"
        ```

- **Response**:

    - Status `200`: Points spent successfully. Returns a list of payer names and the number of points that were subtracted. Example:
    
        ```json
        [
            { "payer": "DANNON", "points": -100 },
            { "payer": "UNILEVER", "points": -200 },
            { "payer": "MILLER COORS", "points": -4700 }
        ]
        ```

    - Status `400`:
        - Invalid request: Invaid body length. No response body.
        - Invalid request: 'points' is missing. No response body.
        - Invalid request: Invalid data type for points. No response body.
        - Invalid request: Invalid points. No response body.
        - Invalid request: Not enough points. No response body.

### 3. Get Balance

- **Route**: `/balance`
- **Method**: `GET`
- **Description**: Get the current point balance per payer.
- **Request (example)**:
    - Example `curl` in Windows CMD:
        ```bash
        curl -X GET http://localhost:8000/balance
        ```

- **Response**: This endpoint always return a 200 and give a response body similar to the following:
    - Status `200`: 
        ```json
        {
            "DANNON" : 1000,
            "UNILEVER": 0,
            "MILLER COORS": 5300
        }
        ```

## Testing

To run the tests, use the following command:

```bash
npm run test
```

This will run the Jest test suite and output the results in the terminal.  

This assignment is designed to handle transactions for a single user rather than multiple users with different IDs or accounts, which limits the variety of tests. Additionally, since no database is used, the testing focuses solely on the API endpoints and their functionality.