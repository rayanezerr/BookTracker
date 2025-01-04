import Sidebar from "../components/sidebar";
import TrendingBooks from "../components/trending";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <h1>Trending Books</h1>
        <TrendingBooks />
      </div>
    </div>
  );
};

export default Home;
