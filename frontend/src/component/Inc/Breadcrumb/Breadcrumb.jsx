import React from "react";
import { Link } from "react-router-dom";

import './Breadcrumb.css'

import BreadcrumbBg from "../../../assets/breadcrumb/breadcrumb.jpg";
import BreadcrumbShape from "../../../assets/breadcrumb/HE001.png";
import Arrow from "../../../assets/breadcrumb/arrow.png";

const Breadcrumb = ({ title }) => {
  return (
    <section
      className="
        relative
        z-[1]
        m-0
        w-full
        overflow-hidden
        bg-[#15181B]

        py-[100px]

        sm:py-[120px]

        md:py-[140px]

        lg:py-[150px]

        xl:py-[168px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          z-[-1]
          bg-cover
          bg-center
          bg-no-repeat
          opacity-30
        "
        style={{
          backgroundImage: `url(${BreadcrumbBg})`,
        }}
      />


      {/* =====================================================
          DARK OVERLAY
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          z-[-1]
          bg-[#15181B]/50
        "
      />


      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-[2]
          mx-auto
          flex
          w-full
          max-w-[1140px]
          items-center
          justify-center
          px-4
          text-center
        "
      >
        <div className="w-full">

          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <nav
            aria-label="Breadcrumbs"
            className="
              flex
              w-full
              items-center
              justify-center
            "
          >
            <ul
              className="
                m-0
                flex
                flex-wrap
                items-center
                justify-center
                gap-0
                list-none
                rounded-[4px]
                bg-[#0d4071]
                px-4
                py-3

                sm:px-5
                sm:py-3

                md:px-6
                md:py-3.5
              "
            >

              {/* =========================================
                  LOCATION ICON
              ========================================== */}

              <li className="mr-2 flex items-center">
                <span
                  className="
                    flex
                    h-[8px]
                    w-[8px]
                    rounded-full
                    bg-white
                  "
                />
              </li>


              {/* =========================================
                  HOME
              ========================================== */}

              <li className="flex items-center">

                <Link
                  to="/"
                  className="
                    inline-flex
                    items-center
                    font-['Figtree',sans-serif]
                    text-[16px]
                    font-medium
                    leading-[24px]
                    text-white
                    no-underline
                    transition-colors
                    duration-300

                    sm:text-[18px]

                    md:text-[20px]

                    hover:text-white
                  "
                >
                  Home
                </Link>


                {/* =====================================
                    ARROW
                ====================================== */}

                <span
                  className="
                    mx-2
                    flex
                    items-center

                    sm:mx-3
                  "
                >
                  <img
                    src={Arrow}
                    alt=""
                    className="
                      h-auto
                      w-[13px]
                      object-contain

                      sm:w-[16px]

                      md:w-[18px]
                    "
                  />
                </span>

              </li>


              {/* =========================================
                  CURRENT PAGE
              ========================================== */}

              <li
                className="
                  flex
                  items-center
                  font-['Figtree',sans-serif]
                  text-[16px]
                  font-medium
                  leading-[24px]
                  text-white

                  sm:text-[18px]

                  md:text-[20px]
                "
              >
                <span>
                  {title}
                </span>
              </li>

            </ul>
          </nav>

        </div>
      </div>


      {/* =====================================================
          DECORATIVE SHAPES
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          hidden

          md:block
        "
      >

        {/* ================================================
            LEFT SHAPE
        ================================================= */}

        <div
          className="
            absolute
            left-[7%]
            top-[60px]
            animate-[zoomInOut_5s_ease-in-out_infinite]
          "
        >
          <img
            src={BreadcrumbShape}
            alt="Breadcrumb Abstract Shape"
            className="
              block
              h-auto
              w-auto
              max-w-full
            "
          />
        </div>


        {/* ================================================
            RIGHT CIRCLE
        ================================================= */}

        <div
          className="
            absolute
            bottom-[28%]
            right-[8%]
            h-[48px]
            w-[48px]
            rounded-full
            border-[4px]
            border-[#f6b13d]
            animate-[zoomInOut_3s_ease-in-out_infinite]
          "
        />

      </div>

    </section>
  );
};

export default Breadcrumb;