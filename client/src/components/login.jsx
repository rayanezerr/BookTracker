import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import "./login.css";
import Sidebar from "./sidebar";
import { AuthContext } from "../hooks/authContext";

const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const {handleLogin} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? `${url}/auth/create` : `${url}/auth/login`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const token = response.headers.get("Authorization").split(" ")[1];
        handleLogin(token, username);
        console.log(token);
        setRedirect(true);
      }
      else alert(data.message);
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  if (redirect) return <Navigate to="/books" />;

  return (
    <div className="login-page">
      <Sidebar />
      <div className="login-container">
        <h1>{isRegistering ? "Register" : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </form>
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;
