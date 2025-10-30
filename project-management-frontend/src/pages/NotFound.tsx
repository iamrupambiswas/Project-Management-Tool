import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import notFoundImage from "../assets/404-image.png";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background-dark via-background-light to-background-dark relative overflow-hidden">
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

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center w-full px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center max-w-2xl text-center"
        >
          {/* 404 Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-12 w-full max-w-lg"
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
              className="relative"
            >
              <img
                src={notFoundImage}
                alt="404 illustration"
                className="w-full h-auto drop-shadow-2xl"
              />
              {/* Decorative glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/20 via-accent-purple/10 to-transparent blur-3xl -z-10" />
            </motion.div>

            {/* Floating decorative elements */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-8 -left-8 w-16 h-16 bg-accent-blue/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-accent-purple/10 rounded-full blur-xl"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-base font-['Poppins']">
              Page Not Found
            </h1>
            <p className="text-text-muted text-base sm:text-lg lg:text-xl font-['Inter'] max-w-xl mx-auto">
              Oops! The page you're looking for seems to have wandered off into
              the digital void.
            </p>
          </motion.div>

          {/* Footer Text with Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-text-muted text-sm sm:text-base font-['Inter'] font-medium"
            >
            Lost? Try checking the URL or{" "}
            <Link
                to="/"
                className="text-accent-blue hover:text-accent-purple transition-colors"
            >
            return to the homepage
            </Link>
        </motion.p>
        </motion.div>
      </div>
    </div>
  );
}