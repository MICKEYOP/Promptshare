import { useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const blocks = useMemo(() => Array.from({ length: 180 }), []);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      {/* ===== BACKGROUND GRID ===== */}
      <section className="matrix-bg">
        {blocks.map((_, i) => (
          <span key={i} />
        ))}
      </section>

      {/* ===== LOGIN CARD ===== */}
      <div className="signin">
        <div className="content">
          <h2>Login</h2>

          {error && <p className="error">{error}</p>}

          <div className="form">
            <div className="inputBox">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i>Email</i>
            </div>

            <div className="inputBox">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i>Password</i>
            </div>

            <div className="inputBox">
              <input
                type="submit"
                value="Login"
                onClick={handleLogin}
              />
            </div>

            {/* TEXT LINK FOOTER */}
            <div className="auth-footer">
              <span>Don&apos;t have an account?</span>
              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Inter, system-ui, sans-serif;
        }

        body {
          background: #020617;
          overflow: hidden;
        }

        /* ===== GRID BACKGROUND ===== */
        .matrix-bg {
          position: fixed;
          inset: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          z-index: 0;
        }

        .matrix-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(34,197,94,0.85) 40%,
            rgba(56,189,248,0.9) 55%,
            rgba(16,185,129,0.9) 65%,
            transparent 100%
          );
          animation: scan 5s linear infinite;
          z-index: 1;
        }

        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .matrix-bg span {
          width: calc(6.25vw - 2px);
          height: calc(6.25vw - 2px);
          background: #0b0f14;
          z-index: 2;
        }

        .matrix-bg span:hover {
          background: linear-gradient(135deg, #22c55e, #38bdf8);
        }

        /* ===== CARD ===== */
        .signin {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          background: rgba(5, 10, 15, 0.88);
          backdrop-filter: blur(14px);
          border-radius: 14px;
          padding: 40px;
          z-index: 10;
          border: 1px solid rgba(34,197,94,0.35);
          box-shadow: 0 30px 80px rgba(0,0,0,0.9);
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        h2 {
          color: #ecfdf5;
          font-weight: 600;
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .inputBox {
          position: relative;
        }

        .inputBox input:not([type="submit"]) {
          width: 100%;
          padding: 25px 10px 7.5px;
          background: rgba(2,6,23,0.8);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .inputBox i {
          position: absolute;
          left: 0;
          padding: 15px 10px;
          color: #9ca3af;
          transition: 0.4s;
          pointer-events: none;
        }

        .inputBox input:focus ~ i,
        .inputBox input:valid ~ i {
          transform: translateY(-7.5px);
          font-size: 0.8em;
          color: #86efac;
        }

        input[type="submit"] {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #22c55e, #38bdf8);
          color: #020617;
          font-weight: 700;
          border: none;
          cursor: pointer;
          letter-spacing: 0.05em;
        }

        /* ===== AUTH FOOTER ===== */
        .auth-footer {
          display: flex;
          justify-content: center;
          gap: 6px;
          font-size: 14px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .auth-footer button {
          background: none;
          border: none;
          padding: 0;
          color: #86efac;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .auth-footer button:hover {
          text-decoration: underline;
        }

        .error {
          color: #f87171;
          font-size: 14px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .signin {
            width: 90%;
          }
        }
      `}</style>
    </>
  );
}
