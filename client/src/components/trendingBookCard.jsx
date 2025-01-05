import "./bookcard.css";
const url = import.meta.env.VITE_API_URL || "http://localhost:3000";


const TrendingBookCard= ({ book, isbn }) => {
  const author = book.author_name && book.author_name.length > 0 ? book.author_name[0] : "Unknown Author";
  const token = localStorage.getItem("token");
  const handleAddBook = async () => {
    try {
      const response = await fetch(`${url}/books/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: book.title,
          status: "Plan to read",
          rating: null
        }),
      });

      if (!response.ok) throw new Error("Failed to add book");
      alert("Book added successfully!");
    } catch (error) {
      console.error(error);
      alert("Book already added");
    }
  };
  return (
    <div className="book-container">
      <img src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`} alt={book.title} className="book-image" />
      <div className="book-details">
        <h3>{book.title}</h3>
        <p>{author}</p>
        <p className="edit-button" onClick={handleAddBook}>
          Add
        </p>
      </div>
    </div>
  );
};

export default TrendingBookCard;