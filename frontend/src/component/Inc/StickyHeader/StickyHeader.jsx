import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import useHeaderData from "../../../hooks/useHeaderData";

import "./StickyHeader.css";

const StickyHeader = () => {
  const [isSticky, setIsSticky] =
    useState(false);

  const {
    settings,
    menuItems,
  } = useHeaderData();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  if (!isSticky) return null;

  const applyText =
    settings?.apply_text ||
    "Apply Now";

  const applyUrl =
    settings?.apply_url ||
    "/contact";

  return (
    <header className="fixed left-0 top-0 z-[2222] w-full animate-[fadeInDown_0.7s_ease-in-out] py-[6px]">

      <div className="mx-auto w-full max-w-[1320px] px-4">

        {/* HEADER BOX */}

        <div
          className="
            flex
            w-full
            items-center
            rounded-2xl
            border
            border-white/10
            bg-gradient-to-r
            from-[#2E0797]
            to-[#2d3381]
            px-5
            py-4
            backdrop-blur-[1px]
            lg:px-7
          "
        >

          {/* =========================
              LEFT SIDE MENU
          ========================= */}

          <nav className="flex-1 sticky__nav">

            <ul
              className="
                flex
                items-center
                justify-start
                gap-4
                xl:gap-10
              "
            >

              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="shrink-0"
                >

                  <a
                    href={item.href}
                    className="
                      group
                      relative
                      inline-block
                      whitespace-nowrap
                      font-figtree
                      text-[14px]
                      font-medium
                      text-white
                      transition-all
                      duration-300
                      hover:text-[#e71b93]
                      xl:text-[20px]
                    "
                  >

                    {item.name}

                    {/* Hover underline */}

                    <span
                      className="
                        absolute
                        -bottom-1
                        left-0
                        h-[2px]
                        w-0
                        bg-[#e71b93]
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />

                  </a>

                </li>
              ))}

            </ul>

          </nav>

          {/* =========================
              RIGHT SIDE APPLY BUTTON
          ========================= */}

          <div className="sticky_applynow ml-5 hidden shrink-0 lg:block">

            <a
              href={applyUrl}
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-white
                px-5
                py-3
                font-figtree
                text-[20px]
                font-semibold
                text-[#2E0797]
                transition-all
                duration-300
                hover:bg-[#e71b93]
                hover:text-white
              "
            >

              <span>
                {applyText}
              </span>

              <ArrowRight
                size={17}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </a>

          </div>

        </div>

      </div>

    </header>
  );
};

export default StickyHeader;