import React from "react";
import { useLocation, Link } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Popular", path: "/popular" },
  { name: "Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
];

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-purple-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* App Name */}
        <div className="text-purple-400 font-extrabold text-xl tracking-wide">
          MusicConnectors
        </div>

        {/* Navigation */}
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-md font-semibold transition-all duration-200 pb-1 border-b-2 ${
                  isActive
                    ? "border-purple-500 text-white"
                    : "border-transparent text-purple-300 hover:border-purple-600 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
