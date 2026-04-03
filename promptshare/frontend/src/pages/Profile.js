import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getSavedPrompts,
  getMyPrompts,
  updateProfile,
  updateAvatar
} from "../services/userService";

export default function Profile() {

  const { user, token, setUser } = useContext(AuthContext);

  const [saved, setSaved] = useState([]);
  const [created, setCreated] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState(user?.username || "");
  const [discordId, setDiscordId] = useState(user?.discordId || "");
  const [about, setAbout] = useState(user?.about || "");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {

      try {

        const savedPrompts = await getSavedPrompts(token);
        const myPrompts = await getMyPrompts(token);

        setSaved(savedPrompts || []);
        setCreated(myPrompts || []);

      } catch (err) {

        console.error(err);
        setError("Failed to load profile data");

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, [token]);

  /* ================= STATS ================= */

  const totalLikes = created.reduce(
    (sum, p) => sum + (p.likes?.length || 0),
    0
  );

  const totalViews = created.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  /* ================= SAVE PROFILE ================= */

  const handleSaveProfile = async () => {

    if (!username.trim()) return alert("Username required");

    try {

      setSaving(true);

      const res = await updateProfile(
        { username, discordId, about },
        token
      );

      setUser(res.user);

      setEditing(false);

    } catch (err) {

      alert(err.response?.data?.message || "Profile update failed");

    } finally {

      setSaving(false);

    }
  };

  /* ================= AVATAR ================= */

  const handleAvatarChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      setUploading(true);

      const res = await updateAvatar(file, token);

      setUser(res.user);

    } catch {

      alert("Avatar upload failed");

    } finally {

      setUploading(false);

    }
  };

  /* ================= LOADING / ERROR ================= */

  if (loading)
    return <p className="text-white p-10">Loading profile...</p>;

  if (error)
    return <p className="text-red-400 p-10">{error}</p>;

  return (
    <>
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* ================= HEADER ================= */}

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 mb-14 shadow-2xl">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

              {/* LEFT */}

              <div className="flex items-center gap-8">

                {/* Avatar */}

                <div className="relative group">

                  <img
                    src={
                      user?.avatar
                        ? `http://localhost:2000${user.avatar}`
                        : `https://ui-avatars.com/api/?name=${user?.username}`
                    }
                    className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
                    alt="Avatar"
                  />

                  <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-sm">

                    {uploading ? "Uploading..." : "Change"}

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />

                  </label>

                </div>

                {/* USER INFO */}

                <div className="max-w-xl">

                  {!editing ? (
                    <>

                      <h2 className="text-3xl font-bold">
                        {user?.username}
                      </h2>

                      <div className="flex gap-6 text-sm text-gray-400 mt-2">

                        <span>
                          👥 {user?.followers?.length || 0} followers
                        </span>

                        <span>
                          ➡️ {user?.following?.length || 0} following
                        </span>

                        <span>
                          📅 Joined{" "}
                          {user?.joinedAt
                            ? new Date(user.joinedAt).getFullYear()
                            : ""}
                        </span>

                      </div>

                      {user?.discordId && (
                        <div className="text-indigo-400 mt-2 text-sm">
                          💬 {user.discordId}
                        </div>
                      )}

                      <p className="text-gray-400 mt-2">
                        {user?.email}
                      </p>

                      {user?.about && (
                        <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
                          <h4 className="text-indigo-300 mb-2 text-sm font-semibold">
                            About
                          </h4>
                          <p className="text-gray-300 text-sm whitespace-pre-line">
                            {user.about}
                          </p>
                        </div>
                      )}

                    </>
                  ) : (

                    <div className="space-y-4">

                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full px-4 py-2 rounded bg-white text-black"
                      />

                      <input
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        placeholder="Discord ID"
                        className="w-full px-4 py-2 rounded bg-white text-black"
                      />

                      <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="About you..."
                        rows="4"
                        className="w-full px-4 py-2 rounded bg-white text-black"
                      />

                      <div className="flex gap-3">

                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="px-5 py-2 bg-green-600 rounded-xl"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>

                        <button
                          onClick={() => setEditing(false)}
                          className="px-5 py-2 bg-gray-400 text-black rounded-xl"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-blue-600 rounded-xl"
                >
                  Edit Profile
                </button>
              )}

            </div>

          </div>

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">

            <Stat label="Prompts" value={created.length} />
            <Stat label="Likes" value={totalLikes} />
            <Stat label="Views" value={totalViews} />
            <Stat label="Saved" value={saved.length} />

          </div>

          {/* ================= ACTIVITY ================= */}

          <section>

            <h3 className="text-2xl font-semibold mb-6">
              Activity
            </h3>

            <ul className="space-y-3 text-gray-300">

              {created.slice(0, 5).map((p) => (
                <li key={p._id}>
                  ✍️ Created <strong>{p.title}</strong>
                </li>
              ))}

              {saved.slice(0, 5).map((p) => (
                <li key={p._id}>
                  ⭐ Saved <strong>{p.title}</strong>
                </li>
              ))}

            </ul>

          </section>

        </div>

      </div>
    </>
  );
}

/* ================= STAT CARD ================= */

const Stat = ({ label, value }) => (

  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg">

    <p className="text-gray-400 text-sm mb-2">{label}</p>

    <p className="text-3xl font-bold">{value}</p>

  </div>

);