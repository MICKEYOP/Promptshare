import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getSavedPrompts } from "../services/userService";
import { AuthContext } from "../context/AuthContext";

export default function SavedPrompts() {
  const { token } = useContext(AuthContext);
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await getSavedPrompts(token);
        setPrompts(data);
      } catch {
        setError("Failed to load saved prompts");
      }
    };

    if (token) fetchSaved();
  }, [token]);

  const previewText = (text, limit = 120) =>
    text?.length > limit ? text.slice(0, limit) + "…" : text;

  return (
    <>
      {/* 🌌 BACKGROUND */}
      <div className="bg" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* 🔷 BADGE */}
          <div className="mb-8">
            <div className="inline-block border border-blue-400/40 rounded-full px-6 py-2 backdrop-blur-md bg-blue-500/10">
              <p className="text-xs tracking-widest text-blue-300 font-semibold">
                SAVED PROMPT COLLECTION
              </p>
            </div>
          </div>

          {/* 🔥 HEADING */}
          <h2 className="text-5xl font-bold mb-8 text-left leading-tight">
            Revisit your saved{" "}
            <span className="bg-blue-400 text-black px-2 py-1">
              prompts
            </span>{" "}
            anytime.
            <br />
            Build inspiration from your personal AI gallery.
          </h2>

          {error && <p className="text-red-400 mb-6">{error}</p>}

          {prompts.length === 0 ? (
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-10 text-center">
              <p className="text-gray-400 text-lg">
                You haven’t saved any prompts yet.
              </p>
            </div>
          ) : (
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

                    {prompt.promptText && (
                      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        {previewText(prompt.promptText)}
                      </p>
                    )}

                    {/* TAGS + CREATOR ROW */}
                    <div className="flex justify-between items-start mt-4">
                      
                      {/* TAGS */}
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

                      {/* CREATOR */}
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        By{" "}
                        {prompt.createdBy?.username ??
                          prompt.createdBy?.email ??
                          "Unknown User"}
                      </span>
                    </div>

                  </div>
                </Link>
              ))}

            </div>
          )}
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
      `}</style>
    </>
  );
}