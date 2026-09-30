import React, { useEffect, useState } from "react";

import { getAbout } from "../../../services/aboutService";


import DefaultSubLogo from "../../../assets/sub-logo1.png";

const API_ROOT =
  import.meta.env.VITE_API_URL || "";

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_ROOT}${image}`;
  }

  return `${API_ROOT}/${image}`;
};


const AboutInner = () => {

  const [about, setAbout] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadAbout = async () => {
      try {

        const response = await getAbout();

        if (response.success) {
          setAbout(response.data);
        }

      } catch (error) {

        console.error("ABOUT LOAD ERROR:", error);

      } finally {

        setLoading(false);

      }
    };

    loadAbout();

  }, []);


  if (loading) {
    return null;
  }


  const aboutBg =
    about?.about_bg
      ? getImageUrl(about.about_bg)
      : DefaultAboutBg;

  const elementsImage =
    about?.elements_image
      ? getImageUrl(about.elements_image)
      : DefaultElements41;

  const aboutImage =
    about?.main_image
      ? getImageUrl(about.main_image)
      : DefaultAboutImage;

  const subLogo =
    about?.sub_logo
      ? getImageUrl(about.sub_logo)
      : DefaultSubLogo;


  return (
    <section className="relative z-[1] overflow-hidden bg-white py-[70px] sm:py-[80px] md:py-[100px] lg:py-[120px]">

      {/* Background */}
      <img
        src={aboutBg}
        alt=""
        className="
          pointer-events-none
          absolute
          left-0
          top-5
          z-[-2]
          hidden
          max-w-full
          md:block
          lg:left-[100px]
        "
      />

      <img
        src={elementsImage}
        alt=""
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          z-[-1]
          hidden
          md:block
        "
      />

      <div className="mx-auto w-full max-w-[1140px] px-4 sm:px-5 lg:px-6">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.1fr_0.9fr] lg:gap-0">

          {/* LEFT IMAGE */}

          <div className="w-full">

            <div
              className="
                relative
                z-[1]
                mx-auto
                w-full
                max-w-[500px]
                lg:mx-0
              "
            >

              {/* BLUE BACKGROUND SHAPE */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 288 288"
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  z-[-1]
                  h-[600px]
                  w-[600px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rotate-45
                  sm:h-[650px]
                  sm:w-[650px]
                  md:h-[700px]
                  md:w-[700px]
                  lg:h-[780px]
                  lg:w-[780px]
                "
              >

                <defs>

                  <linearGradient
                    id="imagewave"
                    x1="70.711%"
                    x2="0%"
                    y1="70.711%"
                    y2="0%"
                  >

                    <stop
                      offset="0%"
                      stopColor="#49A6FF"
                      stopOpacity="1"
                    />

                    <stop
                      offset="100%"
                      stopColor="#3B32F6"
                      stopOpacity="1"
                    />

                  </linearGradient>

                </defs>

                <path
                  fill="url(#imagewave)"
                  d="
                    M37.5,186
                    c-12.1-10.5-11.8-32.3-7.2-46.7
                    c4.8-15,13.1-17.8,30.1-36.7
                    C91,68.8,83.5,56.7,103.4,45
                    c22.2-13.1,51.1-9.5,69.6-1.6
                    c18.1,7.8,15.7,15.3,43.3,33.2
                    c28.8,18.8,37.2,14.3,46.7,27.9
                    c15.6,22.3,6.4,53.3,4.4,60.2
                    c-3.3,11.2-7.1,23.9-18.5,32
                    c-16.3,11.5-29.5,0.7-48.6,11
                    c-16.2,8.7-12.6,19.7-28.2,33.2
                    c-22.7,19.7-63.8,25.7-79.9,9.7
                    c-15.2-15.1,0.3-41.7-16.6-54.9
                    C63,186,49.7,196.7,37.5,186z
                  "
                >

                  <animate
                    repeatCount="indefinite"
                    attributeName="d"
                    dur="10s"
                    values="
                      M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z;

                      M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8C48.9,198.6,57.8,191,51,171.3z;

                      M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z
                    "
                  />

                </path>

              </svg>


              {/* MAIN IMAGE */}

              <div
                className="
                  relative
                  z-[2]
                  mx-auto
                  w-full
                  max-w-[500px]
                  overflow-hidden
                  rounded-[4px]
                "
              >

                <img
                  src={aboutImage}
                  alt={about?.heading || "About School"}
                  className="
                    block
                    aspect-square
                    w-full
                    object-cover
                  "
                />

              </div>

            </div>

          </div>


          {/* SPACER */}

          <div className="hidden lg:block" />


          {/* RIGHT CONTENT */}

          <div className="w-full">

            <div className="text-center lg:text-left">

              {/* ABOUT SCHOOL */}

              <h5
                className="
                  inline-flex
                  items-center
                  rounded-lg
                  bg-[#F5F5F5]
                  px-2
                  py-2
                  font-['Figtree',sans-serif]
                  text-[16px]
                  font-semibold
                  uppercase
                  leading-[18px]
                  tracking-[-0.18px]
                  text-[#F5A623]
                  sm:text-[18px]
                "
              >

                <span
                  className="
                    mr-2
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F5A623]
                    sm:h-14
                    sm:w-14
                  "
                >

                  <img
                    src={subLogo}
                    alt=""
                    className="
                      h-7
                      w-7
                      object-contain
                      brightness-0
                      invert
                      sm:h-8
                      sm:w-8
                    "
                  />

                </span>

                {about?.badge_title || "About School"}

              </h5>


              {/* HEADING */}

              <h2
                className="
                  mt-6
                  font-['Figtree',sans-serif]
                  text-[30px]
                  font-semibold
                  leading-[38px]
                  tracking-[-0.5px]
                  text-[#050734]
                  sm:text-[34px]
                  sm:leading-[42px]
                  md:text-[40px]
                  md:leading-[46px]
                  lg:text-[44px]
                  lg:leading-[48px]
                "
              >
                {about?.heading}
              </h2>


              {/* PARAGRAPH */}

              <p
                data-aos="fade-left"
                data-aos-duration="800"
                className="
                  mt-5
                  font-['Figtree',sans-serif]
                  text-[16px]
                  font-normal
                  leading-[28px]
                  text-[#555]
                  sm:text-[17px]
                  sm:leading-[29px]
                "
              >
                {about?.description}
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AboutInner;