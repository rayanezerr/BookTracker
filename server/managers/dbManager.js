class DBManager {
  constructor(dbClient, dbName) {
      this.dbClient = dbClient;
      this.dbName = dbName;
      this.collection = dbClient.db(dbName).collection('users');
  }

  async getUsers() {
      return await this.collection.find().toArray();
  }

  async insertUser(user) {
      await this.collection.insertOne(user);
  }

  async deleteUser(username) {
      await this.collection.deleteOne({ username });
  }
}

module.exports = DBManager;