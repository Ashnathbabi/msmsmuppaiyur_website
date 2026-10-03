import { API_URL, getImageUrl } from "../../../config/api";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import sublogo from "../../../assets/sub-logo1.png";

// =====================================================
// GALLERY ITEM
// =====================================================

const GalleryItem = ({
  src,
  alt,
  className = "",
}) => {
  if (!src) return null;

  return (
    <div
      className={`relative w-full text-center ${className}`}
    >
      <div
        className="
          group
          relative
          h-full
          overflow-hidden
          rounded-[15px]
        "
      >
        {/* IMAGE */}

        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="
            block
            h-full
            min-h-[300px]
            w-full
            rounded-[15px]
            object-cover
            transition-transform
            duration-700
            ease-in-out
            group-hover:scale-105
          "
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* TOP OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-[#2d3381]
            transition-transform
            duration-700
            ease-in-out
            -translate-y-[110%]
            group-hover:translate-y-[110%]
          "
        />

        {/* MAIN OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            bg-[#2d3381]/80
            transition-transform
            duration-700
            ease-in-out
            -translate-y-[110%]
            group-hover:translate-y-0
          "
        />

        {/* PLUS */}

        <button
          type="button"
          aria-label={`View ${alt}`}
          className="
            absolute
            left-1/2
            top-1/2
            z-[3]
            flex
            h-[60px]
            w-[60px]
            -translate-x-1/2
            -translate-y-1/2
            scale-0
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#2d3381]
            opacity-100
            transition-all
            duration-300
            ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            group-hover:scale-100
            group-hover:delay-[700ms]
          "
        >
          <Plus
            size={30}
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
};

// =====================================================
// WEBSITE GALLERY
// =====================================================

const Gallery = () => {
  const [gallery, setGallery] = useState([]);

  const [settings, setSettings] = useState({
    badge_title: "Gallery",
    heading:
      "Capturing Moments That Celebrate Every Student’s Journey",
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/gallery-home?_=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const text = await response.text();

      console.log(
        "PUBLIC GALLERY STATUS:",
        response.status
      );

      console.log(
        "PUBLIC GALLERY RESPONSE:",
        text
      );

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error(
          "Gallery API returned invalid JSON"
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to fetch gallery"
        );
      }

      if (!data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Gallery API failed"
        );
      }

      // =================================================
      // SETTINGS
      // =================================================

      if (data.settings) {
        setSettings({
          badge_title:
            data.settings.badge_title ||
            "Gallery",

          heading:
            data.settings.heading ||
            "Capturing Moments That Celebrate Every Student’s Journey",
        });
      }

      // =================================================
      // GALLERY
      // =================================================

      const galleryData = Array.isArray(
        data.gallery
      )
        ? data.gallery
        : [];

      setGallery(galleryData);

      console.log(
        "PUBLIC GALLERY DATA:",
        galleryData
      );
    } catch (error) {
      console.error(
        "PUBLIC GALLERY ERROR:",
        error
      );

      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="overflow-hidden py-[100px]">
        <div className="mx-auto w-full max-w-[1140px] px-4">
          <div className="flex justify-center py-20">
            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-gray-200
                border-t-[#2d3381]
              "
            />
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // NO IMAGE
  // =====================================================

  if (gallery.length === 0) {
    return (
      <section className="overflow-hidden py-[100px]">
        <div className="mx-auto w-full max-w-[1140px] px-4">

          <div className="mx-auto w-full md:w-2/3">
            <div className="mb-[60px] text-center">

              {/* BADGE */}

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
                    className="
                      object-contain
                      brightness-0
                      invert
                    "
                  />
                </span>

                {settings.badge_title}
              </h5>

              {/* HEADING */}

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
                {settings.heading}
              </h2>
            </div>
          </div>

          <div className="py-10 text-center">
            <p className="text-gray-400">
              No gallery images available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // FIRST FOUR IMAGES
  // =====================================================

  const image1 = gallery[0];
  const image2 = gallery[1];
  const image3 = gallery[2];
  const image4 = gallery[3];

  // =====================================================
  // ADDITIONAL IMAGES
  // =====================================================

  const additionalImages =
    gallery.slice(4);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section
      className="
        Gallery_wrapper
        overflow-hidden
        py-[100px]
      "
    >
      <div className="mx-auto w-full max-w-[1140px] px-4">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="grid grid-cols-1">
          <div className="mx-auto w-full md:w-2/3">
            <div className="mb-[60px] text-center">

              {/* BADGE */}

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
                    className="
                      object-contain
                      brightness-0
                      invert
                    "
                  />
                </span>

                {settings.badge_title}
              </h5>

              {/* HEADING */}

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
                {settings.heading}
              </h2>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN GALLERY
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-12
          "
        >

          {/* LEFT */}

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-6">

              {/* IMAGE 1 */}

              {image1 && (
                <GalleryItem
                  src={getImageUrl(image1.image)}
                  alt={
                    image1.title ||
                    "Gallery Image 1"
                  }
                  className="h-[400px]"
                />
              )}

              {/* IMAGE 2 + 3 */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-2
                "
              >
                {image2 && (
                  <div className="mt-0 md:mt-[23px]">
                    <GalleryItem
                      src={getImageUrl(
                        image2.image
                      )}
                      alt={
                        image2.title ||
                        "Gallery Image 2"
                      }
                      className="h-[300px]"
                    />
                  </div>
                )}

                {image3 && (
                  <div className="mt-0 md:mt-[23px]">
                    <GalleryItem
                      src={getImageUrl(
                        image3.image
                      )}
                      alt={
                        image3.title ||
                        "Gallery Image 3"
                      }
                      className="h-[300px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="lg:col-span-5">
            {image4 && (
              <GalleryItem
                src={getImageUrl(image4.image)}
                alt={
                  image4.title ||
                  "Gallery Image 4"
                }
                className="h-full min-h-[700px]"
              />
            )}
          </div>
        </div>

        {/* =================================================
            ADDITIONAL GALLERY IMAGES
        ================================================= */}

        {additionalImages.length > 0 && (
          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {additionalImages.map(
              (item) => (
                <GalleryItem
                  key={item.id}
                  src={getImageUrl(
                    item.image
                  )}
                  alt={
                    item.title ||
                    "Gallery Image"
                  }
                  className="h-[300px]"
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
