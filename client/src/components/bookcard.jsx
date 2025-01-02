import "./bookcard.css";

const Book = ({ book }) => {
  return (
    <div className="book-container">
      <img src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`} alt={book.title} className="book-image" />
      <div className="book-details">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>Status: {book.status}</p>
        <p>Rating: {book.rating || "N/A"}</p>
      </div>
    </div>
  );
};

export default Book;