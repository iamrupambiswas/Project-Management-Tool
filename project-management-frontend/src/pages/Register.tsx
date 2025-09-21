import { useState } from "react";
import { register } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register({ username, email, password });
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Try another email.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen cyber-background font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-background-light p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-text-base text-center">
          Register
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          className="w-full bg-accent-green text-text-base p-3 rounded-md hover:bg-opacity-80 transition-colors font-semibold"
        >
          Register
        </button>
        <p className="mt-4 text-center text-text-muted text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-blue font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}