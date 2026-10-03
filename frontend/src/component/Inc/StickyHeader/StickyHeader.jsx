import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import useHeaderData from "../../../hooks/useHeaderData";

import "./StickyHeader.css";

const StickyHeader = () => {
  const [isSticky, setIsSticky] = useState(false);

  const {
    settings,
    menuItems,
  } = useHeaderData();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isSticky) return null;

  const applyText =
    settings?.apply_text || "Apply Now";

  const applyUrl =
    settings?.apply_url || "/contact";

  return (
    <header className="sticky-header">

      <div className="sticky-header-container">

        <div className="sticky-header-box">

          {/* =========================
              MENU
          ========================= */}

          <nav className="sticky__nav">

            <ul className="sticky-menu">

              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="sticky-menu-item"
                >
                  <a
                    href={item.href}
                    className="sticky-menu-link"
                  >
                    {item.name}

                    <span className="sticky-menu-underline" />
                  </a>
                </li>
              ))}

            </ul>

          </nav>


          {/* =========================
              APPLY BUTTON
          ========================= */}

          <div className="sticky_applynow">

            <a
              href={applyUrl}
              className="sticky-apply-btn"
            >
              <span>{applyText}</span>

              <ArrowRight
                size={17}
                strokeWidth={2}
              />
            </a>

          </div>

        </div>

      </div>

    </header>
  );
};

export default StickyHeader;