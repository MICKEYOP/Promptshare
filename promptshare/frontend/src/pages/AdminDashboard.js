import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:2000/api/admin";

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${API}/stats`, { headers }),
          axios.get(`${API}/users`, { headers })
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const makeAdmin = async (id) => {
    if (!window.confirm("Promote this user to admin?")) return;

    try {
      await axios.put(`${API}/make-admin/${id}`, {}, { headers });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, role: "admin" } : u
        )
      );
    } catch {
      alert("Failed to promote user");
    }
  };

  const deleteUser = async (u) => {
    if (u._id === user.id) {
      return alert("You cannot delete yourself");
    }

    if (u.role === "admin") {
      return alert("You cannot delete another admin");
    }

    if (!window.confirm(`Delete user ${u.email}? This action is irreversible.`)) {
      return;
    }

    try {
      await axios.delete(`${API}/user/${u._id}`, { headers });
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch {
      alert("Failed to delete user");
    }
  };

  const exportAuditLogsCSV = async () => {
    try {
      const res = await axios.get(`${API}/audit-logs/export`, {
        headers,
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "audit_logs.csv";
      link.click();
    } catch {
      alert("Failed to export CSV");
    }
  };

  const exportAuditLogsExcel = async () => {
    try {
      const res = await axios.get(`${API}/audit-logs/export-excel`, {
        headers,
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "audit_logs.xlsx";
      link.click();
    } catch {
      alert("Failed to export Excel");
    }
  };

  if (loading)
    return <p className="p-8 text-white pt-28">Loading admin dashboard...</p>;

  if (error)
    return <p className="text-red-500 p-8 pt-28">{error}</p>;

  return (
    <>
      <div className="bg" />

      <div className="relative z-10 min-h-screen text-white pt-28">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* BADGE */}
          <div className="inline-block mb-4 px-4 py-1 text-xs tracking-widest font-semibold
                          border border-yellow-400/40 text-yellow-300 rounded-full
                          bg-yellow-400/10 backdrop-blur-md">
            👑 ADMIN CONTROL PANEL
          </div>

          <h1 className="text-4xl font-bold mb-4 max-w-3xl">
            Manage users and monitor platform activity.
          </h1>

          <p className="text-gray-400 mb-12 max-w-2xl">
            Promote users, remove accounts, and export system audit logs.
          </p>

          {/* STATS */}
          {stats && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Stat label="Total Users" value={stats.totalUsers} />
              <Stat label="Admins" value={stats.totalAdmins} color="text-yellow-400" />
              <Stat label="Total Prompts" value={stats.totalPrompts} color="text-green-400" />
            </div>
          )}

          {/* EXPORT BUTTONS */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={exportAuditLogsCSV}
              className="px-6 py-2 rounded-full font-semibold
                         bg-gradient-to-r from-green-500 to-green-600
                         text-white
                         shadow-lg shadow-green-500/30
                         hover:scale-105 hover:shadow-green-500/50
                         transition-all duration-200"
            >
              Export CSV
            </button>

            <button
              onClick={exportAuditLogsExcel}
              className="px-6 py-2 rounded-full font-semibold
                         bg-gradient-to-r from-indigo-500 to-indigo-600
                         text-white
                         shadow-lg shadow-indigo-500/30
                         hover:scale-105 hover:shadow-indigo-500/50
                         transition-all duration-200"
            >
              Export Excel
            </button>
          </div>

          {/* USERS TABLE */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

            <table className="w-full text-left">
              <thead className="bg-white/10 text-gray-300">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-white/10">
                    <td className="p-4">{u.email}</td>

                    <td className="p-4">
                      {u.role === "admin"
                        ? <span className="text-yellow-400">👑 Admin</span>
                        : "User"}
                    </td>

                    <td className="p-4 flex gap-3">
                      {u.role !== "admin" && u._id !== user.id && (
                        <>
                          <button
                            onClick={() => makeAdmin(u._id)}
                            className="px-4 py-1.5 rounded-full text-sm font-semibold
                                       bg-gradient-to-r from-blue-500 to-blue-600
                                       text-white
                                       shadow-lg shadow-blue-500/30
                                       hover:scale-105 hover:shadow-blue-500/50
                                       transition-all duration-200"
                          >
                            Make Admin
                          </button>

                          <button
                            onClick={() => deleteUser(u)}
                            className="px-4 py-1.5 rounded-full text-sm font-semibold
                                       bg-gradient-to-r from-red-500 to-red-600
                                       text-white
                                       shadow-lg shadow-red-500/30
                                       hover:scale-105 hover:shadow-red-500/50
                                       transition-all duration-200"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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

const Stat = ({ label, value, color = "" }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);