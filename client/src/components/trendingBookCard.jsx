import "./bookcard.css";

const TrendingBookCard= ({ book, isbn }) => {
  const author = book.author_name && book.author_name.length > 0 ? book.author_name[0] : "Unknown Author";
  return (
    <div className="book-container">
      <img src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`} alt={book.title} className="book-image" />
      <div className="book-details">
        <h3>{book.title}</h3>
        <p>{author}</p>
      </div>
    </div>
  );
};

export default TrendingBookCard;