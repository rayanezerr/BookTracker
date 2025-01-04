import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Books from "./components/books";
import AddBook from "./components/addbooks";
import Home from "./pages/home";

const App = () => {

  return (
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  );
};

export default App;
