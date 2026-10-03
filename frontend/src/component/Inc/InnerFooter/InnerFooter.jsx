import { API_URL, SERVER_URL } from "../../../config/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";

// import FooterBg from "../../../assets/innerfooter/footer_bg.jpg";






const InnerFooter = () => {

  const [settings, setSettings] = useState(null);
  const [quickLinks, setQuickLinks] = useState([]);

  const [loading, setLoading] = useState(true);


  /* =====================================================
     LOAD FOOTER
  ====================================================== */

  useEffect(() => {

    const loadFooter = async () => {

      try {

        const response = await fetch(
          `${API_URL}/inner-footer`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (data.success) {

          setSettings(data.settings);

          const links =
            (data.quickLinks || [])
              .filter(
                (item) =>
                  Number(item.status) === 1
              )
              .sort(
                (a, b) =>
                  Number(a.sort_order) -
                  Number(b.sort_order)
              );

          setQuickLinks(links);
        }

      } catch (error) {

        console.error(
          "Failed to load inner footer:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


    loadFooter();

  }, []);


  /* =====================================================
     LOADING
  ====================================================== */

  if (loading || !settings) {
    return null;
  }


  /* =====================================================
     BACKGROUND IMAGE
  ====================================================== */

  const backgroundImage =
    settings.background_image
      ? `${SERVER_URL}${settings.background_image}`
      : FooterBg;


  return (

    <footer
      className="
        relative
        mt-[60px]
        w-full
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
        text-white

        sm:mt-[80px]
        lg:mt-[100px]
      "
      style={{
        backgroundImage:
          `url(${backgroundImage})`,
      }}
    >

      {/* =================================================
          OVERLAY
      ================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          bg-[#191e24]/95
        "
      />


      {/* =================================================
          FOOTER INNER
      ================================================== */}

      <div
        className="
          relative
          z-[1]
          w-full
          px-4
          pb-6
          pt-12

          sm:px-6
          sm:pb-7
          sm:pt-16

          md:px-8

          lg:px-10
          lg:pt-[75px]
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-[1140px]
          "
        >


          {/* =================================================
              TOP CONTENT
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-10

              sm:gap-12

              md:grid-cols-2
              md:gap-14

              lg:grid-cols-3
              lg:gap-10
            "
          >


            {/* =================================================
                COLUMN 1
            ================================================= */}

            <div className="w-full">


              {/* LOGO */}

              <Link
                to="/"
                className="
                  inline-block
                  max-w-[280px]
                  no-underline
                "
              >

                {settings.logo ? (

                  <img
                    src={`${SERVER_URL}${settings.logo}`}
                    alt="School Logo"
                    className="
                      block
                      h-auto
                      w-full
                      max-w-[280px]
                      object-contain
                    "
                  />

                ) : null}

              </Link>


              {/* DESCRIPTION */}

              <p
                className="
                  mt-5
                  max-w-[430px]
                  font-['Figtree',sans-serif]
                  text-[15px]
                  font-normal
                  leading-[26px]
                  text-white

                  sm:mt-[22px]
                  sm:text-[16px]
                  sm:leading-[28px]
                "
              >
                {settings.description}
              </p>


              {/* =================================================
                  SOCIAL ICONS
              ================================================== */}

              <ul
                className="
                  m-0
                  mt-6
                  flex
                  list-none
                  flex-wrap
                  gap-2.5
                  p-0
                "
              >


                {/* FACEBOOK */}

                {settings.facebook_url && (

                  <li>

                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white
                        text-white
                        transition-all
                        duration-300
                        hover:border-[#ff7f46]
                        hover:bg-[#ff7f46]
                        hover:rotate-[25deg]
                      "
                    >

                      <FiFacebook
                        className="text-[15px]"
                      />

                    </a>

                  </li>

                )}


                {/* INSTAGRAM */}

                {settings.instagram_url && (

                  <li>

                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white
                        text-white
                        transition-all
                        duration-300
                        hover:border-[#ff7f46]
                        hover:bg-[#ff7f46]
                        hover:rotate-[25deg]
                      "
                    >

                      <FiInstagram
                        className="text-[15px]"
                      />

                    </a>

                  </li>

                )}


                {/* YOUTUBE */}

                {settings.youtube_url && (

                  <li>

                    <a
                      href={settings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white
                        text-white
                        transition-all
                        duration-300
                        hover:border-[#ff7f46]
                        hover:bg-[#ff7f46]
                        hover:rotate-[25deg]
                      "
                    >

                      <FiYoutube
                        className="text-[15px]"
                      />

                    </a>

                  </li>

                )}

              </ul>

            </div>


            {/* =================================================
                COLUMN 2 - QUICK LINKS
            ================================================== */}

            <div
              className="
                w-full

                md:pl-4

                lg:pl-8
              "
            >

              <h3
                className="
                  mb-7
                  font-['Figtree',sans-serif]
                  text-[20px]
                  font-bold
                  capitalize
                  leading-[28px]
                  text-white

                  sm:mb-10
                  sm:text-[22px]
                "
              >
                Quick Links
              </h3>


              <ul
                className="
                  m-0
                  list-none
                  space-y-2.5
                  p-0
                "
              >

                {quickLinks.map((item) => (

                  <li key={item.id}>

                    <Link
                      to={item.href}
                      className="
                        group
                        relative
                        inline-block
                        pl-[15px]
                        font-['Figtree',sans-serif]
                        text-[15px]
                        font-normal
                        leading-[24px]
                        text-white
                        no-underline
                        transition-all
                        duration-300

                        sm:text-[16px]

                        hover:pl-5
                        hover:text-[#ff7f46]

                        before:absolute
                        before:left-0
                        before:top-[11px]
                        before:h-px
                        before:w-2
                        before:bg-white
                        before:transition-all
                        before:duration-300

                        group-hover:before:bg-[#ff7f46]
                      "
                    >
                      {item.name}
                    </Link>

                  </li>

                ))}

              </ul>

            </div>


            {/* =================================================
                COLUMN 3 - CONTACT
            ================================================== */}

            <div
              className="
                w-full

                md:col-span-2

                lg:col-span-1
                lg:col-auto
              "
            >

              <h3
                className="
                  mb-7
                  font-['Figtree',sans-serif]
                  text-[20px]
                  font-bold
                  capitalize
                  leading-[28px]
                  text-white

                  sm:mb-10
                  sm:text-[22px]
                "
              >
                Our Contacts
              </h3>


              <div
                className="
                  space-y-3
                  font-['Figtree',sans-serif]
                "
              >


                {/* ADDRESS */}

                <p
                  className="
                    m-0
                    text-[15px]
                    font-normal
                    leading-[26px]
                    text-white

                    sm:text-[16px]
                    sm:leading-[28px]
                  "
                >

                  <span className="font-medium">
                    Address:
                  </span>{" "}

                  {settings.address}

                </p>


                {/* PHONE */}

                <p
                  className="
                    m-0
                    text-[15px]
                    font-normal
                    leading-[26px]
                    text-white

                    sm:text-[16px]
                    sm:leading-[28px]
                  "
                >

                  <span className="font-medium">
                    Phone:
                  </span>{" "}

                  <a
                    href={`tel:${settings.phone}`}
                    className="
                      text-white
                      no-underline
                      transition-colors
                      duration-300
                      hover:text-[#ff7f46]
                    "
                  >
                    {settings.phone}
                  </a>

                </p>


                {/* EMAIL */}

                <p
                  className="
                    m-0
                    break-words
                    text-[15px]
                    font-normal
                    leading-[26px]
                    text-white

                    sm:text-[16px]
                    sm:leading-[28px]
                  "
                >

                  <span className="font-medium">
                    Email:
                  </span>{" "}

                  <a
                    href={`mailto:${settings.email}`}
                    className="
                      text-white
                      no-underline
                      transition-colors
                      duration-300
                      hover:text-[#ff7f46]
                    "
                  >
                    {settings.email}
                  </a>

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              DIVIDER
          ================================================== */}

          <div
            className="
              my-8
              h-px
              w-full
              bg-white/15

              sm:my-10
            "
          />


          {/* =================================================
              COPYRIGHT
          ================================================== */}

          <div className="w-full text-center">

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
                font-['Figtree',sans-serif]
                text-[13px]
                font-normal
                leading-[24px]
                text-white

                sm:text-[14px]

                md:text-[15px]
              "
            >

              <span>
                © {settings.copyright_year}
              </span>

              <span>||</span>

              <a
                href={
                  settings.privacy_url || "#"
                }
                className="
                  text-white
                  no-underline
                  transition-colors
                  duration-300
                  hover:text-[#ff7f46]
                "
              >
                {settings.privacy_text}
              </a>

              <span>||</span>

              <span>

                Powered By{" "}

                <a
                  href={
                    settings.powered_by_url ||
                    "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-medium
                    text-white
                    no-underline
                    transition-colors
                    duration-300
                    hover:text-[#ff7f46]
                  "
                >
                  {settings.powered_by_text}
                </a>

              </span>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default InnerFooter;