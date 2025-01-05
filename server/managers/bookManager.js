class BookManager {
  constructor(dbManager) {
    this.dbManager = dbManager;
  }

  async addBook(username, book) {
    try {
      const existingBook = await this.dbManager.getBookById(username, book.title);
      if (existingBook) throw new Error("Book already exists");

      await this.dbManager.addBook(username, book);
      return book;
    } catch (error) {
      console.error('Error adding book:', error);
      throw new Error('Error adding book');
    }
  }

  async updateBook(username, bookTitle, updateFields) {
    try {
      const result = await this.dbManager.updateBook(username, bookTitle, updateFields);
  
      if (!result) throw new Error("Book not found");
      return result.books.find(b => b.title === bookTitle);
    } catch (error) {
      console.error('Error updating book:', error);
      throw new Error('Error updating book');
    }
  }

  async getBooks(username) {
    try {
      const userBooks = await this.dbManager.getBooks(username);
      return userBooks;
    } catch (error) {
      console.error('Error retrieving books:', error);
      throw new Error('Error retrieving books');
    }
  }

  async getBookById(username, bookTitle) {
    try {
      const book = await this.dbManager.getBookById(username, bookTitle);
      if (!book) throw new Error("Book not found");

      return book;
    } catch (error) {
      console.error('Error retrieving book:', error);
      throw new Error('Error retrieving book');
    }
  }

  async deleteBook(username, bookIsbn) {
    try {
      const result = await this.dbManager.deleteBook(username, bookIsbn);
      if (!result) throw new Error("Book not found");

      return result;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw new Error('Error deleting book');
    }
  }
}

module.exports = BookManager;
