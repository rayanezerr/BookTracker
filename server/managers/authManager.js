const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthManager {
    constructor(dbManager, jwtSecret) {
        this.dbManager = dbManager;
        this.jwtSecret = jwtSecret;
    }

    async getUsers() {
        return await this.dbManager.getUsers();
    }

    async createUser(userData) {
        const users = await this.getUsers();
        const user = users.find(u => u.username === userData.username);
        if (user) return null;

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = { username: userData.username, password: hashedPassword };
        await this.dbManager.insertUser(newUser);

        const token = jwt.sign({ username: newUser.username }, this.jwtSecret, { expiresIn: '1h' });
        return token;
    }

    async logInUser(username, password) {
        const users = await this.getUsers();
        const user = users.find(u => u.username === username);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, this.jwtSecret, { expiresIn: '1h' });
            return token;
        }
        return null;
    }

    async deleteUser(userToken) {
        try {
            const decoded = jwt.verify(userToken, this.jwtSecret);
            const username = decoded.username;

            await this.dbManager.deleteUser(username);
            return true;
        } catch (err) {
            return false;
        }
    }

    async validateToken(userToken) {
        try {
            const decoded = jwt.verify(userToken, this.jwtSecret);
            return decoded;
        } catch (err) {
            return null;
        }
    }
}

module.exports = AuthManager;