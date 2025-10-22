import { useState } from "react";
import { registerCompany } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building, Globe, User, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { RegisterCompanyRequestDto } from "../@api/models";
import registerImage from "../assets/registration-image.png";

export default function RegisterCompany() {
  const [formData, setFormData] = useState<RegisterCompanyRequestDto>({
    companyName: "",
    domain: "",
    admin: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  // Sample domain options (you can adjust these as needed)
  const domainOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isAdminField: boolean = false
  ) => {
    const { name, value } = e.target;
    if (isAdminField) {
      setFormData((prev) => ({
        ...prev,
        admin: { ...prev.admin, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await registerCompany(formData);
      setToken(data.token ?? null);
      setUser(data.user ?? null);
      navigate("/dashboard");
    } catch (err) {
      setError("Company registration failed. Try another email or company name.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-background-dark via-background-light to-background-dark relative overflow-y-auto">
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
          className="absolute -top-1/2 -left-1\D2 w-full h-full bg-accent-green/5 rounded-full blur-3xl"
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

      {/* Scrollable Centered Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-start justify-center w-full p-6 min-h-screen"
      >
        <div className="w-full max-w-md my-6">
          {/* Logo/Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue mb-4 shadow-lg shadow-accent-green/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-text-base mb-2 font-['Poppins']">
              Register Company with ProjectFlow
            </h1>
            <p className="text-text-muted text-sm lg:text-base font-['Inter']">
              Set up your company and admin account
            </p>
          </motion.div>

          {/* Register Company Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-error-red/10 border border-error-red/20 text-error-red px-4 py-2.5 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Company Name Input */}
            <div>
              <label className="block text-text-muted text-sm mb-1.5 font-['Inter']">
                Company Name
              </label>
              <div className="relative group">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-green transition-colors" />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-2.5 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all placeholder:text-text-muted/50"
                  required
                />
              </div>
            </div>

            {/* Domain Dropdown */}
            <div>
              <label className="block text-text-muted text-sm mb-1.5 font-['Inter']">
                Domain
              </label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-green transition-colors" />
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-2.5 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all placeholder:text-text-muted/50"
                  required
                >
                  <option value="" disabled>
                    Select a domain
                  </option>
                  {domainOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Admin Name Input */}
            <div>
              <label className="block text-text-muted text-sm mb-1.5 font-['Inter']">
                Admin Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-green transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter admin name"
                  value={formData.admin?.name}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full pl-12 pr-4 py-2.5 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all placeholder:text-text-muted/50"
                  required
                />
              </div>
            </div>

            {/* Admin Email Input */}
            <div>
              <label className="block text-text-muted text-sm mb-1.5 font-['Inter']">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-green transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.admin?.email}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full pl-12 pr-4 py-2.5 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all placeholder:text-text-muted/50"
                  required
                />
              </div>
            </div>

            {/* Admin Password Input */}
            <div>
              <label className="block text-text-muted text-sm mb-1.5 font-['Inter']">
                Admin Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent-green transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.admin?.password}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full pl-12 pr-4 py-2.5 text-text-base bg-background-content/50 border border-background-light rounded-xl focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none transition-all placeholder:text-text-muted/50"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-accent-green to-accent-blue text-white py-3 rounded-xl font-semibold font-['Poppins'] shadow-lg shadow-accent-green/20 hover:shadow-accent-blue/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Company
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Links Section */}
            <div className="text-center pt-1.5 space-y-2">
              <p className="text-text-muted text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-accent-blue font-semibold hover:text-accent-purple transition-colors"
                >
                  Sign in here
                </Link>
              </p>
              <p className="text-text-muted text-sm">
                Want to join an existing company?{" "}
                <Link
                  to="/register"
                  className="text-accent-blue font-semibold hover:text-accent-purple transition-colors"
                >
                  Register as user here
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-center text-text-muted text-xs pt-2">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-accent-blue hover:underline">
                Terms & Privacy Policy
              </Link>
            </p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}