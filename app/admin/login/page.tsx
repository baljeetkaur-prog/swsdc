"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./AdminLogin.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">
          Admin Login
        </h1>

        <p className="admin-login-subtitle">
          Sign in to access the administration panel
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >
          <div className="admin-login-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="admin-login-password-wrapper">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                required
              />

              <button
                type="button"
                className="admin-login-password-eye"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  /* Eye open */
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 12C2.5 12 6 5.5 12 5.5C18 5.5 21.5 12 21.5 12C21.5 12 18 18.5 12 18.5C6 18.5 2.5 12 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                ) : (
                  /* Eye closed */
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.6 5.7C11.05 5.57 11.52 5.5 12 5.5C18 5.5 21.5 12 21.5 12C21.5 12 20.2 14.4 17.9 16.3M6.1 7.4C3.8 9.3 2.5 12 2.5 12C2.5 12 6 18.5 12 18.5C13.3 18.5 14.5 18.2 15.5 17.7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9.9 9.9C9.35 10.45 9 11.2 9 12C9 13.66 10.34 15 12 15C12.8 15 13.55 14.65 14.1 14.1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {message && (
          <p className="admin-login-message">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}