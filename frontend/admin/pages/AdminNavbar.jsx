import React from "react";
import {
  Menu,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ setMobileOpen }) => {
  const navigate = useNavigate();

  const adminData = JSON.parse(
    localStorage.getItem("adminData") || "{}"
  );

  const handleLogout = () => {
    // 1. Clear admin session
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    // 2. Close mobile sidebar
    if (setMobileOpen) {
      setMobileOpen(false);
    }

    // 3. Go to login page
    navigate("/admin/login", { replace: true });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[78px]
        items-center
        justify-between
        border-b
        border-[#e9e9ef]
        bg-white
        px-4
        shadow-[0_2px_12px_rgba(15,34,57,0.04)]
        sm:px-6
        lg:px-8
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-[#f5f4fb]
            text-[#2d2588]
            transition-all
            hover:bg-[#2d2588]
            hover:text-white
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            className="
              font-['Figtree',sans-serif]
              text-[18px]
              font-bold
              leading-[23px]
              text-[#0f2239]
              sm:text-[20px]
            "
          >
            Admin Dashboard
          </h1>

          <p className="hidden text-[11px] text-[#999] sm:block">
            Muppaiyur School Management System
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* SITE */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            hidden
            items-center
            gap-2
            rounded-xl
            border
            border-[#e3e1f2]
            bg-[#faf9ff]
            px-3
            py-2
            text-[#2d2588]
            transition-all
            duration-200
            hover:border-[#2d2588]
            hover:bg-[#2d2588]
            hover:text-white
            sm:flex
            sm:px-4
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[#eeeafd]
              transition
              group-hover:bg-white/10
            "
          >
            <ExternalLink size={16} />
          </span>

          <span className="text-left">
            <span className="block text-[11px] font-bold">
              Visit Website
            </span>

            <span className="block max-w-[125px] truncate text-[9px] opacity-60">
              msmsmuppaiyur.com
            </span>
          </span>
        </a>

        {/* ADMIN */}
        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[#eeeeee]
            bg-white
            px-2
            py-1.5
            sm:px-3
          "
        >
          <div
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-[#2d2588]
              to-[#5b51bf]
              text-white
              shadow-[0_4px_12px_rgba(45,37,136,0.2)]
            "
          >
            <ShieldCheck size={17} />

            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-white
                bg-[#22c55e]
              "
            />
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-[130px] truncate text-[11px] font-bold text-[#0f2239]">
              {adminData.name || "Super Admin"}
            </p>

            <p className="max-w-[130px] truncate text-[9px] text-[#999]">
              {adminData.email || "admin@msmsmuppaiyur.com"}
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-[#999] md:block"
          />
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="
            group
            flex
            h-[43px]
            w-[43px]
            items-center
            justify-center
            rounded-xl
            border
            border-red-100
            bg-red-50
            text-red-500
            transition-all
            duration-200
            hover:border-red-500
            hover:bg-red-500
            hover:text-white
            hover:shadow-[0_6px_18px_rgba(239,68,68,0.2)]
          "
        >
          <LogOut
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
