import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getPromptById,
  addComment,
  toggleLikePrompt
} from "../services/promptService";
import { toggleSavePrompt } from "../services/promptService";
import { toggleFollow } from "../services/userService";
import { AuthContext } from "../context/AuthContext";

export default function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [prompt, setPrompt] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  /* FETCH PROMPT */
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const data = await getPromptById(id);
        setPrompt(data);
        setComments(data.comments || []);

        if (user) {
          setLiked(data.likes?.some(uid => uid.toString() === user.id));

           // 🔥 Check if saved
            setSaved(
           data.savedBy?.some(uid => uid.toString() === user.id)
        );
        }
      } catch {
        setError("Failed to load prompt");
      }
    };

    fetchPrompt();
  }, [id, user]);

  /* FOLLOW STATE */
  useEffect(() => {
    if (!prompt || !user) return;

    const isFollowing = prompt.createdBy?.followers?.some(
      fid => fid.toString() === user.id
    );

    setFollowing(isFollowing);
  }, [prompt, user]);

  /* ❤️ LIKE WITH OVERLAY */
  const handleLike = async () => {
    const res = await toggleLikePrompt(prompt._id, token);
    setLiked(res.liked);
    setPrompt(p => ({ ...p, likes: res.likes }));

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 700);
  };

  /* ⭐ SAVE */
 const handleSave = async () => {
  try {
    const res = await toggleSavePrompt(prompt._id, token);
    setSaved(res.saved);
  } catch (err) {
    alert("Login required to save");
  }
};

  /* 👤 FOLLOW */
  const handleFollow = async () => {
    const res = await toggleFollow(prompt.createdBy._id, token);
    setFollowing(res.following);
  };

  /* COPY */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* COMMENT */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const updated = await addComment(prompt._id, commentText, token);
    setComments(updated);
    setCommentText("");
  };

  if (error) return <p className="text-red-400 p-8">{error}</p>;
  if (!prompt) return <p className="p-8 text-white">Loading...</p>;

  return (
    <>
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/explore")}
            className="text-gray-400 mb-6 hover:text-white"
          >
            ← Back to gallery
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* LEFT SIDE */}
            <div className="relative">

              {/* IMAGE */}
              {prompt.image && (
                <div className="relative">
                  <img
                    src={`http://localhost:2000${prompt.image}`}
                    alt=""
                    className="w-full rounded-2xl object-cover border border-white/20 mb-6"
                  />

                  {/* HEART OVERLAY */}
                  {showHeart && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-pink-500 text-6xl animate-heart">
                        ❤️
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DESCRIPTION */}
              {prompt.description && (
                <div className="bg-white/5 border border-white/20 p-6 rounded-2xl mb-6">
                  <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-widest">
                    Description
                  </h4>
                  <p className="text-gray-200">
                    {prompt.description}
                  </p>
                </div>
              )}

              {/* COMMENTS */}
              <div className="bg-white/5 border border-white/20 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4">
                  Comments ({comments.length})
                </h4>

                {comments.map((c, i) => (
                  <div key={i} className="border-b border-white/10 pb-3 mb-3">
                    <p className="text-sm text-gray-400">
                      @{c.user?.username || "user"}
                    </p>
                    <p>{c.text}</p>
                  </div>
                ))}

                {user && (
                  <div className="mt-4">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-white/10 p-3 rounded-lg border border-white/20"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={handleAddComment}
                      className="mt-3 btn"
                    >
                      Add Comment
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div>

              {/* BADGE */}
              <div className="inline-block mb-4 px-4 py-1 text-xs tracking-widest font-semibold 
                              border border-blue-400/40 text-blue-300 rounded-full 
                              bg-blue-400/10">
                PROMPT DETAIL
              </div>

              {/* TITLE */}
              <h2 className="text-4xl font-bold mb-4">
                {prompt.title}
              </h2>

              {/* USER + FOLLOW */}
              <div className="flex items-center gap-4 mb-8">
                <Link
                  to={`/user/${prompt.createdBy._id}`}
                  className="text-blue-400 font-medium hover:underline"
                >
                  @{prompt.createdBy.username}
                </Link>

                {user && user.id !== prompt.createdBy._id && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                      following
                        ? "bg-green-600 text-white"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* PROMPT CARD */}
              <div className="bg-white/5 border border-white/20 p-6 rounded-2xl">

                <h4 className="text-xs tracking-widest text-gray-400 mb-4">
                  PROMPT
                </h4>

                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {prompt.promptText}
                </p>

                {/* ACTION ROW */}
                <div className="flex gap-4 mt-6 flex-wrap">

                  {user && user.id !== prompt.createdBy._id && (
                    <button
                      onClick={handleLike}
                      className={`px-4 py-2 rounded-full transition ${
                        liked
                          ? "bg-pink-500/20 text-pink-400"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      ❤️ {prompt.likes?.length || 0}
                    </button>
                  )}

                  <button
  onClick={handleSave}
  className={`px-4 py-2 rounded-full transition ${
    saved
      ? "bg-yellow-800 bgoptext-black"
      : "bg-white/10 hover:bg-white/20"
  }`}
>
  {saved ? "⭐ Saved" : "⭐ Save"}
</button>

                  <button onClick={handleCopy} className="btn">
                    {copied ? "Copied" : "Copy"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        .btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.12);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .animate-heart {
          animation: pop 0.6s ease forwards;
        }

        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }

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