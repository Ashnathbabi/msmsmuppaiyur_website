import { API_URL, SERVER_URL } from "../../../config/api";
import { useEffect, useRef, useState } from "react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
  Navigation,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";





function HeroBanner() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // FETCH HERO SLIDES
  // ==========================================================

  useEffect(() => {
    fetch(`${API_URL}/hero/active`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch hero slides"
          );
        }

        return response.json();
      })
      .then((result) => {
        if (result.success) {
          setSlides(result.data || []);
        }
      })
      .catch((error) => {
        console.error(
          "Hero banner error:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main>
        <section
          className="
            relative
            h-screen
            min-h-[650px]
            overflow-hidden
            bg-gray-900
          "
        >
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-white
            "
          >
            Loading...
          </div>
        </section>
      </main>
    );
  }

  // ==========================================================
  // NO SLIDES
  // ==========================================================

  if (!slides.length) {
    return null;
  }

  return (
    <main>
      <section
        className="
          relative
          h-screen
          min-h-[650px]
          overflow-hidden
        "
      >
        {/* ==================================================
            SWIPER
        ================================================== */}

        <Swiper
          modules={[
            Autoplay,
            Pagination,
            Navigation,
          ]}
          loop={slides.length > 1}
          speed={1500}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl =
              prevRef.current;

            swiper.params.navigation.nextEl =
              nextRef.current;
          }}
          className="heroSwiper h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide
              key={slide.id}
            >
              {({ isActive }) => (
                <div
                  className="
                    relative
                    h-full
                    w-full
                    overflow-hidden
                  "
                >
                  {/* ========================================
                      BACKGROUND IMAGE
                  ======================================== */}

                  <div
                    className={`
                      absolute
                      inset-0
                      h-full
                      w-full
                      transform
                      transition-transform
                      duration-[6000ms]
                      ease-out

                      ${
                        isActive
                          ? "scale-110"
                          : "scale-100"
                      }
                    `}
                  >
                    {slide.image ? (
                      <img
                        src={`${SERVER_URL}${slide.image}`}
                        alt={
                          slide.title ||
                          "Hero Banner"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          h-full
                          w-full
                          bg-gray-800
                        "
                      />
                    )}
                  </div>

                  {/* ========================================
                      OVERLAY
                  ======================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      z-10
                      bg-black/20
                    "
                  />

                  {/* ========================================
                      CONTENT
                  ======================================== */}

                  <div
                    className="
                      relative
                      z-20
                      mx-auto
                      flex
                      h-full
                      max-w-[1320px]
                      items-center
                      px-6
                      lg:px-16
                    "
                  >
                    <div
                      className={`
                        max-w-3xl
                        transition-all
                        duration-1000
                        ease-out

                        ${
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-16 opacity-0"
                        }
                      `}
                    >
                      {/* TITLE */}

                      <h1
                        className="
                          text-4xl
                          font-black
                          leading-[1.05]
                          tracking-tight
                          text-white
                          drop-shadow-lg

                          sm:text-6xl
                          lg:text-7xl
                        "
                      >
                        {slide.title}
                      </h1>

                      {/* DESCRIPTION */}

                      {slide.description && (
                        <p
                          className="
                            mt-6
                            max-w-xl
                            text-base
                            leading-7
                            text-white
                            drop-shadow-md
                            sm:text-lg
                          "
                        >
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ==================================================
            PREVIOUS BUTTON
        ================================================== */}

        {slides.length > 1 && (
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous slide"
            className="
              absolute
              left-5
              top-1/2
              z-50
              flex
              h-12
              w-12
              -translate-y-1/2
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-black/30
              text-2xl
              text-white
              shadow-lg
              backdrop-blur-md
              transition-all
              duration-300
              hover:scale-110
              hover:bg-black/60
              active:scale-95
            "
          >
            &#10094;
          </button>
        )}

        {/* ==================================================
            NEXT BUTTON
        ================================================== */}

        {slides.length > 1 && (
          <button
            ref={nextRef}
            type="button"
            aria-label="Next slide"
            className="
              absolute
              right-5
              top-1/2
              z-50
              flex
              h-12
              w-12
              -translate-y-1/2
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-black/30
              text-2xl
              text-white
              shadow-lg
              backdrop-blur-md
              transition-all
              duration-300
              hover:scale-110
              hover:bg-black/60
              active:scale-95
            "
          >
            &#10095;
          </button>
        )}
      </section>
    </main>
  );
}

export default HeroBanner;