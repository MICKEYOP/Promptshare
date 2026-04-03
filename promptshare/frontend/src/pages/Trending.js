import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Trending() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:2000/api/prompts/trending")
      .then((res) => setPrompts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* BADGE */}
          <div className="inline-block mb-4 px-4 py-1 text-xs tracking-widest font-semibold
                          border border-orange-400/40 text-orange-300 rounded-full
                          bg-orange-400/10 backdrop-blur-md">
            🔥 TRENDING NOW
          </div>

          <h1 className="text-4xl font-bold mb-4 max-w-3xl">
            Discover the most engaging prompts right now.
          </h1>

          <p className="text-gray-400 mb-12 max-w-2xl">
            Ranked based on community interaction.
          </p>

          <div className="space-y-6">
            {prompts.map((prompt, index) => (
              <Link
                key={prompt._id}
                to={`/prompt/${prompt._id}`}
                className="block bg-white/5 backdrop-blur-xl border border-white/10
                           rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-orange-400 font-bold">
                        #{index + 1}
                      </span>
                      <h2 className="text-xl font-semibold">
                        {prompt.title}
                      </h2>
                    </div>

                    <p className="text-sm text-gray-400">
                      By {prompt.createdBy?.username}
                    </p>

                    <div className="flex gap-4 mt-3 text-sm text-gray-300">
                      ❤️ {prompt.likes?.length || 0}
                      👁 {prompt.views || 0}
                      💬 {prompt.comments?.length || 0}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* SAME BACKGROUND STYLE */}
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