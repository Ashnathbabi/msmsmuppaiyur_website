import { API_URL, getImageUrl } from "../../../config/api";

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import logoSidebar from "../../../assets/academics/logo_sidebar.png";
import ratingShadow from "../../../assets/academics/rating-shadow.png";

import {
  getFacilities,
  getFacilityBySlug,
} from "../../../services/facilitiesService";


const Facilities = () => {
  const location = useLocation();

  const [facilities, setFacilities] = useState([]);
  const [facility, setFacility] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET CURRENT PAGE SLUG
  // =====================================================

  const currentPath = location.pathname
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const slug = currentPath || "facilities";

  // =====================================================
  // IMAGE URL
  // =====================================================

  

  // =====================================================
  // LOAD SIDEBAR FACILITIES
  // =====================================================

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setSidebarLoading(true);

        const response = await getFacilities();

        setFacilities(response?.data || []);
      } catch (error) {
        console.error("Sidebar Error:", error);
        setFacilities([]);
      } finally {
        setSidebarLoading(false);
      }
    };

    loadFacilities();
  }, []);

  // =====================================================
  // LOAD CURRENT FACILITY
  // =====================================================

  useEffect(() => {
    const loadFacility = async () => {
      try {
        setLoading(true);
        setError("");
        setFacility(null);

        // =================================================
        // MAIN FACILITIES PAGE
        // NAVBAR -> FACILITIES -> /facilities
        // =================================================

        if (slug === "facilities") {
          const response = await getFacilities();

          const data = response?.data || [];

          const mainFacility =
            data.find(
              (item) => item.slug === "facilities"
            ) || data[0];

          if (!mainFacility) {
            throw new Error("No facilities found");
          }

          // Try loading complete details
          try {
            const detailResponse =
              await getFacilityBySlug(
                mainFacility.slug
              );

            setFacility(
              detailResponse?.data ||
                mainFacility
            );
          } catch (detailError) {
            console.warn(
              "Facility detail not available:",
              detailError
            );

            setFacility(mainFacility);
          }

          return;
        }

        // =================================================
        // INDIVIDUAL FACILITY PAGES
        //
        // /transport
        // /computer-lab
        // /chemistry-lab
        // /biology-lab
        // /library
        // /smartclassroom
        // /classroom
        // /physics-lab
        // =================================================

        const response =
          await getFacilityBySlug(slug);

        if (!response?.data) {
          throw new Error("Facility not found");
        }

        setFacility(response.data);
      } catch (error) {
        console.error(
          "Facility Error:",
          error
        );

        setFacility(null);

        setError(
          error?.message ||
            "Failed to load facility"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFacility();
  }, [slug]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-[80px] sm:py-[90px] md:py-[100px] lg:py-[110px]">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-5 lg:px-6">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="font-['Figtree',sans-serif] text-gray-500">
              Loading...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !facility) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-[80px] sm:py-[90px] md:py-[100px] lg:py-[110px]">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-5 lg:px-6">
          <div className="rounded-[20px] bg-[#f5f5f5] p-6 text-center sm:p-10">
            <h2 className="font-['Figtree',sans-serif] text-xl font-semibold text-gray-800">
              Facility not found
            </h2>

            <p className="mt-2 font-['Figtree',sans-serif] text-gray-500">
              {error ||
                "Unable to load facility."}
            </p>

            <Link
              to="/facilities"
              className="mt-5 inline-block rounded-full bg-[#700515] px-6 py-3 font-['Figtree',sans-serif] text-sm font-medium text-white transition-all duration-300 hover:bg-[#e71b93]"
            >
              Back to Facilities
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // CURRENT FACILITY SLUG
  // =====================================================

  const currentSlug =
    facility.slug || slug;

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="relative w-full overflow-hidden bg-white py-[80px] sm:py-[90px] md:py-[100px] lg:py-[110px]">

      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-5 lg:px-6">

        <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-[30px]">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="w-full">

            {/* SERVICE CARD WRAPPER */}

            <div className="relative isolate">

              {/* BLACK BACKGROUND */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[-8px]
                  top-[-8px]
                  z-[-1]
                  hidden
                  h-[calc(100%-35px)]
                  w-[65%]
                  rounded-[22px]
                  bg-black
                  lg:block
                "
              />

              {/* MAIN CARD */}

              <div
                className="
                  relative
                  z-[1]
                  mb-[30px]
                  w-full
                  rounded-[20px]
                  bg-[#f5f5f5]
                  px-[20px]
                  py-[30px]
                  sm:px-[30px]
                  sm:py-[35px]
                  md:px-[40px]
                  md:py-[40px]
                "
              >

                {/* =================================================
                    FACILITY IMAGE
                ================================================= */}

                {facility.image && (
                  <div
                    className="
                      relative
                      mb-[35px]
                      w-full
                      overflow-hidden
                      rounded-[25px]
                    "
                  >

                    <img
                      src={getImageUrl(
                        facility.image
                      )}
                      alt={
                        facility.title ||
                        "Facility"
                      }
                      className="
                        block
                        h-auto
                        max-h-[550px]
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                    />

                    {/* IMAGE TAG */}

                    {facility.tag && (
                      <div
                        className="
                          absolute
                          bottom-[20px]
                          right-0
                          rounded-l-full
                          bg-white
                          px-[20px]
                          py-[12px]
                          font-['Figtree',sans-serif]
                          text-[15px]
                          font-semibold
                          text-[#e71b93]
                          sm:bottom-[30px]
                          sm:px-[25px]
                          sm:py-[14px]
                          sm:text-[16px]
                          md:bottom-[45px]
                          md:px-[30px]
                          md:py-[18px]
                          md:text-[18px]
                        "
                      >
                        {facility.tag}
                      </div>
                    )}

                  </div>
                )}

                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="relative">

                  <h2
                    className="
                      relative
                      mb-[30px]
                      mt-0
                      font-['Figtree',sans-serif]
                      text-[32px]
                      font-semibold
                      capitalize
                      leading-[42px]
                      tracking-[-0.5px]
                      text-[#050734]
                      sm:text-[40px]
                      sm:leading-[50px]
                      md:text-[50px]
                      md:leading-[60px]
                      lg:text-[60px]
                      lg:leading-[70px]
                    "
                  >
                    {facility.title}
                  </h2>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  {facility.description && (
                    <div
                      className="
                        mb-[25px]
                        font-['Figtree',sans-serif]
                        text-[16px]
                        leading-[30px]
                        text-[#555]
                        sm:text-[17px]
                        sm:leading-[32px]
                      "
                    >
                      {facility.description}
                    </div>
                  )}

                  {/* =================================================
                      RULES
                  ================================================= */}

                  {Array.isArray(
                    facility.rules
                  ) &&
                    facility.rules.length > 0 && (
                      <div className="relative">

                        <div className="space-y-[18px]">

                          {facility.rules.map(
                            (
                              rule,
                              index
                            ) => (
                              <div
                                key={
                                  rule.id ||
                                  index
                                }
                                className="
                                  flex
                                  items-start
                                  gap-[14px]
                                "
                              >

                                {/* RULE ICON */}

                                <div
                                  className="
                                    mt-[3px]
                                    flex
                                    h-[25px]
                                    w-[25px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#700515]
                                    text-white
                                  "
                                >
                                  <FaArrowUpRightFromSquare
                                    size={11}
                                  />
                                </div>

                                {/* RULE TEXT */}

                                <p
                                  className="
                                    font-['Figtree',sans-serif]
                                    text-[16px]
                                    leading-[28px]
                                    text-[#555]
                                  "
                                >
                                  {
                                    rule.rule_text
                                  }
                                </p>

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}

          <div className="w-full">

            <aside className="sticky z-[10]">

              {/* =================================================
                  FACILITIES SIDEBAR MENU

                  IMPORTANT:
                  "Facilities" main menu is NOT displayed here.
                  It belongs to Navbar.
              ================================================= */}
                
              <div
                className="
                  relative
                  mb-[40px]
                  overflow-hidden
                  rounded-[5px]
                  bg-[#f5f5f6]
                  p-[20px]
                  sm:p-[25px]
                  md:p-[30px]
                "
              >
                <h3
                  className="
                    relative
                    -mx-[30px]
                    -mt-[30px]
                    mb-[40px]
                    bg-[#e71b93]
                    px-[30px]
                    py-[13px]
                    font-['Figtree',sans-serif]
                    text-[23px]
                    font-bold
                    leading-[32px]
                    text-white
                  "
                >
                  Facilities
                </h3>
                {sidebarLoading ? (
                  <div className="py-5 text-center">
                    <p className="font-['Figtree',sans-serif] text-sm text-gray-500">
                      Loading...
                    </p>
                  </div>
                ) : facilities.filter(
                    (item) =>
                      item.slug !==
                      "facilities"
                  ).length === 0 ? (
                  <div className="py-5 text-center">
                    <p className="font-['Figtree',sans-serif] text-sm text-gray-500">
                      No facilities available.
                    </p>
                  </div>
                ) : (
                  <ul className="m-0 list-none p-0">

                    {/* =================================================
                        REMOVE MAIN "FACILITIES" ITEM
                    ================================================= */}

                    {facilities
                      .filter(
                        (item) =>
                          item.slug !==
                          "facilities"
                      )
                      .map(
                        (item) => {

                          const itemSlug =
                            item.slug;

                          const active =
                            itemSlug ===
                            currentSlug;

                          // Individual facility URL
                          const href =
                            `/${itemSlug}`;

                          return (
                            <li
                              key={
                                item.id
                              }
                              className="
                                group
                                relative
                                mb-[15px]
                                last:mb-0
                              "
                            >

                              <Link
                                to={href}
                                className={`
                                  relative
                                  block
                                  overflow-hidden
                                  rounded-full
                                  border
                                  border-black/50
                                  px-[20px]
                                  py-[15px]
                                  pr-[70px]
                                  font-['Figtree',sans-serif]
                                  text-[15px]
                                  font-semibold
                                  capitalize
                                  leading-[24px]
                                  transition-all
                                  duration-300
                                  hover:rotate-[2deg]
                                  sm:px-[25px]
                                  sm:py-[17px]
                                  sm:pr-[72px]
                                  sm:text-[16px]
                                  sm:leading-[26px]
                                  md:px-[30px]
                                  md:py-[18px]
                                  md:pr-[75px]
                                  ${
                                    active
                                      ? "text-white"
                                      : "text-black hover:text-white"
                                  }
                                `}
                              >

                                {/* =====================================
                                    HOVER / ACTIVE BACKGROUND
                                ===================================== */}

                                <span
                                  className={`
                                    absolute
                                    inset-0
                                    z-0
                                    rounded-full
                                    bg-gradient-to-r
                                    from-[#e71b93]
                                    via-[#e71b93]
                                    to-[#040201]
                                    transition-transform
                                    duration-500
                                    ${
                                      active
                                        ? "translate-y-0"
                                        : "translate-y-[-105%] group-hover:translate-y-0"
                                    }
                                  `}
                                />

                                {/* =====================================
                                    MENU TEXT
                                ===================================== */}

                                <span className="relative z-[2]">
                                  {item.title}
                                </span>

                                {/* =====================================
                                    ARROW
                                ===================================== */}

                                <span
                                  className={`
                                    absolute
                                    right-[5px]
                                    top-1/2
                                    z-[3]
                                    flex
                                    h-[50px]
                                    w-[50px]
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black
                                    text-white
                                    transition-all
                                    duration-300
                                    sm:h-[53px]
                                    sm:w-[53px]
                                    md:right-[6px]
                                    md:h-[55px]
                                    md:w-[55px]
                                    ${
                                      active
                                        ? "bg-white text-black"
                                        : "group-hover:bg-white group-hover:text-black"
                                    }
                                  `}
                                >
                                  <ArrowRight
                                    size={20}
                                    strokeWidth={2.5}
                                  />
                                </span>

                              </Link>

                            </li>
                          );
                        }
                      )}

                  </ul>
                )}

              </div>

              {/* =================================================
                  CONTACT WIDGET
              ================================================= */}

              <div
                className="
                  relative
                  mb-[40px]
                  overflow-hidden
                  rounded-[30px]
                  bg-black
                  sm:rounded-[40px]
                  md:rounded-[45px]
                "
              >

                <div
                  className="
                    relative
                    px-[25px]
                    pb-[40px]
                    pt-[30px]
                    sm:px-[30px]
                    sm:pb-[45px]
                    sm:pt-[35px]
                    md:px-[40px]
                    md:pb-[50px]
                  "
                  style={{
                    backgroundImage: `url(${ratingShadow})`,
                    backgroundPosition:
                      "center top",
                    backgroundRepeat:
                      "no-repeat",
                    backgroundSize:
                      "100% auto",
                  }}
                >

                  {/* LOGO */}

                  <div
                    className="
                      relative
                      mt-[20px]
                      flex
                      justify-center
                      sm:mt-[30px]
                      md:mt-[40px]
                    "
                  >

                    <img
                      src={logoSidebar}
                      alt="School Logo"
                      className="
                        max-h-[75px]
                        w-auto
                        object-contain
                        sm:max-h-[85px]
                        md:max-h-[90px]
                      "
                    />

                  </div>

                  {/* PHONE */}

                  <h4
                    className="
                      relative
                      mt-[20px]
                      text-center
                      font-['Figtree',sans-serif]
                      text-[15px]
                      font-normal
                      leading-[28px]
                      text-white
                      sm:mt-[25px]
                      sm:text-[16px]
                      sm:leading-[30px]
                      md:mt-[30px]
                      md:leading-[40px]
                    "
                  >

                    Any Questions? Let’s talk

                    <a
                      href="tel:+919655407774"
                      className="
                        block
                        font-['Figtree',sans-serif]
                        text-[21px]
                        font-bold
                        leading-[32px]
                        text-white
                        transition-colors
                        duration-300
                        hover:text-[#e71b93]
                        sm:text-[25px]
                        sm:leading-[35px]
                        md:text-[29px]
                        md:leading-[40px]
                      "
                    >
                      (+91) 9655407774
                    </a>

                  </h4>

                  {/* BUTTON */}

                  <div
                    className="
                      relative
                      mt-[25px]
                      flex
                      justify-center
                      sm:mt-[30px]
                      md:mt-[35px]
                    "
                  >

                    <Link
                      to="/contact"
                      className="
                        group
                        relative
                        inline-flex
                        items-center
                        overflow-hidden
                        rounded-full
                        bg-[#e71b93]
                        py-[7px]
                        pl-[22px]
                        pr-[7px]
                        font-['Figtree',sans-serif]
                        text-[13px]
                        font-bold
                        uppercase
                        text-white
                        transition-all
                        duration-300
                        hover:bg-white
                        hover:text-black
                        sm:py-[8px]
                        sm:pl-[25px]
                        sm:pr-[8px]
                        sm:text-[14px]
                        md:pl-[30px]
                      "
                    >

                      <span className="relative z-[2]">
                        Get a Call Back
                      </span>

                      <span
                        className="
                          relative
                          z-[2]
                          ml-[12px]
                          flex
                          h-[45px]
                          w-[45px]
                          items-center
                          justify-center
                          rounded-full
                          bg-black
                          transition-all
                          duration-300
                          group-hover:bg-[#e71b93]
                          sm:ml-[15px]
                          sm:h-[48px]
                          sm:w-[48px]
                          md:h-[50px]
                          md:w-[50px]
                        "
                      >
                        <ArrowRight
                          size={19}
                          className="text-white"
                        />
                      </span>

                    </Link>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Facilities;
