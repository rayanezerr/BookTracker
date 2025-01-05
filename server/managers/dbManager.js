class DBManager {
  constructor(dbClient, dbName) {
    this.dbClient = dbClient;
    this.dbName = dbName;
    this.userCollection = dbClient.db(dbName).collection('users');
  }

  async getUsers() {
    return await this.userCollection.find().toArray();
  }

  async insertUser(user) {
    await this.userCollection.insertOne(user);
  }

  async deleteUser(username) {
    await this.userCollection.deleteOne({ username });
  }

  async findUser(username) {
    return await this.userCollection.findOne({ username });
  }

  async addBook(username, book) {
    await this.userCollection.updateOne(
      { username },
      { $push: { books: book } }
    );
  }

  async updateBook(username, bookTitle, updateFields) {
    const result = await this.userCollection.findOneAndUpdate(
      { username, 'books.title': bookTitle },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    return result;
  }

  async getBooks(username) {
    const user = await this.findUser(username);
    return user.books || [];
  }

  async getBookById(username, bookTitle) {
    const user = await this.findUser(username);
    return user.books?.find(b => b.title === bookTitle) || null;
  }

  async deleteBook(username, bookIsbn) {
    const result = await this.userCollection.findOneAndUpdate(
      { username },
      { $pull: { books: { isbn: bookIsbn } } },
      { returnDocument: 'after' }
    );

    return result;
  }
}

module.exports = DBManager;