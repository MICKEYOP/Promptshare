import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TopContributors() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:2000/api/prompts/top-contributors")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* MATCHING BACKGROUND */}
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* BADGE */}
          <div
            className="inline-block mb-4 px-4 py-1 text-xs tracking-widest font-semibold
                       border border-yellow-400/40 text-yellow-300 rounded-full
                       bg-yellow-400/10 backdrop-blur-md"
          >
            🏆 COMMUNITY LEADERBOARD
          </div>

          {/* HEADING */}
          <h1 className="text-4xl font-bold mb-4 max-w-3xl">
            Meet the top creators shaping PromptShare.
          </h1>

          <p className="text-gray-400 mb-12 max-w-2xl">
            Ranked by total engagement across all prompts.
          </p>

          {/* LIST */}
          <div className="space-y-6">
            {users.length === 0 && (
              <p className="text-gray-400">No contributors yet.</p>
            )}

            {users.map((item, index) => (
              <div
                key={item._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10
                           rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-center">

                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4">

                    {/* Rank */}
                    <div className="text-lg font-bold text-yellow-400">
                      {index === 0 ? "👑" : `#${index + 1}`}
                    </div>

                    <div>
                      {/* CLICKABLE USERNAME */}
                      {item.user?._id && (
                        <Link
                          to={`/user/${item.user._id}`}
                          className="text-xl font-semibold hover:text-blue-400 transition"
                        >
                          {item.user?.username}
                        </Link>
                      )}

                      <p className="text-sm text-gray-400 mt-1">
                        Prompts: {item.totalPrompts} •
                        Likes: {item.totalLikes} •
                        Views: {item.totalViews}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-400">
                      ⭐ {item.score}
                    </div>

                    {/* VIEW PROFILE BUTTON */}
                    {item.user?._id && (
                      <Link
                        to={`/user/${item.user._id}`}
                        className="inline-block mt-3 px-4 py-1 text-xs
                                   border border-blue-400/40 text-blue-300
                                   rounded-full bg-blue-400/10
                                   hover:bg-blue-400/20 transition"
                      >
                        View Profile
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* SAME BACKGROUND STYLE AS CREATE PAGE */}
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
          animation: moveBg 40s linear infinite;
        }

        @keyframes moveBg {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </>
  );
}