import { useState, useEffect } from "react";
import "./editbookPopup.css";
const url = import.meta.env.VITE_API_URL || "http://localhost:3000";


const EditBookPopup = ({ book, isOpen, onClose, onUpdate, onDelete }) => {
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      setStatus(book.status || "Plan to read");
      setRating(book.rating || "");
    }
  }, [isOpen, book]);

  const handleDelete = async (e) => { 
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${url}/books/${book.isbn}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete book");
      onDelete(book);
      onClose();
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = {
        ...book,
        status: status,
        rating: rating ? parseInt(rating) : null,
      };

      const response = await fetch(`${url}/books/update/${book.isbn}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: updatedBook.status,
          rating: updatedBook.rating,
        }),
      });

      if (!response.ok) throw new Error("Failed to update book");

      onUpdate(updatedBook);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Edit Book</h1>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <form onSubmit={handleSave}>
          <label>
            Status:
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Plan to read">Plan to read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="10"
            />
          </label>
          <div className="popup-buttons">
            <button type="button" onClick={handleDelete} className="delete-button">
              Delete book
            </button>
            <button type="submit" className="save-button">
              Save changes
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPopup;
