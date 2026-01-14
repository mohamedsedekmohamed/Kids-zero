import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaCamera, FaLock, FaShieldAlt } from "react-icons/fa";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import Loading from "@/Components/Loading";

const Profile = () => {
  const { data, loading } = useGet("/api/admin/profile");
  const { putData, loading: saving } = usePut("/api/admin/profile");

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (data?.data?.admin) {
      const admin = data.data.admin;
      setForm((prev) => ({
        ...prev,
        name: admin.name || "",
        email: admin.email || "",
        avatar: admin.avatar || "https://via.placeholder.com/150",
      }));
    }
  }, [data]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return alert("Passwords do not match! ❌");
    }

    await putData({
      name: form.name,
      email: form.email,
      avatar: form.avatar,
      oldPassword: form.oldPassword || undefined,
      newPassword: form.newPassword || undefined,
    });

    alert("Profile updated successfully! ✅");
    setForm({ ...form, newPassword: "", confirmPassword: "" });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Main Container */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        
        {/* Decorative Header */}
        <div className="relative h-40 bg-one overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <h2 className="text-3xl font-extrabold tracking-tight">Profile Settings</h2>
            <p className="opacity-90 text-sm font-medium mt-1">Keep your information secure and up to date</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10">
          
          {/* Avatar Section */}
          <div className="flex justify-center -mt-16 mb-10">
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                <img
                  src={form.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <label className="absolute bottom-2 right-2 bg-one text-white p-3 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all active:scale-95 border-2 border-white">
                <FaCamera size={18} />
                <input hidden type="file" accept="image/*" onChange={handleImage} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Basic Info */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Personal Details</h3>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-300 group-focus-within:text-one transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-300 group-focus-within:text-one transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all"
                />
              </div>
            </div>

            {/* Right Column: Security */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <FaShieldAlt className="text-one" /> Password Security
              </h3>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-300 group-focus-within:text-one transition-colors" />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-300 group-focus-within:text-one transition-colors" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-one/10 focus:border-one outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <button
              disabled={saving}
              className="w-full bg-one text-white py-4 rounded-2xl font-bold text-lg shadow-[0_10px_25px_-5px_rgba(var(--color-one),0.4)] hover:shadow-[0_15px_30px_-5px_rgba(var(--color-one),0.6)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:transform-none"
            >
              {saving ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </div>
              ) : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;