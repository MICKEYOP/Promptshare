import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [promptMenu, setPromptMenu] = useState(false);

  const dropdownRef = useRef(null);
  const promptRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        promptRef.current &&
        !promptRef.current.contains(e.target)
      ) {
        setOpen(false);
        setPromptMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (location.pathname === "/") return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="relative w-[96vw] max-w-7xl h-[72px] px-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white flex items-center">

        {/* LEFT - LOGO */}
        <div className="absolute left-10">
          <Link to="/" className="text-xl font-semibold hover:text-white transition">
            PromptShare
          </Link>
        </div>

        {/* CENTER LINKS */}
        <div className="flex justify-center items-center gap-12 w-full font-medium text-gray-200">
          <Link to="/explore" className="hover:text-white transition">
            Explore
          </Link>

          <Link to="/trending" className="hover:text-white transition">
            Trending
          </Link>

          <Link to="/top-contributors" className="hover:text-white transition">
            Top Creator 
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
            >
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="absolute right-10 flex items-center gap-6">

          {user ? (
            <>
              {/* PROMPTS DROPDOWN */}
              <div className="relative" ref={promptRef}>
                <button
                  onClick={() => setPromptMenu(!promptMenu)}
                  className="px-6 py-2.5 rounded-full border border-blue-400/50 hover:scale-105 transition-all duration-200 text-white font-medium"
                >
                  Prompts 
                </button>

                {promptMenu && (
                  <div className="absolute right-0 mt-3 w-52 rounded-xl backdrop-blur-xl bg-[#0f172a]/95 border border-white/10 shadow-xl py-2">
                    
                    <Link
                      to="/image-studio"
                      onClick={() => setPromptMenu(false)}
                      className="block px-5 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      Generate Image
                    </Link>

                    <Link
                      to="/create"
                      onClick={() => setPromptMenu(false)}
                      className="block px-5 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      Upload Prompt
                    </Link>

                    <Link
                      to="/saved"
                      onClick={() => setPromptMenu(false)}
                      className="block px-5 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      Saved Prompts
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link
                to={`/profile`}
                className="text-gray-200 hover:text-white transition"
              >
                {user.username}
                {user.role === "admin" && (
                  <span className="ml-1 text-yellow-400">🛠️</span>
                )}
              </Link>

              {/* 3 DOT MENU */}
              <div ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  ⋮
                </button>

                {open && (
                  <div className="absolute right-0 top-16 w-56 rounded-2xl backdrop-blur-xl bg-[#0f172a]/95 border border-white/10 shadow-2xl py-2">

                    <a
                      href="https://discord.gg/uwVcrA58"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      Community
                    </a>

                    <div className="my-2 border-t border-white/10"></div>

                    <button
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-5 py-3 text-red-400 hover:bg-white/5 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-white transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}