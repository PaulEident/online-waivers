"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateProfile, changePassword } from "@/lib/actions";

interface ProfileProps {
  profile: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    hasPassword: boolean;
    hasGoogle: boolean;
  };
}

export default function ProfileForm({ profile }: ProfileProps) {
  const { update } = useSession();
  const router = useRouter();

  // Profile details
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(profile.image);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setProfileLoading(true);

    const result = await updateProfile({ name, bio });

    if (result.error) {
      setProfileErr(result.error);
    } else {
      setProfileMsg("Profile updated");
      await update();
      router.refresh();
    }
    setProfileLoading(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileErr("Image must be under 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileErr("File must be an image");
      return;
    }

    setAvatarLoading(true);
    setProfileErr("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-avatar", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) {
        setProfileErr(data.error);
      } else {
        setAvatarUrl(data.url);
        setProfileMsg("Photo updated");
        await update();
        router.refresh();
      }
    } catch {
      setProfileErr("Upload failed. Please try again.");
    }
    setAvatarLoading(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordErr("");

    if (newPassword.length < 8) {
      setPasswordErr("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErr("Passwords do not match");
      return;
    }

    setPasswordLoading(true);

    const result = await changePassword({
      currentPassword,
      newPassword,
    });

    if (result.error) {
      setPasswordErr(result.error);
    } else {
      setPasswordMsg("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Profile photo</h2>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="w-20 h-20 rounded-full ring-2 ring-gray-100 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center text-brand text-2xl font-bold">
              {(profile.name || profile.email || "U")[0].toUpperCase()}
            </div>
          )}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="text-sm bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {avatarLoading ? "Uploading..." : "Upload new photo"}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP. Max 2MB.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <form onSubmit={handleProfileSave} className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Personal details</h2>

        {profileMsg && (
          <div className="text-green-700 text-sm bg-green-50 border border-green-100 p-3 rounded-xl mb-3">{profileMsg}</div>
        )}
        {profileErr && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl mb-3">{profileErr}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white resize-none"
              placeholder="Tell us a bit about yourself..."
            />
            <div className="text-xs text-gray-400 text-right">{bio.length}/500</div>
          </div>
        </div>

        <button
          type="submit"
          disabled={profileLoading}
          className="mt-4 bg-brand hover:bg-brand-hover text-white text-sm font-semibold h-10 px-5 rounded-lg transition-all disabled:opacity-50 shadow-sm"
        >
          {profileLoading ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Change Password */}
      {profile.hasPassword ? (
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Change password</h2>

          {passwordMsg && (
            <div className="text-green-700 text-sm bg-green-50 border border-green-100 p-3 rounded-xl mb-3">{passwordMsg}</div>
          )}
          {passwordErr && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl mb-3">{passwordErr}</div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="rounded border-gray-300"
              />
              Show passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="mt-4 bg-brand hover:bg-brand-hover text-white text-sm font-semibold h-10 px-5 rounded-lg transition-all disabled:opacity-50 shadow-sm"
          >
            {passwordLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-2">Password</h2>
          <p className="text-sm text-gray-500">
            You signed in with Google. Password management is not available for OAuth-only accounts.
          </p>
        </div>
      )}
    </div>
  );
}
