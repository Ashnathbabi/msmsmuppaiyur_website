import React from "react";
import { ArrowRight } from "lucide-react";
import './ShortContent.css'
import heroBg2 from "../../../assets/shortcontent/hero-bg2.png";
import elements7 from "../../../assets/shortcontent/elements7.png";
import ctaFooter from "../../../assets/shortcontent/cta-footer.png";
import check5 from "../../../assets/shortcontent/check5.png";

const ShortContent = () => {
  const features = [
    "Trust and Simplicity",
    "Truthfulness and Honesty",
    "Courage and Confidence.",
  ];

  return (
    <section
      className="shortContent_wrap
        relative
        z-[1]
        w-full
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage: `url(${heroBg2})`,
      }}
    >
      <div className="desktop:max-w-[1320px] mx-auto w-full">
        <div className="grid min-h-[475px] grid-cols-1 items-center lg:grid-cols-12">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}
          <div className="relative z-10 lg:col-span-5">
            <div className="max-w-[560px]">

              {/* HEADING */}
              <h2
                className="
                  font-figtree
                  text-[34px]
                  font-semibold
                  leading-[40px]
                  tracking-[-0.54px]
                  text-white
                  sm:text-[40px]
                  sm:leading-[44px]
                  lg:text-[44px]
                  lg:leading-[48px]
                "
              >
                The Perfect Place to Ignite
                <br />
                Your Passion
              </h2>

              {/* SPACE 16 */}
              <div className="h-10" />

              {/* DESCRIPTION */}
              <p
                className="
                  max-w-[540px]
                  font-figtree
                  text-[16px]
                  font-medium
                  leading-[26px]
                  tracking-[-0.18px]
                  text-white
                  sm:text-[18px]
                "
              >
                Whether it's academics, sports, or creative pursuits, this is
                the perfect place to ignite your passion and watch it soar.
              </p>

              {/* SPACE 24 */}
              <div className="h-10" />

              {/* BUTTON */}
              <a
                href="#"
                className="
                  group
                  relative
                  z-[1]
                  inline-flex
                  items-center
                  gap-1
                  overflow-hidden
                  rounded-lg
                  bg-white
                  px-6
                  py-[18px]
                  font-figtree
                  text-[20px]
                  font-bold
                  leading-[20px]
                  text-[#2E0797]
                  transition-all
                  duration-500
                  hover:text-white
                "
              >
                {/* Hover background */}
                <span
                  className="
                    absolute
                    left-1/2
                    top-0
                    -z-[1]
                    h-full
                    w-[10px]
                    -translate-x-1/2
                    rounded-lg
                    bg-[#df5ba6]
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:left-0
                    group-hover:w-full
                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                />

                <span className="relative z-[2]">
                  Get Started Now
                </span>

                <ArrowRight
                  size={21}
                  className="
                    relative
                    z-[2]
                    ml-1
                    -rotate-45
                    transition-all
                    duration-500
                    group-hover:rotate-0
                  "
                />
              </a>
            </div>
          </div>

          {/* =====================================================
              EMPTY CENTER COLUMN
          ===================================================== */}
          <div className="hidden lg:col-span-2 lg:block" />

          {/* =====================================================
              RIGHT IMAGE AREA
          ===================================================== */}
          <div className="relative hidden h-[475px] lg:col-span-5 lg:block">

            {/* =================================================
                DECORATIVE ELEMENT
            ================================================= */}
            <img
              src={elements7}
              alt=""
              className="
                absolute
                bottom-[-30px]
                left-[105px]
                z-0
                w-[350px]
                opacity-80
                animate-[rotate360_10s_linear_infinite]
              "
            />

            {/* =================================================
                MAIN STUDENT IMAGE
            ================================================= */}
            <div
              className="
                absolute
                bottom-[-1px]
                right-[78px]
                z-[2]
                w-[350px]
              "
            >
              <img
                src={ctaFooter}
                alt="Student"
                className="
                  block
                  h-auto
                  w-full
                  object-cover
                "
              />
            </div>

            {/* =================================================
                FEATURE LIST
            ================================================= */}
            <ul
              className="aniamtion-key-1
                absolute
                left-[0px]
                top-[177px]
                z-[5]
              "
            >
              {/* ITEM 1 */}
              <li className="mb-6">
                <a
                  href="#"
                  className="
                    flex
                    w-max
                    items-center
                    rounded-lg
                    bg-white
                    px-6
                    py-6
                    font-figtree
                    text-[16px]
                    font-semibold
                    leading-[16px]
                    text-[#050734]
                    shadow-[0_5px_20px_rgba(0,0,0,0.08)]
                  "
                >
                  <img
                    src={check5}
                    alt=""
                    className="mr-1 h-auto w-auto"
                  />

                  Trust and Simplicity
                </a>
              </li>

              {/* ITEM 2 */}
              <li className="mb-6 ml-[-40px]">
                <a
                  href="#"
                  className="
                    flex
                    w-max
                    items-center
                    rounded-lg
                    bg-white
                    px-6
                    py-6
                    font-figtree
                    text-[16px]
                    font-semibold
                    leading-[16px]
                    text-[#050734]
                    shadow-[0_5px_20px_rgba(0,0,0,0.08)]
                  "
                >
                  <img
                    src={check5}
                    alt=""
                    className="mr-1 h-auto w-auto"
                  />

                  Truthfulness and Honesty
                </a>
              </li>

              {/* ITEM 3 */}
              <li>
                <a
                  href="#"
                  className="
                    flex
                    w-max
                    items-center
                    rounded-lg
                    bg-white
                    px-6
                    py-6
                    font-figtree
                    text-[16px]
                    font-semibold
                    leading-[16px]
                    text-[#050734]
                    shadow-[0_5px_20px_rgba(0,0,0,0.08)]
                  "
                >
                  <img
                    src={check5}
                    alt=""
                    className="mr-1 h-auto w-auto"
                  />

                  Courage and Confidence.
                </a>
              </li>
            </ul>

          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE CONTENT
      ===================================================== */}
      <div className="px-5 pb-12 lg:hidden">
        <div className="relative mx-auto mt-8 max-w-[360px]">

          <img
            src={elements7}
            alt=""
            className="
              absolute
              left-1/2
              top-0
              z-0
              w-[280px]
              -translate-x-1/2
            "
          />

          <img
            src={ctaFooter}
            alt="Student"
            className="
              relative
              z-[2]
              mx-auto
              w-[280px]
            "
          />

          <ul className="relative z-[5] -mt-10 space-y-3">
            {features.map((feature, index) => (
              <li
                key={feature}
                className={index === 1 ? "ml-[-20px]" : ""}
              >
                <a
                  href="#"
                  className="
                    flex
                    w-max
                    max-w-full
                    items-center
                    rounded-lg
                    bg-white
                    px-3
                    py-3
                    font-figtree
                    text-sm
                    font-semibold
                    text-[#050734]
                    shadow-lg
                  "
                >
                  <img
                    src={check5}
                    alt=""
                    className="mr-1 h-auto w-auto"
                  />

                  {feature}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShortContent;