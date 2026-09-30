
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import logoSidebar from "../../../assets/academics/logo_sidebar.png";
import ratingShadow from "../../../assets/academics/rating-shadow.png";

// =========================================================
// API
// =========================================================

const API_URL = (
  import.meta.env.VITE_API_URL || ""
)
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

const apiUrl = (path) => {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

// =========================================================
// YEARS TO HIDE
// =========================================================

const HIDDEN_YEARS = [
  "2025-2026",
  "2025 2026",
  "2025/2026",
];

// =========================================================
// COMPONENT
// =========================================================

const GalleryInner = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [years, setYears] = useState([]);
  const [events, setEvents] = useState([]);

  const [defaultGalleryImages, setDefaultGalleryImages] =
    useState([]);

  const [galleryImages, setGalleryImages] = useState([]);

  const [activeYear, setActiveYear] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);

  const [showEvents, setShowEvents] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);

  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingDefaultImages, setLoadingDefaultImages] =
    useState(false);

  // Prevent an older year-event request from overwriting
  // the result of a newer year click.
  const eventsRequestRef = useRef(0);

  // =========================================================
  // FETCH JSON
  // =========================================================

  const fetchJson = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const contentType =
      response.headers.get("content-type") || "";

    const text = await response.text();

    if (!contentType.includes("application/json")) {
      console.error("API did not return JSON:", {
        url,
        status: response.status,
        contentType,
        response: text.substring(0, 500),
      });

      throw new Error(
        `API returned ${
          contentType || "unknown content"
        } instead of JSON. Status: ${response.status}`
      );
    }

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("Invalid JSON:", text);
      throw new Error(
        "Invalid JSON response from server."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `API request failed: ${response.status}`
      );
    }

    return data;
  };

  // =========================================================
  // NORMALIZE YEAR NAME
  // =========================================================

  const normalizeYearName = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  };

  // =========================================================
  // GET YEAR NAME
  // =========================================================

  const getYearName = (year) => {
    return (
      year?.year_name ||
      year?.yearName ||
      year?.name ||
      year?.academic_year ||
      year?.academicYear ||
      ""
    );
  };

  // =========================================================
  // CHECK HIDDEN YEAR
  // =========================================================

  const isHiddenYear = (year) => {
    const yearName = normalizeYearName(
      getYearName(year)
    );

    return HIDDEN_YEARS.some(
      (hiddenYear) =>
        normalizeYearName(hiddenYear) === yearName
    );
  };

  // =========================================================
  // GET IMAGE PATH
  // =========================================================

  const getImagePath = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      return image;
    }

    return (
      image.image_path ||
      image.image_url ||
      image.imageUrl ||
      image.url ||
      image.path ||
      image.file_path ||
      image.filePath ||
      image.file ||
      image.filename ||
      image.file_name ||
      image.image ||
      image.src ||
      ""
    );
  };

  // =========================================================
  // GET IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    const imagePath = getImagePath(image);

    if (!imagePath) {
      return "";
    }

    let cleanPath = String(imagePath).trim();

    if (!cleanPath) {
      return "";
    }

    // Already full URL
    if (/^https?:\/\//i.test(cleanPath)) {
      return cleanPath;
    }

    // Data URL
    if (/^data:image\//i.test(cleanPath)) {
      return cleanPath;
    }

    // Remove ./ from beginning
    cleanPath = cleanPath.replace(/^\.\/+/, "");

    // Remove beginning slash
    cleanPath = cleanPath.replace(/^\/+/, "");

    // Backend returns uploads/gallery/...
    if (cleanPath.startsWith("uploads/")) {
      return `${API_URL}/${cleanPath}`;
    }

    // Backend may return gallery/...
    if (cleanPath.startsWith("gallery/")) {
      return `${API_URL}/uploads/${cleanPath}`;
    }

    // Otherwise assume file is inside uploads
    return `${API_URL}/uploads/${cleanPath}`;
  };

  // =========================================================
  // EXTRACT IMAGE ARRAY
  // =========================================================

  const extractImages = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.images)) {
      return data.images;
    }

    if (Array.isArray(data?.galleryImages)) {
      return data.galleryImages;
    }

    if (Array.isArray(data?.gallery_images)) {
      return data.gallery_images;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.rows)) {
      return data.rows;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };

  // =========================================================
  // SORT YEARS
  // =========================================================

  const sortYears = (yearList) => {
    return [...yearList].sort((a, b) => {
      const yearA = parseInt(
        String(getYearName(a)).substring(0, 4),
        10
      );

      const yearB = parseInt(
        String(getYearName(b)).substring(0, 4),
        10
      );

      if (!Number.isNaN(yearA) && !Number.isNaN(yearB)) {
        return yearB - yearA;
      }

      return Number(b?.id || 0) - Number(a?.id || 0);
    });
  };

  // =========================================================
  // LOAD GENERAL GALLERY IMAGES
  // =========================================================

  const loadDefaultGalleryImages = async () => {
    try {
      setLoadingDefaultImages(true);

      const url = apiUrl(
        `/api/general-images?_=${Date.now()}`
      );

      console.log(
        "Loading general gallery images:",
        url
      );

      const data = await fetchJson(url);

      console.log(
        "GENERAL GALLERY API RESPONSE:",
        data
      );

      const imageList = extractImages(data);

      const validImages = imageList.filter((image) => {
        return Boolean(getImageUrl(image));
      });

      setDefaultGalleryImages(validImages);
    } catch (error) {
      console.error(
        "Load general gallery images error:",
        error
      );

      setDefaultGalleryImages([]);
    } finally {
      setLoadingDefaultImages(false);
    }
  };

  // =========================================================
  // LOAD YEARS
  // =========================================================

  const loadYears = async () => {
    try {
      setLoadingYears(true);

      const url = apiUrl(
        `/api/years?_=${Date.now()}`
      );

      console.log("Loading gallery years:", url);

      const data = await fetchJson(url);

      console.log("Gallery years API:", data);

      const yearList = Array.isArray(data)
        ? data
        : Array.isArray(data?.years)
        ? data.years
        : Array.isArray(data?.data)
        ? data.data
        : [];

      // Remove hidden year
      const filteredYears = yearList.filter(
        (year) => !isHiddenYear(year)
      );

      // Sort latest academic year first
      const sortedYears = sortYears(filteredYears);

      console.log(
        "Original gallery years:",
        yearList
      );

      console.log(
        "Filtered gallery years:",
        sortedYears
      );

      setYears(sortedYears);

      // Automatically select latest active year
      if (sortedYears.length > 0) {
        const activeYears = sortedYears.filter(
          (year) => Number(year?.is_active) === 1
        );

        const defaultYear =
          activeYears.length > 0
            ? activeYears[0]
            : sortedYears[0];

        setActiveYear(defaultYear);
      } else {
        setActiveYear(null);
      }
    } catch (error) {
      console.error(
        "Load gallery years error:",
        error
      );

      setYears([]);
      setActiveYear(null);
    } finally {
      setLoadingYears(false);
    }
  };

  // =========================================================
  // LOAD EVENTS
  // =========================================================

const loadEvents = async (yearId) => {
    const id = Number(yearId);

    if (!id) {
      console.error("Year ID missing:", yearId);
      setEvents([]);
      setActiveEvent(null);
      setGalleryImages([]);
      setLightboxImages([]);
      return;
    }

    const requestId = ++eventsRequestRef.current;

    try {
      setLoadingEvents(true);

      const url = apiUrl(
        `/api/years/${id}/events?_=${Date.now()}`
      );

      console.log("=================================");
      console.log("Loading events for year ID:", id);
      console.log("API URL:", url);
      console.log("=================================");

      const data = await fetchJson(url);

      // Ignore an older response when another year was clicked.
      if (requestId !== eventsRequestRef.current) {
        return;
      }

      console.log("Events Response:", data);

      const eventList = Array.isArray(data?.events)
        ? data.events
        : Array.isArray(data)
        ? data
        : [];

      // Extra safety: only display events for the clicked year.
      const correctYearEvents = eventList.filter(
        (event) =>
          Number(event?.academic_year_id) === id
      );

      console.log(
        `Events for year ${id}:`,
        correctYearEvents
      );

      setEvents(correctYearEvents);

      if (correctYearEvents.length > 0) {
        setActiveEvent(correctYearEvents[0]);
      } else {
        setActiveEvent(null);
        setGalleryImages([]);
        setLightboxImages([]);
        setSelectedIndex(null);
      }
    } catch (error) {
      if (requestId !== eventsRequestRef.current) {
        return;
      }

      console.error(
        `Failed to load events for year ${id}:`,
        error
      );

      setEvents([]);
      setActiveEvent(null);
      setGalleryImages([]);
      setLightboxImages([]);
      setSelectedIndex(null);
    } finally {
      if (requestId === eventsRequestRef.current) {
        setLoadingEvents(false);
      }
    }
  };

  // =========================================================
  // LOAD EVENT IMAGES
  // =========================================================

  const loadEventImages = async (eventId) => {
    if (!eventId) {
      setGalleryImages([]);
      setLightboxImages([]);
      return;
    }

    try {
      setLoadingImages(true);

      setGalleryImages([]);
      setLightboxImages([]);
      setSelectedIndex(null);

      const url = apiUrl(
        `/api/events/${eventId}/images?_=${Date.now()}`
      );

      console.log(
        "Loading event images:",
        url
      );

      const data = await fetchJson(url);

      console.log(
        "EVENT GALLERY API RESPONSE:",
        data
      );

      const imageList = extractImages(data);

      const validImages = imageList.filter((image) => {
        return Boolean(getImageUrl(image));
      });

      setGalleryImages(validImages);
      setLightboxImages(validImages);
    } catch (error) {
      console.error(
        "Load gallery images error:",
        error
      );

      setGalleryImages([]);
      setLightboxImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadYears();
    loadDefaultGalleryImages();
  }, []);

  // =========================================================
  // WHEN ACTIVE EVENT CHANGES
  // =========================================================

  useEffect(() => {
    if (!activeEvent?.id) {
      setGalleryImages([]);
      setLightboxImages([]);
      setSelectedIndex(null);
      return;
    }

    loadEventImages(activeEvent.id);
  }, [activeEvent?.id]);

  // =========================================================
  // YEAR CLICK
  // =========================================================

  const handleYearClick = async (year) => {
    const yearId = Number(year?.id);

    if (!yearId) {
      console.error("Invalid year:", year);
      return;
    }

    console.log("=================================");
    console.log("YEAR CLICKED:", year);
    console.log("YEAR ID:", yearId);
    console.log("YEAR NAME:", getYearName(year));
    console.log("=================================");

    setActiveYear(year);
    setShowEvents(true);

    // Clear the previous year's data immediately.
    setEvents([]);
    setActiveEvent(null);
    setGalleryImages([]);
    setLightboxImages([]);
    setSelectedIndex(null);

    // IMPORTANT: use the clicked year's ID directly.
    await loadEvents(yearId);
  };

  // =========================================================
  // BACK TO YEARS
  // =========================================================

  const handleBackToYears = () => {
    // Invalidate any request that is still running.
    eventsRequestRef.current += 1;

    setShowEvents(false);
    setActiveEvent(null);
    setEvents([]);

    setGalleryImages([]);
    setLightboxImages([]);
    setSelectedIndex(null);
  };

  // =========================================================
  // EVENT CLICK
  // =========================================================

  const handleEventClick = (event) => {
    console.log("Selected event:", event);

    setActiveEvent(event);
    setSelectedIndex(null);
  };

  // =========================================================
  // OPEN DEFAULT IMAGE
  // =========================================================

  const openDefaultImage = (index) => {
    setLightboxImages(defaultGalleryImages);
    setSelectedIndex(index);
  };

  // =========================================================
  // OPEN EVENT IMAGE
  // =========================================================

  const openEventImage = (index) => {
    setLightboxImages(galleryImages);
    setSelectedIndex(index);
  };

  // =========================================================
  // CLOSE LIGHTBOX
  // =========================================================

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  // =========================================================
  // NEXT IMAGE
  // =========================================================

  const nextImage = (e) => {
    e?.stopPropagation();

    if (lightboxImages.length <= 1) {
      return;
    }

    setSelectedIndex((prev) => {
      if (prev === null) {
        return 0;
      }

      return (
        (prev + 1) %
        lightboxImages.length
      );
    });
  };

  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================

  const previousImage = (e) => {
    e?.stopPropagation();

    if (lightboxImages.length <= 1) {
      return;
    }

    setSelectedIndex((prev) => {
      if (prev === null) {
        return 0;
      }

      return (
        (prev - 1 + lightboxImages.length) %
        lightboxImages.length
      );
    });
  };

  // =========================================================
  // KEYBOARD
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) {
        return;
      }

      if (e.key === "Escape") {
        closeLightbox();
      }

      if (e.key === "ArrowRight") {
        nextImage();
      }

      if (e.key === "ArrowLeft") {
        previousImage();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedIndex,
    lightboxImages.length,
  ]);

  // =========================================================
  // RENDER DEFAULT IMAGES
  // =========================================================

  const renderDefaultImages = () => {
    if (loadingDefaultImages) {
      return (
        <div className="flex min-h-[350px] items-center justify-center rounded-[15px] bg-[#f8f8f8] text-gray-500">
          Loading gallery...
        </div>
      );
    }

    if (defaultGalleryImages.length === 0) {
      return (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[15px] border-2 border-dashed border-gray-200 bg-[#f8f8f8] p-[30px] text-center">
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-pink-50 text-[#e71b93]">
            <ImagesIcon />
          </div>

          <p className="mt-5 text-lg font-semibold text-gray-700">
            No gallery images available
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Upload gallery images from the admin panel.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid w-full grid-cols-1 gap-[20px] sm:grid-cols-2">
          {defaultGalleryImages.map(
            (image, index) => {
              const imageUrl = getImageUrl(image);

              return (
                <div
                  key={
                    image?.id ||
                    image?.image_id ||
                    image?.gallery_image_id ||
                    index
                  }
                  className="group relative w-full overflow-hidden rounded-[15px] bg-[#f5f5f5] shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      openDefaultImage(index)
                    }
                    className="relative block w-full overflow-hidden border-0 bg-transparent p-0"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          image?.alt_text ||
                          image?.title ||
                          "Gallery image"
                        }
                        className="block aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          console.error(
                            "DEFAULT IMAGE LOAD FAILED:",
                            {
                              image,
                              imageUrl,
                            }
                          );

                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex aspect-[3/2] w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                        Image path missing
                      </div>
                    )}

                    <span className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30" />

                    <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-[#e71b93] text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowRight size={22} />
                    </span>
                  </button>
                </div>
              );
            }
          )}
        </div>

        <p className="mt-[20px] text-sm text-gray-400">
          Showing {defaultGalleryImages.length}{" "}
          gallery images.
        </p>
      </>
    );
  };

  // =========================================================
  // RENDER EVENT IMAGES
  // =========================================================

  const renderEventImages = () => {
    if (loadingImages) {
      return (
        <div className="flex min-h-[350px] items-center justify-center rounded-[15px] bg-[#f8f8f8] text-gray-500">
          Loading images...
        </div>
      );
    }

    if (galleryImages.length === 0) {
      return (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[15px] border-2 border-dashed border-gray-200 bg-[#f8f8f8] p-[30px] text-center">
          <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-pink-50 text-[#e71b93]">
            <ImagesIcon />
          </div>

          <p className="mt-5 text-lg font-semibold text-gray-700">
            No images available
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Add gallery images from the admin panel for
            this event.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid w-full grid-cols-1 gap-[20px] sm:grid-cols-2">
          {galleryImages.map(
            (image, index) => {
              const imageUrl = getImageUrl(image);

              return (
                <div
                  key={
                    image?.id ||
                    image?.image_id ||
                    image?.gallery_image_id ||
                    image?.filename ||
                    index
                  }
                  className="group relative w-full overflow-hidden rounded-[15px] bg-[#f5f5f5] shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      openEventImage(index)
                    }
                    className="relative block w-full overflow-hidden border-0 bg-transparent p-0"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          image?.alt_text ||
                          image?.title ||
                          activeEvent?.event_name ||
                          "Gallery image"
                        }
                        className="block aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          console.error(
                            "EVENT IMAGE LOAD FAILED:",
                            {
                              image,
                              imageUrl,
                            }
                          );

                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex aspect-[3/2] w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                        Image path missing
                      </div>
                    )}

                    <span className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30" />

                    <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-[#e71b93] text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowRight size={22} />
                    </span>
                  </button>
                </div>
              );
            }
          )}
        </div>

        <p className="mt-[20px] text-sm text-gray-400">
          Showing {galleryImages.length} images.
        </p>
      </>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <section className="relative w-full overflow-hidden bg-white py-[70px] sm:py-[80px] md:py-[90px] lg:py-[110px]">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-5 lg:px-6">

          {/* =====================================================
              YEARS PAGE
          ===================================================== */}

          {!showEvents && (
            <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-[60px]">

              {/* LEFT - YEARS */}

              <div className="w-full">

                <div className="relative overflow-hidden rounded-[8px] bg-[#f5f5f6] p-[25px] sm:p-[30px]">

                  <h3 className="relative -mx-[25px] -mt-[25px] mb-[30px] bg-[#e71b93] px-[25px] py-[14px] font-['Figtree',sans-serif] text-[22px] font-bold leading-[30px] text-white sm:-mx-[30px] sm:-mt-[30px] sm:px-[30px] sm:text-[23px]">
                    Gallery
                  </h3>

                  {loadingYears ? (
                    <p className="text-gray-500">
                      Loading years...
                    </p>
                  ) : years.length === 0 ? (
                    <p className="text-gray-500">
                      No years available.
                    </p>
                  ) : (
                    <ul className="m-0 list-none space-y-[14px] p-0">
                      {years.map((year) => {
  const isActive =
    Number(activeYear?.id) === Number(year?.id);

  return (
    <li
      key={year.id}
      className="group"
    >
      <button
        type="button"
        onClick={() => handleYearClick(year)}
        className={`relative flex min-h-[65px] w-full items-center justify-between overflow-hidden rounded-full border px-[25px] py-[10px] text-left font-['Figtree',sans-serif] text-[17px] font-bold transition-all duration-300 sm:px-[30px] ${
          isActive
            ? "border-[#e71b93] bg-gradient-to-r from-[#e71b93] to-[#050505] text-white shadow-lg"
            : "border-black/40 bg-white text-black hover:border-[#e71b93] hover:text-white"
        }`}
      >
        {/* Hover background */}
        {!isActive && (
          <span className="absolute inset-0 z-0 -translate-y-full bg-gradient-to-r from-[#e71b93] to-[#050505] transition-transform duration-500 group-hover:translate-y-0" />
        )}

        {/* Year */}
        <span className="relative z-10">
          {getYearName(year)}
        </span>

        {/* Arrow */}
        <span
          className={`relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isActive
              ? "bg-white text-black"
              : "bg-black text-white group-hover:bg-white group-hover:text-black"
          }`}
        >
          <ArrowRight
            size={20}
            strokeWidth={2.5}
          />
        </span>
      </button>
    </li>
  );
})}
                    </ul>
                  )}
                </div>

                {/* CONTACT */}

                <div className="relative mt-[40px] overflow-hidden rounded-[45px] bg-black">

                  <div
                    className="relative px-[30px] pb-[45px] pt-[35px] sm:px-[40px] sm:pb-[50px]"
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
                    <div className="relative mt-[20px] flex justify-center">
                      <img
                        src={logoSidebar}
                        alt="School Logo"
                        className="max-h-[90px] w-auto object-contain"
                      />
                    </div>

                    <h4 className="relative mt-[25px] text-center font-['Figtree',sans-serif] text-[16px] font-normal leading-[30px] text-white">
                      Any Questions? Let’s talk

                      <a
                        href="tel:+919655407774"
                        className="block text-[24px] font-bold leading-[35px] text-white transition-colors duration-300 hover:text-[#e71b93] sm:text-[29px]"
                      >
                        (+91) 9655407774
                      </a>
                    </h4>

                    <div className="mt-[30px] flex justify-center">
                      <a
                        href="/contact"
                        className="group inline-flex items-center overflow-hidden rounded-full bg-[#e71b93] py-[8px] pl-[25px] pr-[8px] text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-white hover:text-black"
                      >
                        <span>
                          Get a Call Back
                        </span>

                        <span className="ml-[15px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-black text-white transition-all group-hover:bg-[#e71b93]">
                          <ArrowRight size={19} />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT - DEFAULT IMAGES */}

              <div className="w-full min-w-0">

                <div className="mb-[30px] sm:mb-[40px]">
                  <h2 className="m-0 font-['Figtree',sans-serif] text-[32px] font-semibold leading-[42px] text-[#050734] sm:text-[42px] sm:leading-[52px] lg:text-[52px] lg:leading-[62px]">
                    Gallery
                  </h2>

                  <div className="mt-[12px] h-[4px] w-[60px] rounded-full bg-[#e71b93]" />
                </div>

                {renderDefaultImages()}
              </div>
            </div>
          )}

          {/* =====================================================
              EVENTS PAGE
          ===================================================== */}

          {showEvents && (
            <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-[60px]">

              {/* LEFT - EVENTS */}

              <div className="w-full">

                <div className="relative overflow-hidden rounded-[8px] bg-[#f5f5f6] p-[25px] sm:p-[30px]">

                  <button
                    type="button"
                    onClick={handleBackToYears}
                    className="group mb-[25px] inline-flex items-center gap-[10px] rounded-full border border-black/20 bg-white px-[18px] py-[9px] font-['Figtree',sans-serif] text-[13px] font-bold text-[#050734] transition-all duration-300 hover:border-[#e71b93] hover:bg-[#e71b93] hover:text-white"
                  >
                    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#050734] text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#e71b93]">
                      <ArrowLeft
                        size={16}
                        strokeWidth={2.5}
                      />
                    </span>

                    <span>
                      All Years
                    </span>
                  </button>

                  <h3 className="relative -mx-[25px] mb-[30px] bg-[#e71b93] px-[25px] py-[15px] font-['Figtree',sans-serif] text-[21px] font-bold leading-[30px] text-white sm:-mx-[30px] sm:px-[30px] sm:text-[23px]">
                    {getYearName(activeYear)}
                  </h3>

                  {loadingEvents ? (
                    <p className="text-gray-500">
                      Loading events...
                    </p>
                  ) : events.length === 0 ? (
                    <p className="text-gray-500">
                      No events available.
                    </p>
                  ) : (
                    <ul className="m-0 list-none space-y-[12px] p-0">
                      {events.map((event) => {
                        const isActive =
                          Number(activeEvent?.id) ===
                          Number(event.id);

                        return (
                          <li
                            key={event.id}
                            className="group"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleEventClick(event)
                              }
                              className={`relative flex min-h-[58px] w-full items-center justify-between overflow-hidden rounded-full border px-[20px] py-[10px] pr-[65px] text-left font-['Figtree',sans-serif] text-[15px] font-semibold transition-all duration-300 ${
                                isActive
                                  ? "border-[#e71b93] text-white"
                                  : "border-black/40 text-black hover:border-[#e71b93] hover:text-white"
                              }`}
                            >
                              <span
                                className={`absolute inset-0 z-0 bg-gradient-to-r from-[#e71b93] to-[#050505] transition-transform duration-500 ${
                                  isActive
                                    ? "translate-y-0"
                                    : "translate-y-[-105%] group-hover:translate-y-0"
                                }`}
                              />

                              <span className="relative z-10">
                                {event.event_name}
                              </span>

                              <span
                                className={`absolute right-[5px] top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full ${
                                  isActive
                                    ? "bg-white text-black"
                                    : "bg-black text-white group-hover:bg-white group-hover:text-black"
                                }`}
                              >
                                <ArrowRight
                                  size={17}
                                  strokeWidth={2.5}
                                />
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* RIGHT - EVENT IMAGES */}

              <div className="w-full min-w-0">

                <div className="mb-[30px] sm:mb-[40px]">
                  <h2 className="m-0 font-['Figtree',sans-serif] text-[32px] font-semibold leading-[42px] text-[#050734] sm:text-[40px] sm:leading-[50px] md:text-[48px] md:leading-[58px]">
                    {activeEvent?.event_name ||
                      "Gallery"}
                  </h2>

                  <div className="mt-[12px] h-[4px] w-[60px] rounded-full bg-[#e71b93]" />
                </div>

                {renderEventImages()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}

      {selectedIndex !== null &&
        lightboxImages[selectedIndex] && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-[15px] sm:p-[30px]"
            onClick={closeLightbox}
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="absolute right-[15px] top-[15px] z-[100000] flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#e71b93] text-white transition-all duration-300 hover:bg-white hover:text-black sm:right-[30px] sm:top-[30px]"
            >
              <X size={24} />
            </button>

            {/* PREVIOUS */}

            {lightboxImages.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous image"
                className="absolute left-[10px] top-1/2 z-[100000] flex h-[45px] w-[45px] -translate-y-1/2 items-center justify-center rounded-full bg-[#e71b93] text-white transition-all duration-300 hover:bg-white hover:text-black sm:left-[25px] sm:h-[55px] sm:w-[55px]"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* IMAGE */}

            <div
              className="relative flex max-h-[90vh] max-w-[85vw] items-center justify-center"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <img
                src={getImageUrl(
                  lightboxImages[selectedIndex]
                )}
                alt={
                  lightboxImages[selectedIndex]
                    ?.alt_text ||
                  lightboxImages[selectedIndex]
                    ?.title ||
                  activeEvent?.event_name ||
                  "Gallery"
                }
                className="max-h-[85vh] max-w-[85vw] rounded-[10px] object-contain shadow-2xl"
              />

              {/* IMAGE COUNT */}

              <div className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-[15px] py-[5px] text-[13px] text-white backdrop-blur-sm">
                {selectedIndex + 1} /{" "}
                {lightboxImages.length}
              </div>
            </div>

            {/* NEXT */}

            {lightboxImages.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-[10px] top-1/2 z-[100000] flex h-[45px] w-[45px] -translate-y-1/2 items-center justify-center rounded-full bg-[#e71b93] text-white transition-all duration-300 hover:bg-white hover:text-black sm:right-[25px] sm:h-[55px] sm:w-[55px]"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>
        )}
    </>
  );
};

// =========================================================
// IMAGE ICON
// =========================================================

const ImagesIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />

      <circle
        cx="8.5"
        cy="8.5"
        r="1.5"
      />

      <path d="m21 15-5-5L5 21" />
    </svg>
  );
};

export default GalleryInner;
