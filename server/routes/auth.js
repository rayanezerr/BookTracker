const { HTTP_STATUS } = require("../utils/http");
const express = require("express");

class AuthRouter {

    constructor(authManager) {
        this.authManager = authManager;
        this.router = express.Router();
        this.configureRoutes();
    }

    configureRoutes() {

        this.router.use((req, res, next) => {
            res.header("Access-Control-Expose-Headers", "Authorization");
            next();
        });

        this.router.post('/create', async (req, res) => {
            const { username, password } = req.body;
            if (!password) return res.status(HTTP_STATUS.BAD_REQUEST).send();

            const userToken = await this.authManager.createUser({ username, password });
            if (userToken) {
                res.set('Authorization', `Bearer ${userToken}`);
                return res.status(HTTP_STATUS.CREATED).json({ message: "User created" });
            }
            return res.status(HTTP_STATUS.CONFLICT).json({ message: "User already exists" });
        });

        this.router.post('/login', async (req, res) => {
            const { username, password } = req.body;
            if (!password) return res.status(HTTP_STATUS.BAD_REQUEST).send();
            const userToken = await this.authManager.logInUser(username, password);
            if (userToken) {
                res.set('Authorization', `Bearer ${userToken}`);
                return res.status(HTTP_STATUS.OK).json({ message: "User connected" });
            }
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid credentials" });
        });

        this.router.delete('/', async (req, res) => {
            const authHeader = req.get("Authorization");
            if (!authHeader) return res.status(HTTP_STATUS.BAD_REQUEST).send();

            const userToken = authHeader.split(' ')[1];
            const isDeleted = await this.authManager.deleteUser(userToken);
            if (isDeleted) return res.status(HTTP_STATUS.NO_CONTENT).send();

            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token" });
        });
    }
}

module.exports = AuthRouter;
