import { API_URL, getImageUrl } from "../../../config/api";
import React, { useEffect, useState } from "react";

import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
} from "react-icons/fi";

import sublogo from "../../../assets/sub-logo1.png";
import serviceBg from "../../../assets/management/service-bg1.png";






const Management = () => {

  const [management, setManagement] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // IMAGE URL
  // =====================================================

  


  // =====================================================
  // GET MANAGEMENT
  // =====================================================

  useEffect(() => {

    const fetchManagement = async () => {

      try {

        const response = await fetch(
          `${API_URL}/management?_=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log(
          "MANAGEMENT API RESPONSE:",
          data
        );

        if (data.success) {
          setManagement(data.management || []);
        } else {
          setManagement([]);
        }

      } catch (error) {

        console.error(
          "MANAGEMENT API ERROR:",
          error
        );

        setManagement([]);

      } finally {

        setLoading(false);

      }

    };


    fetchManagement();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return null;
  }


  // =====================================================
  // NO DATA
  // =====================================================

  if (!management.length) {
    return null;
  }


  return (
    <section
      className="
        relative
        z-[1]
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
        py-[100px]
      "
      style={{
        backgroundImage: `url(${serviceBg})`,
      }}
    >

      <div className="mx-auto w-full max-w-[1140px] px-4">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-[60px] grid grid-cols-1 items-center">

          <div className="mx-auto w-full md:w-2/3">

            <div className="text-center">


              {/* Small Heading */}

              <h5
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-3
                  rounded-lg
                  bg-[#f6ac27]/10
                  px-2
                  py-2
                  font-['Figtree',sans-serif]
                  text-lg
                  font-semibold
                  uppercase
                  leading-[18px]
                  tracking-[-0.18px]
                  text-[#f6ac27]
                "
              >

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f6ac27]
                  "
                >

                  <img
                    src={sublogo}
                    alt=""
                    className="object-contain brightness-0 invert"
                  />

                </span>

                Our Management

              </h5>


              {/* Main Heading */}

              <h2
                className="
                  font-['Figtree',sans-serif]
                  text-[32px]
                  font-semibold
                  leading-[40px]
                  tracking-[-0.54px]
                  text-[#050734]
                  md:text-[44px]
                  md:leading-[48px]
                "
              >
                Dedicated School Management
              </h2>

            </div>

          </div>

        </div>


        {/* =====================================================
            MANAGEMENT MEMBERS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:mx-auto
            lg:max-w-[850px]
          "
        >

          {management.map((person) => (

            <div
              key={person.id}
              className="
                group
                relative
                z-[1]
                overflow-hidden
                pb-[30px]
                transition-all
                duration-500
              "
            >


              {/* =================================================
                  IMAGE
              ================================================= */}

              <div
                className="
                  image-anime
                  relative
                  z-[1]
                  overflow-hidden
                  rounded-[16px]
                "
              >

                <img
                  src={getImageUrl(person.image)}
                  alt={person.name}
                  className="
                    h-full
                    w-full
                    rounded-[16px]
                    object-cover
                    transition-all
                    duration-500
                    ease-in-out
                    group-hover:scale-110
                    group-hover:-rotate-[4deg]
                  "
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />


                {/* Image shine effect */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    z-[1]
                    h-0
                    w-[200%]
                    -translate-x-1/2
                    -translate-y-1/2
                    rotate-[-45deg]
                    bg-white/30
                    transition-all
                    duration-[600ms]
                    ease-linear
                    group-hover:h-[250%]
                    group-hover:bg-transparent
                  "
                />

              </div>


              {/* =================================================
                  CONTENT AREA
              ================================================= */}

              <div
                className="
                  relative
                  z-[2]
                  -mt-[55px]
                  mx-6
                  flex
                  items-center
                  justify-between
                  rounded-[16px]
                  bg-white
                  px-6
                  py-7
                  shadow-[0_0_40px_rgba(0,0,0,0.09)]
                "
              >

                <div className="pr-3">

                  <div
                    className="
                      inline-block
                      font-['Figtree',sans-serif]
                      text-[18px]
                      font-semibold
                      leading-[22px]
                      text-[#050734]
                      transition-all
                      duration-400
                      group-hover:text-[#2E0797]
                      md:text-[20px]
                      md:leading-[20px]
                    "
                  >
                    {person.name}
                  </div>


                  <div className="h-2" />


                  <p
                    className="
                      font-['Figtree',sans-serif]
                      text-[16px]
                      font-normal
                      leading-[16px]
                      text-[#37385C]
                    "
                  >
                    {person.role}
                  </p>

                </div>

              </div>


              {/* =================================================
                  SOCIAL ICONS
              ================================================= */}

              <ul
                className="
                  absolute
                  bottom-[151px]
                  right-[-100px]
                  z-[3]
                  flex
                  flex-col
                  gap-0
                  transition-all
                  duration-500
                  ease-in-out
                  group-hover:right-[50px]
                "
              >


                {/* Facebook */}

                {person.facebook && (
                  <li>

                    <a
                      href={person.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="
                        mt-3
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EFF1FF]
                        text-[#050734]
                        transition-all
                        duration-300
                        hover:bg-[#2E0797]
                        hover:text-white
                      "
                    >
                      <FiFacebook size={20} />
                    </a>

                  </li>
                )}


                {/* Instagram */}

                {person.instagram && (
                  <li>

                    <a
                      href={person.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="
                        mt-3
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EFF1FF]
                        text-[#050734]
                        transition-all
                        duration-300
                        hover:bg-[#2E0797]
                        hover:text-white
                      "
                    >
                      <FiInstagram size={20} />
                    </a>

                  </li>
                )}


                {/* YouTube */}

                {person.youtube && (
                  <li>

                    <a
                      href={person.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="
                        mt-3
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EFF1FF]
                        text-[#050734]
                        transition-all
                        duration-300
                        hover:bg-[#2E0797]
                        hover:text-white
                      "
                    >
                      <FiYoutube size={20} />
                    </a>

                  </li>
                )}


                {/* LinkedIn */}

                {person.linkedin && (
                  <li>

                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="
                        mt-3
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EFF1FF]
                        text-[#050734]
                        transition-all
                        duration-300
                        hover:bg-[#2E0797]
                        hover:text-white
                      "
                    >
                      <FiLinkedin size={20} />
                    </a>

                  </li>
                )}

              </ul>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Management;