import { useState } from "react";
import { login } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ username, password });
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen cyber-background font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-background-light p-8 rounded-xl shadow-lg w-full max-w-sm relative z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-text-base text-center">
          Sign In
        </h2>
        {error && (
          <p className="text-error-red text-center mb-4 text-sm">
            {error}
          </p>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 text-text-base bg-background-dark border border-background-light rounded-md focus:border-accent-blue outline-none transition-colors"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 text-text-base bg-background-dark border border-background-light rounded-md focus:border-accent-blue outline-none transition-colors"
          required
        />
        <button
          type="submit"
          className="w-full bg-accent-blue text-text-base p-3 rounded-md hover:bg-opacity-80 transition-colors font-semibold"
        >
          Login
        </button>
        <p className="mt-4 text-center text-text-muted text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-blue font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}