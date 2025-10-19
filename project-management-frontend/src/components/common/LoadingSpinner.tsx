import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string; // Optional message to display below the spinner
  size?: number;    // Optional size override for the loader icon
}

const LoadingSpinner = ({ message = "Loading...", size = 32 }: LoadingSpinnerProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-gray-500 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <Loader2 size={size} className="text-blue-500" />
      </motion.div>
      {message && <p className="mt-2">{message}</p>}
    </motion.div>
  );
};

export default LoadingSpinner;
