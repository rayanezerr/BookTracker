import { useEffect, useState } from "react";
import TrendingBookCard from "./trendingBookCard";

import "./trending.css";

const TrendingBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await fetch(
          "https://openlibrary.org/trending/today.json"
        );
        const data = await response.json();
        setBooks(data.works || []);
      } catch (error) {
        console.error("Error fetching trending books:", error);
      }
    };

    fetchTrendingBooks();
  }, []);

  return (
    <div className="trending-books">
      {books.length > 0 ? (
        books.map((book) => {
          const isbn = book.availability && book.availability.isbn ? book.availability.isbn : null;
          return (
            isbn &&
            <div key={book.key} className="book-card">
              <TrendingBookCard book={book} isbn={isbn} />
            </div>
        ) })
      ) : (
        <p>Loading trending books...</p>
      )}
    </div>
  );
};

export default TrendingBooks;
