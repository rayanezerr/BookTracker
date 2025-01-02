import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Books from "./components/books";
import AddBook from "./components/addbooks";

const App = () => {
  const [token, setToken] = useState(null);
  

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
      <Routes>
        <Route path="/books" element={<Books token={token} />} />
        <Route path="/add-book" element={<AddBook token={token} />} />
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      </Routes>
  );
};

export default App;
