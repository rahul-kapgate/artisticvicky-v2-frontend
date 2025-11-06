import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1b3d] via-[#152a52] to-[#1a237e] text-gray-100 px-6 text-center"
    >
      {/* 404 Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 shadow-lg mb-8"
      >
        <span className="text-4xl font-bold text-white">404</span>
      </motion.div>

      <h1 className="text-3xl font-bold text-cyan-300 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-300 max-w-md mb-8">
        Oops! The page you're looking for doesn’t exist or may have been moved.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 px-6 py-3 rounded-xl shadow-lg"
      >
        <Home className="w-5 h-5" /> Go Back Home
      </Button>
    </motion.div>
  );
}
