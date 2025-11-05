import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 text-brand font-semibold text-xl">
          <BookOpen className="w-6 h-6" />
          <span>LibraryMS</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li className="hover:text-brand transition-colors cursor-pointer">
            Home
          </li>
          <li className="hover:text-brand transition-colors cursor-pointer">
            Books
          </li>
          <li className="hover:text-brand transition-colors cursor-pointer">
            Students
          </li>
          <li className="hover:text-brand transition-colors cursor-pointer">
            Dashboard
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-brand"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100">
          <ul className="flex flex-col space-y-2 py-4 px-6 text-gray-700 font-medium">
            <li className="hover:text-brand transition-colors cursor-pointer">
              Home
            </li>
            <li className="hover:text-brand transition-colors cursor-pointer">
              Books
            </li>
            <li className="hover:text-brand transition-colors cursor-pointer">
              Students
            </li>
            <li className="hover:text-brand transition-colors cursor-pointer">
              Dashboard
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
