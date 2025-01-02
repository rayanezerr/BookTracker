import { useState, useRef, useEffect } from "react";
import "./addBooks.css"
import { debounce } from "lodash";
const url = "http://localhost:3000";

const AddBook = ({ token }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [status, setStatus] = useState("Plan to read");
  const [rating, setRating] = useState("");

  const abortControllerRef = useRef(null);

  const fetchSuggestions = debounce(async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=title,author_name,isbn`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      setSuggestions(data.docs || []);
      console.log(data.docs);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    }
  }, 500);

  const handleAddBook = async () => {
    try {
      const response = await fetch(`${url}/books/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: selectedBook.title,
          status,
          rating: rating ? parseInt(rating) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to add book");
      alert("Book added successfully!");
    } catch (error) {
      console.error(error);
      alert("Book already added");
    }
  };

  useEffect(() => {
    if (query === "") {
      setSelectedBook(null);
      setSuggestions([]);
    }
  }, [query]);


  return (
    <div className="add-book-container">
      <div className="add-book-form">
        <h2>Add Book</h2>
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />
        <ul className={`suggestions-list ${suggestions.length === 0 ? 'empty' : ''}`}>
          {suggestions.map((book) => (
            <li key={book.key} onClick={() => setSelectedBook(book)}>
              {book.title} by {book.author_name?.[0] || "Unknown"}
            </li>
          ))}
        </ul>
        {selectedBook && (
          <div>
            <h3>Selected Book</h3>
            <img className="add-book-image"
              src={`https://covers.openlibrary.org/b/isbn/${selectedBook.isbn?.[0]}-L.jpg`}
              alt={selectedBook.title} />
            <p className="add-book-details">
              <strong>{selectedBook.title}</strong>, by{" "}
              {selectedBook.author_name?.[0] || "Unknown"}
            </p>
            <label>
              Status:
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Plan to read</option>
                <option>Reading</option>
                <option>Completed</option>
              </select>
            </label>
            <label>
              Rating (1-10):
              <input
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
            <button onClick={handleAddBook}>Add Book</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBook;