import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* =====================================
          COMMON SIDEBAR
      ====================================== */}

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* =====================================
          MAIN AREA
      ====================================== */}

      <div className="min-h-screen lg:ml-[275px]">

        {/* ===================================
            COMMON NAVBAR
        ==================================== */}

        <AdminNavbar
          setMobileOpen={setMobileOpen}
        />

        {/* ===================================
            PAGE CONTENT
        ==================================== */}

        <main className="p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
