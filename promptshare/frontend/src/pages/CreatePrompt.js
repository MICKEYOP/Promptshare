import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createPrompt } from "../services/promptService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePrompt() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [tone, setTone] = useState("professional");
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEnhance = async () => {
    if (!promptText.trim()) return alert("Write a prompt first");

    try {
      setLoadingAI(true);
      const res = await axios.post(
        "http://localhost:2000/api/ai/enhance",
        { text: promptText, tone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPromptText(res.data.enhancedPrompt);
    } catch {
      alert("AI enhancement failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !promptText) {
      setError("Title and prompt text are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("promptText", promptText);
      formData.append("description", description);
      formData.append(
        "tags",
        tags.split(",").map((t) => t.trim())
      );
      if (image) formData.append("image", image);

      await createPrompt(formData, token);
      navigate("/explore");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create prompt");
    }
  };

  return (
    <>
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* BADGE */}
          <div className="inline-block mb-4 px-4 py-1 text-xs tracking-widest font-semibold
                          border border-blue-400/40 text-blue-300 rounded-full
                          bg-blue-400/10 backdrop-blur-md">
            SHARE YOUR PROMPT
          </div>

          {/* HEADING */}
          <h1 className="text-4xl font-bold mb-4 leading-tight max-w-3xl">
            Share your AI-generated images with the community.
          </h1>

          <p className="text-gray-400 mb-10 max-w-2xl">
            Upload your AI artwork, share the prompt that created it,
            and help others learn from your techniques.
          </p>

          {/* MAIN CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

            {/* TOP GRID */}
            <div className="grid md:grid-cols-2 gap-10">

              {/* LEFT - IMAGE */}
              <div>
                <p className="text-xs text-gray-400 mb-3 tracking-wider">
                  ARTWORK UPLOAD
                </p>

                <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl h-64 cursor-pointer hover:border-blue-400/40 transition">
                  <p className="text-gray-400 text-sm text-center px-4">
                    Drag an image here or click to upload your AI-generated artwork.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, WEBP — MAX 10MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>

              {/* RIGHT - PROMPT */}
              <div>
                <p className="text-xs text-gray-400 mb-2 tracking-wider">
                  PROMPT 
                </p>

                <textarea
                  rows={8}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Paste the exact prompt text you used..."
                  className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/20 focus:outline-none focus:border-blue-400/50"
                />

                {/* AI Controls */}
                <div className="flex gap-3 mt-4">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="px-3 py-2 rounded bg-white/5 border border-white/20 text-white"
                  >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="concise">Concise</option>
                    <option value="marketing">Marketing</option>
                  </select>

                  <button
                    onClick={handleEnhance}
                    disabled={loadingAI}
                    className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/90 rounded-lg"
                  >
                    {loadingAI ? "Enhancing..." : "✨ Enhance"}
                  </button>
                </div>
              </div>
            </div>

            {/* SECOND GRID - TITLE LEFT / DESCRIPTION RIGHT */}
            <div className="grid md:grid-cols-2 gap-10 mt-10">

              {/* LEFT - PROJECT TITLE */}
              <div>
                <p className="text-xs text-gray-400 mb-2 tracking-wider">
                  PROJECT TITLE 
                </p>

                <textarea
                  rows={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a short name for this prompt"
                  className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/20"
                />
              </div>

              {/* RIGHT - DESCRIPTION */}
              <div>
                <p className="text-xs text-gray-400 mb-2 tracking-wider">
                  DESCRIPTION (MODEL OR TOOL USED)
                </p>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention model, tool used, settings, inspiration or workflow..."
                  className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/20"
                />
              </div>
            </div>

            {/* TAGS */}
            <div className="mt-8">
              <input
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/20"
              />
            </div>

            {error && <p className="text-red-400 mt-4">{error}</p>}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              className="w-full mt-8 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
            >
              PUBLISH PROMPT
            </button>
          </div>
        </div>
      </div>

      {/* BACKGROUND */}
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

        select option {
          background-color: #050507;
          color: white;
        }
      `}</style>
    </>
  );
}