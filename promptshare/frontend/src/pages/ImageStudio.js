import { useState } from "react";
import { generateImage } from "../services/promptService";

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ NEW STATES
  const [tone, setTone] = useState("professional");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = await generateImage(prompt);

      if (data.data && data.data.length > 0) {
        setImage(data.data[0].image.source.url);
      } else {
        setError("No results found");
      }
    } catch {
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  // ✅ AI ENHANCE FUNCTION
  const handleEnhance = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    try {
      setLoadingAI(true);

      // 👉 Replace this with your backend API if needed
      // Example: const res = await enhancePrompt(prompt, tone);

      // TEMP LOGIC (you can replace later)
      const enhanced = `${prompt}, ${tone} style, highly detailed, cinematic lighting`;

      setPrompt(enhanced);
    } catch {
      alert("Enhancement failed");
    } finally {
      setLoadingAI(false);
    }
  };

  // DOWNLOAD
  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = "generated-image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch {
      alert("Download failed. Image source may block direct download.");
    }
  };

  const handleClear = () => {
    setImage(null);
  };

  return (
    <>
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="inline-block mb-4 px-4 py-1 text-xs tracking-widest font-semibold 
                          border border-blue-400/40 text-blue-300 rounded-full 
                          bg-blue-400/10 backdrop-blur-md">
            IMAGE STUDIO
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Generate polished AI visuals in seconds.
          </h2>

          <p className="text-gray-400 mb-10 max-w-xl">
            Keep the focus on prompt crafting and reviewing results — everything else stays out of the way.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT PANEL */}
            <form
              onSubmit={handleGenerate}
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-6"
            >
              <label className="block text-sm mb-2 text-gray-300">
                Describe your scene
              </label>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Cinematic cyberpunk city, neon lights, rainy night..."
                className="w-full h-32 rounded bg-transparent border border-white/30 p-3 focus:outline-none focus:border-blue-400 resize-none"
              />

              {/* ✅ AI CONTROLS (ADDED HERE) */}
              <div className="flex gap-3 mt-4">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="px-3 py-2 rounded bg-black border border-white/20 text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="concise">Concise</option>
                  <option value="marketing">Marketing</option>
                </select>

                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={loadingAI}
                  className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/90 rounded-lg"
                >
                  {loadingAI ? "Enhancing..." : "✨ Enhance"}
                </button>
              </div>

              {/* GENERATE BUTTON */}
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-blue-600/80 hover:bg-blue-500 rounded font-semibold transition"
              >
                {loading ? "Generating..." : "Generate Image"}
              </button>

              {error && (
                <p className="text-red-400 mt-3 text-sm">{error}</p>
              )}
            </form>

            {/* RIGHT PANEL */}
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-6 flex items-center justify-center">

              {image ? (
                <div className="flex flex-col items-center gap-4 w-full">

                  <img
                    src={image}
                    alt="Generated"
                    className="rounded-lg max-h-[500px] object-cover w-full"
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={handleDownload}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 
                                 hover:opacity-90 rounded-lg font-semibold shadow-lg transition"
                    >
                      Download
                    </button>

                    <button
                      onClick={handleClear}
                      className="px-6 py-2 bg-red-500/80 hover:bg-red-500 
                                 rounded-lg font-semibold transition"
                    >
                      Clear
                    </button>
                  </div>

                </div>
              ) : (
                <p className="text-gray-400 text-center">
                  Your generated image will appear here
                </p>
              )}

            </div>

          </div>
        </div>
      </div>

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