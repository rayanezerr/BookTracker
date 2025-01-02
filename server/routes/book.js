const { HTTP_STATUS } = require("../utils/http");
const { fetchBookFromOpenLibrary } = require("../utils/openlibrarycalls");
const express = require("express");
const jwt = require("jsonwebtoken");

const extractUsername = (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1];
  console.log(token);

  if (!token) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

class BookRouter {
  constructor(bookManager) {
    this.bookManager = bookManager;
    this.router = express.Router();
    this.configureRoutes();
  }

  configureRoutes() {
    this.router.use(extractUsername);

    this.router.post('/add', async (req, res) => {
      const { query, status, rating } = req.body;
      if (!query) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Query is required" });
      }
      try {
        const bookData = await fetchBookFromOpenLibrary(query);
        const newBook = await this.bookManager.addBook(req.username, { ...bookData, status, rating });
        return res.status(HTTP_STATUS.CREATED).json({ message: "Book added", book: newBook });
      } catch (error) {
        return res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
      }
    });

    this.router.put('/update/:bookId', async (req, res) => {
      const { bookId } = req.params;
      const { title, author, status, rating } = req.body;
      if (rating < 1 || rating > 10) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Rating must be between 1 and 10" });
      }
      const updateFields = {};
      if (title !== undefined) updateFields['books.$.title'] = title;
      if (author !== undefined) updateFields['books.$.author'] = author;
      if (status !== undefined) updateFields['books.$.status'] = status;
      if (rating !== undefined) updateFields['books.$.rating'] = rating;
      if (Object.keys(updateFields).length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "No valid fields to update" });
      }

      try {

        const updatedBook = await this.bookManager.updateBook(req.username, bookId, updateFields);
        return res.status(HTTP_STATUS.OK).json({ message: "Book updated", book: updatedBook });
      } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: error.message });
      }
    });

    this.router.get('/', async (req, res) => {
      try {
        const books = await this.bookManager.getBooks(req.username);
        return res.status(HTTP_STATUS.OK).json(books);
      } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    });

    this.router.get('/:bookId', async (req, res) => {
      const { bookId } = req.params;
      try {
        const book = await this.bookManager.getBookById(req.username, bookId);
        return res.status(HTTP_STATUS.OK).json(book);
      } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: error.message });
      }
    });
  }
}

module.exports = BookRouter;