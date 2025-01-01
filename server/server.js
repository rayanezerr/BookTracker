require('dotenv').config({ path: './utils/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const DBManager = require('./managers/dbManager');
const AuthManager = require('./managers/authManager');
const AuthRouter = require('./routes/auth');
const BookManager = require('./managers/bookManager');
const BookRouter = require('./routes/book');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

(async () => {
    try {
        const client = await MongoClient.connect(MONGO_URI);

        console.log('Connected to MongoDB');

        const dbManager = new DBManager(client, DB_NAME);
        const authManager = new AuthManager(dbManager, JWT_SECRET);
        const authRouter = new AuthRouter(authManager);
        const bookManager = new BookManager(dbManager);
        const bookRouter = new BookRouter(bookManager);

        const app = express();

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use('/auth', authRouter.router);
        app.use('/books', bookRouter.router);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start the server:', err);
    }
})();
