import React from "react";
import {
  MessageSquareText,
  Users,
  Bell,
  ShieldCheck,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div>

      {/* Page Heading */}

      <div className="mb-7">

        <h2
          className="
            font-['Figtree',sans-serif]
            text-[25px]
            font-bold
            text-[#0f2239]
          "
        >
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-[#888]">
          Welcome to Muppaiyur School Admin Panel.
        </p>

      </div>

      {/* =====================================
          STAT CARDS
      ====================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Messages */}

        <div
          className="
            rounded-2xl
            border
            border-[#eeeeee]
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,34,57,0.04)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-[#999]">
                Contact Messages
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#0f2239]">
                0
              </h3>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeafd] text-[#2d2588]">
              <MessageSquareText size={22} />
            </div>

          </div>

        </div>

        {/* Admins */}

        <div
          className="
            rounded-2xl
            border
            border-[#eeeeee]
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,34,57,0.04)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-[#999]">
                Administrators
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#0f2239]">
                1
              </h3>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8ef] text-[#20a45a]">
              <Users size={22} />
            </div>

          </div>

        </div>

        {/* Notifications */}

        <div
          className="
            rounded-2xl
            border
            border-[#eeeeee]
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,34,57,0.04)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-[#999]">
                Notifications
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#0f2239]">
                0
              </h3>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff5df] text-[#f2921f]">
              <Bell size={22} />
            </div>

          </div>

        </div>

        {/* Security */}

        <div
          className="
            rounded-2xl
            border
            border-[#eeeeee]
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(15,34,57,0.04)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-[#999]">
                Account
              </p>

              <h3 className="mt-2 text-lg font-bold text-emerald-600">
                Secure
              </h3>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8ef] text-emerald-600">
              <ShieldCheck size={22} />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
