
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "admin@msmsmuppaiyur.com",
    password: "pilankalai1985",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "";

      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseText = await response.text();

      console.log("STATUS:", response.status);
      console.log("RESPONSE:", responseText);

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        throw new Error(
          "Server returned invalid JSON response"
        );
      }

      console.log("LOGIN DATA:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Login failed (${response.status})`
        );
      }

      if (!data.token) {
        throw new Error(
          data.message ||
            "Token not received from server"
        );
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      if (data.admin) {
        localStorage.setItem(
          "adminData",
          JSON.stringify(data.admin)
        );
      }

      console.log(
        "SAVED TOKEN:",
        localStorage.getItem("adminToken")
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f2fa] px-5">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(45,37,136,0.13),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(231,27,147,0.12),transparent_30%)]" />

      {/* Decorative Shapes */}
      <div className="absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full border-[70px] border-[#2d2588]/5" />

      <div className="absolute -bottom-36 -right-36 h-[500px] w-[500px] rounded-full border-[80px] border-[#e71b93]/5" />

      <div className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-[#2d2588]/25" />

      <div className="absolute right-[12%] top-[28%] h-3 w-3 rounded-full bg-[#e71b93]/25" />

      <div className="absolute bottom-[20%] left-[15%] h-3 w-3 rounded-full bg-[#2d2588]/20" />

      {/* Main */}
      <div className="relative z-10 w-full max-w-[430px]">

        {/* Card */}
        <div
          className="
            overflow-hidden
            rounded-[22px]
            border
            border-white
            bg-white
            shadow-[0_25px_70px_rgba(32,25,80,0.14)]
          "
        >

          {/* Top Accent */}
          <div className="h-[5px] bg-gradient-to-r from-[#2d2588] via-[#5b42a8] to-[#e71b93]" />

          <div className="px-9 pb-10 pt-9">

            {/* Header */}
            <div className="mb-9">

              <div className="mb-5 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#2d2588]
                    text-lg
                    font-bold
                    text-white
                    shadow-[0_6px_15px_rgba(45,37,136,0.25)]
                  "
                >
                  A
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#2d2588]">
                    Administration
                  </p>

                  <p className="text-sm font-medium text-gray-400">
                    School Management
                  </p>
                </div>

              </div>

              <h1 className="text-[30px] font-bold tracking-[-0.5px] text-[#14243b]">
                Welcome Back
              </h1>

              <p className="mt-2 text-[14px] leading-6 text-gray-500">
                Sign in to continue to your admin dashboard.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="mb-2 block text-[13px] font-semibold text-[#27364d]">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  autoComplete="username"
                  className="
                    h-[54px]
                    w-full
                    rounded-xl
                    border
                    border-[#dfe2e8]
                    bg-[#fafbfc]
                    px-4
                    text-[14px]
                    text-gray-800
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-400
                    hover:border-[#c8cad2]
                    focus:border-[#2d2588]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#2d2588]/10
                  "
                />

              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-[13px] font-semibold text-[#27364d]">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="
                    h-[54px]
                    w-full
                    rounded-xl
                    border
                    border-[#dfe2e8]
                    bg-[#fafbfc]
                    px-4
                    text-[14px]
                    text-gray-800
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-400
                    hover:border-[#c8cad2]
                    focus:border-[#2d2588]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#2d2588]/10
                  "
                />

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-3
                  h-[54px]
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-[#2d2588]
                  to-[#4436a0]
                  text-[14px]
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(45,37,136,0.24)]
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:shadow-[0_12px_25px_rgba(45,37,136,0.30)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>

            </form>

            {/* Bottom Text */}
            <p className="mt-7 text-center text-[11px] text-gray-400">
              Secure access • Authorized administrators only
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
