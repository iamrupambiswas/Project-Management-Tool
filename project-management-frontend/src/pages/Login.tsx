import { useState } from "react";
import { login } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import loginImage from "../assets/login-image.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login({ email: email, password });
      setToken(data.token ?? null);
      setUser(data.user ?? null);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-background-dark via-background-light to-background-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent-purple/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent-blue/5 rounded-full blur-3xl"
        />
      </div>

      <div className="flex flex-col lg:flex-row w-full h-full relative z-10">
        {/* Left Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
        >
          <div className="w-full max-w-md my-auto">
            {/* Logo/Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple mb-4 shadow-lg shadow-accent-blue/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-text-base mb-2 font-['Poppins']">
                Welcome back!
              </h1>
              <p className="text-text-muted text-sm lg:text-base font-['Inter']">
                Please login to your account
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-error-red/10 border border-error-red/20 text-error-red px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-text-muted text-sm mb-2 font-['Inter']">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-blue transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all placeholder:text-text-muted/50"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-text-muted text-sm mb-2 font-['Inter']">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-blue transition-colors" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all placeholder:text-text-muted/50"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-background-light bg-background-content/50 text-accent-blue focus:ring-2 focus:ring-accent-blue/20 cursor-pointer"
                  />
                  <span className="text-text-muted text-sm group-hover:text-text-base transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-accent-blue text-sm font-medium hover:text-accent-purple transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-accent-blue to-accent-purple text-white py-3 rounded-xl font-semibold font-['Poppins'] shadow-lg shadow-accent-blue/20 hover:shadow-accent-purple/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Login to ProjectFlow
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Links Section */}
              <div className="text-center pt-2 space-y-2">
                <p className="text-text-muted text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-accent-blue font-semibold hover:text-accent-purple transition-colors"
                  >
                    Create a ProjectFlow account
                  </Link>
                </p>
                <p className="text-text-muted text-sm">
                  Want to register a company?{" "}
                  <Link
                    to="/register-company"
                    className="text-accent-blue font-semibold hover:text-accent-purple transition-colors"
                  >
                    Register company here
                  </Link>
                </p>
              </div>
            </motion.form>
          </div>
        </motion.div>

        {/* Right Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-background-content/30 to-transparent"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative max-w-lg"
          >
            <img
              src={loginImage}
              alt="Login illustration"
              className="w-full drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/20 to-transparent blur-3xl -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}