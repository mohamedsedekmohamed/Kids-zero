import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import Loading from "@/Components/Loading";
import toast from "react-hot-toast";

const Profile = () => {
  const { data, loading } = useGet("/api/superadmin/profile");
  const { putData, loading: saving } = usePut();

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (data?.data?.data) {
      const admin = data.data.data;
      setForm((prev) => ({
        ...prev,
        name: admin.name || "",
        email: admin.email || "",
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔹 تحديث البيانات الأساسية
      await putData(
        {
          name: form.name,
          email: form.email,
        },
        "/api/superadmin/profile",
        "Profile updated successfully ✅"
      );

      // 🔹 تغيير كلمة المرور (لو المستخدم كتبها)
      if (form.currentPassword || form.newPassword || form.confirmPassword) {
        if (!form.currentPassword || !form.newPassword) {
          return toast.error("Please fill all password fields ❌");
        }

        if (form.newPassword !== form.confirmPassword) {
          return toast.error("Passwords do not match ❌");
        }

        await putData(
          {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          },
          "/api/superadmin/profile/change-password",
          "Password changed successfully 🔐"
        );

        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      // errors handled in hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-one outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-one outline-none"
            />
          </div>

          <hr />

          {/* Current Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-one outline-none"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-one outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-one outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-one text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
