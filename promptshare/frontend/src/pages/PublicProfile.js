import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getPublicProfile, toggleFollow } from "../services/userService";

export default function PublicProfile() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPublicProfile(id);

        setProfile(data.user);
        setPrompts(data.prompts || []);

        if (user && data.user.followers) {
          setFollowing(
            data.user.followers.some(
              (fid) => fid.toString() === user.id
            )
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, [id, user]);

  const handleFollow = async () => {
    try {
      const res = await toggleFollow(profile._id, token);
      setFollowing(res.following);
    } catch {
      alert("Login required to follow");
    }
  };

  if (error) return <p className="text-red-400 p-8">{error}</p>;
  if (!profile) return <p className="p-8 text-white">Loading...</p>;

  const isOwnProfile = user?.id === profile._id;

  return (
    <>
      {/* Background */}
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* ================= HEADER ================= */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 mb-14 shadow-2xl">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

              {/* LEFT SIDE */}
              <div className="flex items-center gap-8">

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      profile.avatar
                        ? `http://localhost:2000${profile.avatar}`
                        : `https://ui-avatars.com/api/?name=${profile.username}`
                    }
                    className={`w-32 h-32 rounded-full object-cover ${
                      profile.isTopCreator
                        ? "border-4 border-yellow-400 shadow-xl shadow-yellow-500/30"
                        : "border-2 border-blue-500"
                    }`}
                    alt="avatar"
                  />

                  {profile.isTopCreator && (
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold shadow-md">
                      👑
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div>
                  <h2 className="text-4xl font-bold flex items-center gap-4">
                    @{profile.username}

                    {profile.isTopCreator && (
                      <span className="top-badge">
                        Top Creator
                      </span>
                    )}
                  </h2>

                  <div className="flex gap-8 text-sm text-gray-400 mt-3">
                    <span>👥 {profile.followers?.length || 0} followers</span>
                    <span>➡️ {profile.following?.length || 0} following</span>
                    <span>📅 Joined {new Date(profile.joinedAt).getFullYear()}</span>
                  </div>

                  {profile.discordId && (
                    <div className="text-sm text-indigo-400 mt-3">
                      💬 {profile.discordId}
                    </div>
                  )}
                </div>
              </div>

              {/* FOLLOW BUTTON */}
              {!isOwnProfile && user && (
                <button
                  onClick={handleFollow}
                  className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    following
                      ? "bg-green-600 hover:bg-green-700 shadow-lg"
                      : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* ================= ABOUT ================= */}
          {profile.about && (
            <div className="mb-14 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
                About
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.about}
              </p>
            </div>
          )}

          {/* ================= PROMPTS ================= */}
          <section>
            <h3 className="text-3xl font-semibold mb-8">
              Public Prompts
            </h3>

            {prompts.length === 0 ? (
              <p className="text-gray-400">
                No public prompts yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prompts.map((p) => (
                  <Link
                    key={p._id}
                    to={`/prompt/${p._id}`}
                    className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                  >
                    <h4 className="font-semibold mb-4 text-lg group-hover:text-indigo-300 transition">
                      {p.title}
                    </h4>

                    <div className="flex gap-8 text-sm text-gray-400">
                      <span className="group-hover:text-pink-400 transition">
                        ❤️ {p.likes?.length || 0}
                      </span>
                      <span className="group-hover:text-blue-400 transition">
                        👁 {p.views || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================= STYLES ================= */}
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

        .top-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: black;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 6px 18px rgba(255, 215, 0, 0.4);
        }
      `}</style>
    </>
  );
}