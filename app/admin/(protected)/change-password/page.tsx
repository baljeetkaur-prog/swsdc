"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./ChangePassword.css";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage(
        "New password and confirm password do not match."
      );

      return;
    }

    if (newPassword.length < 6) {
      setMessage(
        "New password must be at least 6 characters."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to change password."
        );

        return;
      }

      setMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-password-page">
      <div className="admin-password-header">
        <p>ADMIN SETTINGS</p>

        <h1>Change Password</h1>

        <span>
          Update the password used to access the
          administration panel.
        </span>
      </div>

      <div className="admin-password-card">
        <form
          className="admin-password-form"
          onSubmit={handleSubmit}
        >
          {/* Current Password */}
          <div className="admin-password-field">
            <label htmlFor="currentPassword">
              Current Password
            </label>

            <div className="admin-password-input-wrapper">
              <input
                id="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Enter current password"
                required
              />

              <button
                type="button"
                className="admin-password-eye"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? "◉" : "◌"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="admin-password-field">
            <label htmlFor="newPassword">
              New Password
            </label>

            <div className="admin-password-input-wrapper">
              <input
                id="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="Enter new password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="admin-password-eye"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showNewPassword ? "◉" : "◌"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="admin-password-field">
            <label htmlFor="confirmPassword">
              Confirm New Password
            </label>

            <div className="admin-password-input-wrapper">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="admin-password-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? "◉" : "◌"}
              </button>
            </div>
          </div>

          <div className="admin-password-actions">
            <button
              type="button"
              className="admin-password-cancel"
              onClick={() =>
                router.push("/admin/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-password-button"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Change Password"}
            </button>
          </div>

          {message && (
            <p className="admin-password-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}