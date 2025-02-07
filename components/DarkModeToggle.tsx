import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/hooks/useTheme";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <FaSun size={24} className="text-yellow-500" />
      ) : (
        <FaMoon size={24} className="text-gray-800" />
      )}
    </button>
  );
}
