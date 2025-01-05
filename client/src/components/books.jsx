import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Book from "./bookcard";
import "./books.css";
import Sidebar from "./sidebar";
import EditBookPopup from "./editBookPopup";

const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [logedIn, setLogedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${url}/books/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setLogedIn(false);
          return;
        }
        const data = await response.json();
        setBooks(data);
        setLogedIn(true);
        setFilteredBooks(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, [token]);

  useEffect(() => {
    if (filter === "All") {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((book) => book.status === filter));
    }
  }, [filter, books, isEditing]);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsEditing(true);
  };

  const handleUpdate = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        const wewe = b.title === updatedBook.title ? updatedBook : b
        console.log(wewe)
        return wewe
      }
      )
    );
    console.log(books);
    setFilteredBooks((prevFilteredBooks) =>
      prevFilteredBooks.map((b) =>
        b.title === updatedBook.title ? updatedBook : b
      )
    );

    setIsEditing(false);
  };

  const handleDelete = (deletedBook) => {
    setBooks((prevBooks) =>
      prevBooks.filter((b) => b.title !== deletedBook.title)
    );

    console.log(books);
    setFilteredBooks((prevFilteredBooks) =>
      prevFilteredBooks.filter((b) => b.title !== deletedBook.title)
    );

    setIsEditing(false);
  };



  if (!token || !logedIn) return (
    <div className="my-books-page">
      <Sidebar />
      <h1 className="login-text">You must <Link to="/login"> Login</Link> to view this page</h1>
    </div>
  );

  return (
    <div className="my-books-page">
      <Sidebar />
      <div className="my-books-container">
        <h1>My Books</h1>
        <div className="filter-bar">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Plan to read">Plan to read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.title}>
              <Book key={book.title} book={book} onEdit={() => handleEdit(book)} />
            </div>
          ))}
        </div>
      </div>
      {isEditing && selectedBook && (
        <EditBookPopup
          book={selectedBook}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Books;
