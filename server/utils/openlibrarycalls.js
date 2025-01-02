const axios = require("axios");

async function fetchBookFromOpenLibrary(query) {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1&fields=title,author_name,first_publish_year,isbn`;
    const response = await axios.get(url);
    if (response.data.docs.length === 0) {
      throw new Error("Book not found in OpenLibrary");
    }

    const book = response.data.docs[0];
    return {
      title: book.title,
      author: book.author_name?.[0] || "Unknown Author",
      year: book.first_publish_year || null,
      isbn: book.isbn?.[0] || null
    };
  } catch (error) {
    console.error("Error fetching book from OpenLibrary:", error);
    throw new Error("Unable to fetch book from OpenLibrary");
  }
}

module.exports = { fetchBookFromOpenLibrary };
