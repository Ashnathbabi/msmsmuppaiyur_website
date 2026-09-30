import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  X,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Images,
  UserRound,
  Trophy,
  Building2,
  BookOpen,
  Info,
  Phone,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen, adminData }) => {
  const navigate = useNavigate();

  // =========================================================
  // COLLAPSE STATES
  // =========================================================

  const [homePagesOpen, setHomePagesOpen] = useState(true);
  const [innerPagesOpen, setInnerPagesOpen] = useState(false);
  const [otherinnerPagesOpen, setotherInnerPagesOpen] = useState(false);

  // =========================================================
  // MENU ITEMS
  // =========================================================

  const menuItems = [
    // ---------------------------------------------------------
    // DASHBOARD
    // ---------------------------------------------------------

    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      dashboard: true,
    },

    // ---------------------------------------------------------
    // HOME PAGE
    // ---------------------------------------------------------
     {
      title: "Header",
      icon: LayoutDashboard,
      path: "/admin/header",
      homePage: true,
    },
    {
      title: "Hero Banner",
      icon: LayoutDashboard,
      path: "/admin/hero-banner",
      homePage: true,
    },
    {
      title: "Marquee",
      icon: LayoutDashboard,
      path: "/admin/marquee",
      homePage: true,
    },
    {
      title: "About",
      icon: LayoutDashboard,
      path: "/admin/about-home",
      homePage: true,
    },

    {
      title: "Activities",
      icon: LayoutDashboard,
      path: "/admin/activity-home",
      homePage: true,
    },

    {
      title: "Why Choose",
      icon: LayoutDashboard,
      path: "/admin/whychoose",
      homePage: true,
    },

    {
      title: "How to Apply",
      icon: LayoutDashboard,
      path: "/admin/how-to-apply",
      homePage: true,
    },

    {
      title: "Gallery",
      icon: Images,
      path: "/admin/gallery-home",
      homePage: true,
    },

    {
      title: "Management",
      icon: UserRound,
      path: "/admin/management",
      homePage: true,
    },

    {
      title: "News Event",
      icon: Trophy,
      path: "/admin/news-events",
      homePage: true,
    },

    {
      title: "Footer",
      icon: Building2,
      path: "/admin/footer",
      homePage: true,
    },

    {
      title: "Inner Footer",
      icon: Building2,
      path: "/admin/inner-footer",
      homePage: true,
    },

    // ---------------------------------------------------------
    // INNER PAGES
    // ---------------------------------------------------------
      {
      title: "About",
      icon: Info,
      path: "/admin/about-inner",
      innerPage: true,
    },
    {
      title: "Activity",
      icon: Trophy,
      path: "/admin/activity",
      innerPage: true,
    },

    {
      title: "Facilities",
      icon: Building2,
      path: "/admin/facilities",
      innerPage: true,
    },

    {
      title: "Academics",
      icon: BookOpen,
      path: "/admin/academics",
      innerPage: true,
    },

    {
      title: "Gallery",
      icon: Images,
      path: "/admin/gallery",
      innerPage: true,
    },

    {
      title: "Alumni",
      icon: GraduationCap,
      path: "/admin/alumni",
      innerPage: true,
    }, 
    {
      title: "Contact Us",
      icon: Phone,
      path: "/admin/contact",
      innerPage: true,
    },

    // ---------------------------------------------------------
    // OTHER PAGES
    // ---------------------------------------------------------

    {
      title: "Manage Admins",
      icon: Users,
      path: "/admin/admins",
      superAdminOnly: true,
    },

    {
      title: "Notifications",
      icon: Bell,
      path: "/admin/notifications",
    },

    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  // =========================================================
  // FILTER SUPER ADMIN ITEMS
  // =========================================================

  const filteredMenu = menuItems.filter(
    (item) =>
      !item.superAdminOnly ||
      adminData?.role === "superadmin"
  );

  // =========================================================
  // SEPARATE MENU GROUPS
  // =========================================================

  const dashboardMenu = filteredMenu.filter(
    (item) => item.dashboard
  );

  const homePages = filteredMenu.filter(
    (item) => item.homePage
  );

  const innerPages = filteredMenu.filter(
    (item) => item.innerPage
  );

  const otherMenu = filteredMenu.filter(
    (item) =>
      !item.dashboard &&
      !item.homePage &&
      !item.innerPage
  );

  // =========================================================
  // MENU ITEM RENDER
  // =========================================================

  const renderMenuItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => {
          if (window.innerWidth < 1024) {
            setIsOpen?.(false);
          }
        }}
        className={({ isActive }) =>
          `
          group
          flex
          items-center
          gap-3
          rounded-xl
          px-3
          py-2.5
          text-sm
          font-medium
          transition-all
          duration-200

          ${
            isActive
              ? `
                bg-[#e71b93]
                text-white
                shadow-lg
                shadow-[#e71b93]/20
              `
              : `
                text-white/60
                hover:bg-white/[0.06]
                hover:text-white
              `
          }
          `
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={18}
              strokeWidth={isActive ? 2.2 : 1.8}
              className={`
                shrink-0
                transition-all
                duration-200
                ${
                  isActive
                    ? "text-white"
                    : "text-white/45 group-hover:text-white"
                }
              `}
            />

            <span className="flex-1 truncate">
              {item.title}
            </span>

            {isActive && (
              <ChevronRight
                size={15}
                strokeWidth={2}
                className="shrink-0 text-white/80"
              />
            )}
          </>
        )}
      </NavLink>
    );
  };

  // =========================================================
  // SECTION TITLE
  // =========================================================

  const SectionHeader = ({
    title,
    isOpen,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          mb-3
          mt-7
          flex
          w-full
          items-center
          gap-2
          rounded-lg
          px-2
          py-1
          text-left
          transition-all
          duration-200
          hover:bg-white/[0.04]
        "
      >
        <span
          className="
            h-[3px]
            w-5
            shrink-0
            rounded-full
            bg-[#e71b93]
          "
        />

        <p
          className="
            flex-1
            text-[11px]
            font-bold
            uppercase
            tracking-[1.5px]
            text-white/35
          "
        >
          {title}
        </p>

        {isOpen ? (
          <ChevronDown
            size={17}
            strokeWidth={2}
            className="text-white/35"
          />
        ) : (
          <ChevronRight
            size={17}
            strokeWidth={2}
            className="text-white/35"
          />
        )}
      </button>
    );
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-[2px]
            lg:hidden
          "
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[270px]
          flex-col
          border-r
          border-white/[0.06]
          bg-[#101116]
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        {/* ===================================================
            LOGO / HEADER
        =================================================== */}

        <div
          className="
            flex
            h-[76px]
            shrink-0
            items-center
            justify-between
            border-b
            border-white/[0.06]
            px-5
          "
        >
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#e71b93]
                shadow-lg
                shadow-[#e71b93]/20
              "
            >
              <span
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                M
              </span>
            </div>

            {/* Brand */}
            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  tracking-wide
                  text-white
                "
              >
                MSMHSS
              </h3>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  uppercase
                  tracking-[1.5px]
                  text-white/35
                "
              >
                Admin Panel
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setIsOpen?.(false)}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-white/50
              transition
              hover:bg-white/[0.06]
              hover:text-white
              lg:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

       

        {/* ===================================================
            MENU
        =================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-4
            pb-6
            pt-2

            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-white/10
          "
        >
          {/* =================================================
              DASHBOARD - SEPARATE
          ================================================= */}

          <div className="mt-2">
            <nav className="space-y-1.5">
              {dashboardMenu.map((item) =>
                renderMenuItem(item)
              )}
            </nav>
          </div>

          {/* =================================================
              HOME PAGE
          ================================================= */}

          <SectionHeader
            title="Home Page"
            isOpen={homePagesOpen}
            onClick={() =>
              setHomePagesOpen((prev) => !prev)
            }
          />

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ease-in-out

              ${
                homePagesOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <nav className="space-y-1.5">
              {homePages.map((item) =>
                renderMenuItem(item)
              )}
            </nav>
          </div>

          {/* =================================================
              INNER PAGES
          ================================================= */}

          <SectionHeader
            title="Inner Pages"
            isOpen={innerPagesOpen}
            onClick={() =>
              setInnerPagesOpen((prev) => !prev)
            }
          />

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ease-in-out

              ${
                innerPagesOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <nav className="space-y-1.5">
              {innerPages.map((item) =>
                renderMenuItem(item)
              )}
            </nav>
          </div>

          {/* =================================================
              OTHER PAGES
          ================================================= */}

          <SectionHeader
            title="Other Pages"
            isOpen={otherinnerPagesOpen}
            onClick={() =>
              setotherInnerPagesOpen(
                (prev) => !prev
              )
            }
          />

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ease-in-out

              ${
                otherinnerPagesOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <nav className="space-y-1.5">
              {otherMenu.map((item) =>
                renderMenuItem(item)
              )}
            </nav>
          </div>
        </div>

        {/* ===================================================
            SIDEBAR FOOTER
        =================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-white/[0.06]
            px-5
            py-4
          "
        >
          <p
            className="
              text-center
              text-[10px]
              tracking-wide
              text-white/20
            "
          >
            © 2026 MSMHSS Admin
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;