import { useState } from "react";
import { PhoneCall, Menu, X } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import defaultLogo from "../../../assets/logo.png";
import useHeaderData from "../../../hooks/useHeaderData";

import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const {
    settings,
    menuItems,
    loading,
  } = useHeaderData();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ==========================================================
  // API / IMAGE URL
  // ==========================================================

  const IMAGE_URL =
    import.meta.env.VITE_IMAGE_URL ||
    "";

  // ==========================================================
  // HEADER SETTINGS
  // ==========================================================

  const email =
    settings?.email || "";

  const facebookUrl =
    settings?.facebook_url || "";

  const instagramUrl =
    settings?.instagram_url || "";

  const youtubeUrl =
    settings?.youtube_url || "";

  const phoneLabel =
    settings?.phone_label || "Call Us";

  const phoneNumber =
    settings?.phone_number || "";

  const applyText =
    settings?.apply_text || "Apply Now";

  const applyUrl =
    settings?.apply_url || "/contact";

  // ==========================================================
  // LOGO URL
  // ==========================================================

  const getLogoUrl = () => {
    if (!settings?.logo) {
      return defaultLogo;
    }

    // If database contains complete URL
    if (
      settings.logo.startsWith("http://") ||
      settings.logo.startsWith("https://")
    ) {
      return settings.logo;
    }

    // Database contains:
    // /uploads/header/logo-xxxx.png
    return `${IMAGE_URL}${settings.logo}`;
  };

  const logoUrl = getLogoUrl();

  // ==========================================================
  // HEADER ENABLE / DISABLE
  // ==========================================================

  if (
    !loading &&
    settings &&
    Number(settings.status) !== 1
  ) {
    return null;
  }

  return (
    <header className="main-header-style2 absolute left-0 top-0 z-[99] w-full">
      <div className="relative min-h-[90px] md:pl-[300px]">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="main-header-style2__logo-box absolute left-0 top-0 z-20">

          <div
            className="
              logo-box-style2
              relative
              flex
              h-[90px]
              w-[250px]
              items-center
              justify-center
              md:w-[300px]
            "
          >

            <div
              className="
                absolute
                inset-0
                -right-[180px]
                -z-10
                bg-gradient-to-r
                from-[#2E0797]
                to-[#2d3381]
                [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]
              "
            />

            <a
              href="/"
              className="relative z-10 inline-block"
              onClick={closeMobileMenu}
            >
              <img
                src={logoUrl}
                alt="School Logo"
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    defaultLogo;
                }}
              />
            </a>

          </div>

        </div>

        {/* =====================================================
            HEADER CONTENT
        ===================================================== */}

        <div className="relative">

          {/* ===================================================
              TOP BAR
          =================================================== */}

          <div
            className="
              main-header-style2__top
              relative
              hidden
              h-[50px]
              items-center
              justify-between
              bg-[#f7f4f3]
              px-5
              md:flex
            "
          >

            {/* EMAIL */}

            <div className="main-header-style2__top-left pl-[190px]">

              {email && (
                <p className="m-0 text-[17px] leading-[30px] text-[#5e5b5a]">

                  Email :{" "}

                  <a
                    href={`mailto:${email}`}
                    className="
                      transition-colors
                      duration-200
                      hover:text-[#e71b93]
                    "
                  >
                    {email}
                  </a>

                </p>
              )}

            </div>

            {/* SOCIAL MEDIA */}

            <div className="main-header-style2__top-right pr-[60px]">

              <div className="relative mr-[40px] block pl-[35px]">

                <ul className="relative m-0 flex list-none items-center p-0">

                  {/* FACEBOOK */}

                  {facebookUrl && (
                    <li className="relative pr-[30px]">

                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="
                          text-[#1a2b3f]
                          transition-colors
                          duration-200
                          hover:text-[#f6ac27]
                        "
                      >
                        <FaFacebookF size={18} />
                      </a>

                    </li>
                  )}

                  {/* INSTAGRAM */}

                  {instagramUrl && (
                    <li className="relative pr-[30px]">

                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="
                          text-[#1a2b3f]
                          transition-colors
                          duration-200
                          hover:text-[#f6ac27]
                        "
                      >
                        <FaInstagram size={18} />
                      </a>

                    </li>
                  )}

                  {/* YOUTUBE */}

                  {youtubeUrl && (
                    <li className="relative pr-[30px]">

                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="
                          text-[#1a2b3f]
                          transition-colors
                          duration-200
                          hover:text-[#f6ac27]
                        "
                      >
                        <FaYoutube size={18} />
                      </a>

                    </li>
                  )}

                </ul>

              </div>

            </div>

          </div>

          {/* ===================================================
              BOTTOM HEADER
          =================================================== */}

          <div className="main-header-style2__bottom relative z-10 px-0 md:pr-[60px]">

            <span className="header-white-line header-white-line-left" />

            <span className="header-white-line header-white-line-right" />

            <div
              className="
                main-header-style2__bottom-inner
                relative
                mx-0
                flex
                min-h-[70px]
                items-center
                justify-between
                rounded-[4px]
                bg-white
                shadow-[0_0_30px_0_rgba(0,0,0,0.12)]
                md:mx-[18px]
              "
            >

              {/* =================================================
                  LEFT MENU AREA
              ================================================= */}

              <div
                className="
                  main-header-style2__bottom-left
                  relative
                  flex
                  min-h-[70px]
                  flex-1
                  items-center
                  rounded-[4px]
                "
              >

                {/* DESKTOP NAVIGATION */}

                <nav className="hidden md:block">

                  <ul className="m-0 flex list-none items-center p-0">

                    {menuItems.map((item) => (
                      <li
                        key={item.id}
                        className="group"
                      >

                        <a
                          href={item.href}
                          className="
                            inline-block
                            px-[26px]
                            py-[15px]
                            font-pathway
                            text-[18px]
                            font-semibold
                            leading-7
                            capitalize
                            text-[#1a2b3f]
                            transition-all
                            duration-200
                            group-hover:text-[#e71b93]
                          "
                        >
                          {item.name}
                        </a>

                      </li>
                    ))}

                  </ul>

                </nav>

                {/* MOBILE MENU TOGGLE */}

                <button
                  type="button"
                  aria-label={
                    mobileMenuOpen
                      ? "Close menu"
                      : "Open menu"
                  }
                  aria-expanded={
                    mobileMenuOpen
                  }
                  onClick={() =>
                    setMobileMenuOpen(
                      (prev) => !prev
                    )
                  }
                  className="mobile-menu-toggle"
                >

                  {mobileMenuOpen ? (
                    <X
                      size={28}
                      strokeWidth={2}
                    />
                  ) : (
                    <Menu
                      size={28}
                      strokeWidth={2}
                    />
                  )}

                </button>

              </div>

              {/* =================================================
                  PHONE RIGHT
              ================================================= */}

              <div
                className="
                  main-header-style2__bottom-right
                  relative
                  hidden
                  items-center
                  pr-[18px]
                  md:flex
                "
              >

                <span className="header-yellow-line header-yellow-line-left" />

                <span className="header-yellow-line header-yellow-line-right" />

                <div
                  className="enroll-box-style1
                    relative
                    z-10
                    flex
                    items-center
                    bg-gradient-to-r
                    from-[#2E0797]
                    to-[#2d3381]
                    px-[30px]
                    py-[17px]
                  "
                >

                  <div
                    className="
                      flex
                      h-[45px]
                      w-[45px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#f6ac27]
                    "
                  >
                    <PhoneCall
                      size={24}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="ml-[15px] pt-[3px] text">

                    <p className="m-0 mb-[3px] text-[16px] leading-4 text-white">
                      {phoneLabel}
                    </p>

                    {phoneNumber && (
                      <a
                        href={`tel:${phoneNumber.replace(
                          /\s+/g,
                          ""
                        )}`}
                        className="
                          font-pathway
                          text-[16px]
                          font-bold
                          leading-[18px]
                          text-white
                          transition-colors
                          duration-200
                          hover:text-[#f6ac27]
                        "
                      >
                        {phoneNumber}
                      </a>
                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                MOBILE MENU
            ===================================================== */}

            {mobileMenuOpen && (
              <div className="mobile-menu">

                <ul>

                  {menuItems.map(
                    (item) => (
                      <li
                        key={item.id}
                      >

                        <a
                          href={item.href}
                          onClick={
                            closeMobileMenu
                          }
                        >
                          {item.name}
                        </a>

                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
