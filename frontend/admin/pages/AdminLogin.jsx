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
      import.meta.env.VITE_API_URL ||
      "";

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

    // Save token FIRST
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

    // Check token
    console.log(
      "SAVED TOKEN:",
      localStorage.getItem("adminToken")
    );

    // Redirect
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Logo / Title */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0f2239]">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            School Administration Panel
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              autoComplete="username"
              className="
                h-[52px]
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                text-gray-800
                outline-none
                transition
                focus:border-[#2d2588]
                focus:ring-2
                focus:ring-[#2d2588]/20
              "
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              autoComplete="current-password"
              className="
                h-[52px]
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                text-gray-800
                outline-none
                transition
                focus:border-[#2d2588]
                focus:ring-2
                focus:ring-[#2d2588]/20
              "
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-[#2d2588]
              px-5
              py-3.5
              font-semibold
              text-white
              transition
              hover:bg-[#e71b93]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;
