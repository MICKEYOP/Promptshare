import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPromptById, updatePrompt } from "../services/promptService";
import { AuthContext } from "../context/AuthContext";

export default function EditPrompt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const data = await getPromptById(id);
        setTitle(data.title);
        setPromptText(data.promptText);
        setDescription(data.description || "");
        setTags(data.tags?.join(", ") || "");
      } catch {
        setError("Failed to load prompt");
      }
    };
    fetchPrompt();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updatePrompt(
        id,
        {
          title,
          promptText,
          description,
          tags: tags.split(",").map((t) => t.trim())
        },
        token
      );
      navigate(`/prompt/${id}`);
    } catch {
      setError("Not authorized to update this prompt");
    }
  };

  return (
    <>
      {/* 🌊 BACKGROUND */}
      <div className="bg" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Edit Prompt</h2>

          {error && (
            <p className="text-red-400 mb-4">{error}</p>
          )}

          <input
            className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/20 backdrop-blur focus:outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={6}
            className="w-full mb-3 px-3 py-3 rounded bg-white/5 border border-white/20 backdrop-blur focus:outline-none"
            placeholder="Prompt text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />

          <input
            className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/20 backdrop-blur focus:outline-none"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full mb-6 px-3 py-2 rounded bg-white/5 border border-white/20 backdrop-blur focus:outline-none"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-blue-600/80 hover:bg-blue-700/90 rounded"
          >
            Update Prompt
          </button>
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
          animation: moveBg 40s linear infinite;
        }

        @keyframes moveBg {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        .bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          opacity: 0.07;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
