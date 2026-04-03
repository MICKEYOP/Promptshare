import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPrompts } from "../services/promptService";

export default function Explore() {
  const [prompts, setPrompts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  /* =====================
     📥 FETCH PROMPTS
  ===================== */
  const fetchPrompts = async (query = "", pageNum = 1, sortType = "newest") => {
    try {
      const data = await getAllPrompts(query, pageNum, 6, sortType);
      setPrompts(data.prompts);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load prompts");
    }
  };

  useEffect(() => {
    fetchPrompts(search, page, sort);
  }, [search, page, sort]);

  /* =====================
     🧭 NAVBAR HIDE ON SCROLL
  ===================== */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (!navbar) return;

      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPrompts(search, 1, sort);
  };

  const previewText = (text, limit = 150) =>
    text?.length > limit ? text.slice(0, limit) + "…" : text;

  return (
    <>
      {/* 🌌 BACKGROUND */}
      <div className="bg" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

        {/* 🔷 COMMUNITY BANNER (LEFT ALIGNED SHORT) */}
          <div className="mb-8">
            <div className="inline-block border border-blue-400/40 rounded-full px-6 py-2 backdrop-blur-md bg-blue-500/10">
              <p className="text-xs tracking-widest text-blue-300 font-semibold">
                COMMUNITY PROMPT STUDIO & GALLERY
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-bold mb-8 text-left leading-tight">Share the <span className="bg-blue-400 text-black px-2 py-1">prompts</span> behind the art. Discover trending <br/> AI images that inspire your next creation.</h2>

          {/* SEARCH + SORT */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts..."
                className="flex-1 rounded px-3 py-2 bg-transparent border border-white/30 backdrop-blur-sm"
              />
              <button className="px-4 py-2 bg-blue-600/80 rounded hover:bg-blue-600 transition">
                Search
              </button>
            </form>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded px-3 py-2 bg-transparent border border-white/30"
            >
              <option value="newest">Newest</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          {error && <p className="text-red-400 mb-6">{error}</p>}

          {/* PROMPTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Link
                key={prompt._id}
                to={`/prompt/${prompt._id}`}
                className="group backdrop-blur-md bg-white/5 border border-white/20 rounded-xl overflow-hidden hover:border-blue-400/40 transition"
              >
                {prompt.image && (
                  <img
                    src={`http://localhost:2000${prompt.image}`}
                    alt="Prompt preview"
                    className="w-full h-48 object-cover border-b border-white/10 group-hover:scale-[1.02] transition"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition">
                    {prompt.title}
                  </h3>

                  <div className="flex gap-4 text-xs text-gray-300 mb-3">
                    <span>❤️ {prompt.likes?.length || 0}</span>
                    <span>💬 {prompt.comments?.length || 0}</span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {previewText(prompt.promptText)}
                  </p>

                  {/* TAGS + CREATOR ROW */}
                  <div className="flex justify-between items-start mt-4">
                    
                    {/* TAGS LEFT */}
                    {prompt.tags?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* CREATOR RIGHT */}
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      By{" "}
                      {prompt.createdBy?.username ||
                        prompt.createdBy?.email ||
                        "Unknown"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-white/30 rounded disabled:opacity-40 hover:border-blue-400/50 transition"
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-white/30 rounded disabled:opacity-40 hover:border-blue-400/50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 🎨 BACKGROUND STYLES */}
      <style>{`
        .bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          background:
            radial-gradient(60% 80% at 20% 20%, #1f1f4a 0%, transparent 60%),
            radial-gradient(50% 70% at 80% 30%, #0a3a55 0%, transparent 60%),
            radial-gradient(70% 80% at 50% 80%, #2a0f2f 0%, transparent 60%),
            linear-gradient(120deg, #050507, #07070c, #050507);
          background-size: 200% 200%;
          animation: move 40s linear infinite;
        }

        @keyframes move {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        select option {
          background-color: #050507;
          color: white;
        }
      `}</style>
    </>
  );
}