import { API_URL, getImageUrl } from "../../../config/api";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

const Alumni = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [students, setStudents] = useState([]);

  // Alumni menu open -> show all gallery images
  const [galleryImages, setGalleryImages] = useState([]);

  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // LIGHTBOX STATES
  // =========================================================

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);


  // =========================================================
  // API REQUEST
  // =========================================================

  const apiRequest = useCallback(
    async (endpoint) => {
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

      const url = `${API_URL}${cleanEndpoint}`;

      console.log("=================================");
      console.log("API REQUEST:", url);
      console.log("=================================");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType =
        response.headers.get("content-type") || "";

      const text = await response.text();

      let data = null;

      if (text) {
        if (contentType.includes("application/json")) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error("JSON PARSE ERROR:", parseError);

            throw new Error(
              "Invalid JSON response from server."
            );
          }
        } else {
          console.error("API DID NOT RETURN JSON:", {
            url,
            status: response.status,
            contentType,
            response: text.substring(0, 500),
          });

          throw new Error(
            `API returned ${
              contentType || "unknown content type"
            } instead of JSON. Status: ${response.status}`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
      }

      return data;
    },
    [API_URL]
  );

  // =========================================================
  // YEAR HELPERS
  // =========================================================

  const getYearSlug = (year) => {
    if (!year) return "";

    const existingSlug =
      year.slug ||
      year.year_slug ||
      year.yearSlug;

    if (existingSlug) {
      return String(existingSlug)
        .trim()
        .toLowerCase();
    }

    return String(
      year.year_name ||
        year.yearName ||
        year.name ||
        year.year ||
        ""
    )
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .toLowerCase();
  };

  const getYearName = (year) => {
    if (!year) return "";

    return (
      year.year_name ||
      year.yearName ||
      year.name ||
      year.year ||
      ""
    );
  };

  // =========================================================
  // STUDENT HELPERS
  // =========================================================

  const getStudentName = (student) => {
    return (
      student?.name ||
      student?.student_name ||
      student?.studentName ||
      student?.full_name ||
      student?.fullName ||
      "-"
    );
  };

  const getStudentCourse = (student) => {
    return (
      student?.course ||
      student?.course_name ||
      student?.courseName ||
      student?.designation ||
      student?.course_designation ||
      "-"
    );
  };

  const getStudentContact = (student) => {
    return (
      student?.contact ||
      student?.phone ||
      student?.mobile ||
      student?.contact_number ||
      student?.contactNumber ||
      "-"
    );
  };

  // =========================================================
  // IMAGE URL HELPER
  // =========================================================

  

  // =========================================================
  // EXTRACT GALLERY IMAGES
  // =========================================================

  const extractGalleryImages = (data) => {
    let images = [];

    if (Array.isArray(data)) {
      images = data;
    } else if (Array.isArray(data?.images)) {
      images = data.images;
    } else if (Array.isArray(data?.gallery)) {
      images = data.gallery;
    } else if (Array.isArray(data?.gallery_images)) {
      images = data.gallery_images;
    } else if (Array.isArray(data?.data)) {
      images = data.data;
    } else if (Array.isArray(data?.data?.images)) {
      images = data.data.images;
    } else if (Array.isArray(data?.data?.gallery)) {
      images = data.data.gallery;
    }

    return images
      .map((image, index) => {
        const url = getImageUrl(image);

        if (!url) return null;

        return {
          id:
            image?.id ||
            image?.image_id ||
            image?.gallery_id ||
            index,

          url,

          alt:
            image?.alt_text ||
            image?.altText ||
            image?.title ||
            image?.caption ||
            "Alumni image",
        };
      })
      .filter(Boolean);
  };

  // =========================================================
  // FETCH YEARS
  // =========================================================

  const fetchYears = useCallback(async () => {
    try {
      setLoadingYears(true);
      setError("");

      const data = await apiRequest("/alumni/years");

      console.log(
        "ACADEMIC YEARS RESPONSE:",
        data
      );

      const yearList = Array.isArray(data)
        ? data
        : Array.isArray(data?.years)
        ? data.years
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.years)
        ? data.data.years
        : [];

      const validYears = yearList
        .map((year, index) => {
          const slug = getYearSlug(year);
          const name = getYearName(year);

          if (!slug || !name) {
            return null;
          }

          return {
            ...year,
            id:
              year.id ??
              year.year_id ??
              year.academic_year_id ??
              slug ??
              index,
            slug,
            year_name: name,
          };
        })
        .filter(Boolean);

      setYears(validYears);

      // IMPORTANT:
      // No year selected by default.
      // Alumni menu -> images should display.
      setSelectedYear(null);
      setStudents([]);
    } catch (err) {
      console.error(
        "FETCH YEARS ERROR:",
        err
      );

      setYears([]);
      setSelectedYear(null);
      setStudents([]);

      setError(
        err.message ||
          "Failed to load academic years."
      );
    } finally {
      setLoadingYears(false);
    }
  }, [apiRequest]);

  // =========================================================
  // FETCH ALL ALUMNI GALLERY
  // =========================================================

  const fetchGallery = useCallback(async () => {
    try {
      setLoadingGallery(true);

      const data = await apiRequest(
        "/alumni/gallery"
      );

      console.log(
        "ALUMNI GALLERY RESPONSE:",
        data
      );

      const images =
        extractGalleryImages(data);

      console.log(
        "FINAL GALLERY IMAGES:",
        images
      );

      setGalleryImages(images);
    } catch (err) {
      console.error(
        "FETCH GALLERY ERROR:",
        err
      );

      setGalleryImages([]);
    } finally {
      setLoadingGallery(false);
    }
  }, [apiRequest]);

  // =========================================================
  // FETCH STUDENTS BY YEAR
  // =========================================================

  const fetchYearStudents = useCallback(
    async (slug) => {
      if (!slug) {
        setStudents([]);
        return;
      }

      try {
        setLoadingStudents(true);
        setError("");

        const data = await apiRequest(
          `/alumni/year/${encodeURIComponent(
            slug
          )}`
        );

        console.log(
          "SELECTED YEAR RESPONSE:",
          data
        );

        const studentList = Array.isArray(
          data?.students
        )
          ? data.students
          : Array.isArray(
              data?.data?.students
            )
          ? data.data.students
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setStudents(studentList);
      } catch (err) {
        console.error(
          "FETCH YEAR STUDENTS ERROR:",
          err
        );

        setStudents([]);

        setError(
          err.message ||
            "Failed to load alumni students."
        );
      } finally {
        setLoadingStudents(false);
      }
    },
    [apiRequest]
  );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchYears();
    fetchGallery();
  }, [fetchYears, fetchGallery]);

  // =========================================================
  // HANDLE YEAR CLICK
  // =========================================================

  const handleYearClick = async (year) => {
    if (!year) return;

    const slug = getYearSlug(year);

    console.log(
      "================================="
    );
    console.log("YEAR CLICKED");
    console.log("YEAR:", getYearName(year));
    console.log("SLUG:", slug);
    console.log(
      "================================="
    );

    setSelectedYear(year);
    setStudents([]);
    setError("");

    await fetchYearStudents(slug);
  };

  // =========================================================
  // BACK TO ALUMNI IMAGES
  // =========================================================

  const handleAlumniClick = () => {
    setSelectedYear(null);
    setStudents([]);
    setError("");

    // Refresh images so newly uploaded admin images appear
    fetchGallery();
  };

  // =========================================================
  // OPEN LIGHTBOX
  // =========================================================

  const openLightbox = (index) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);

    document.body.style.overflow = "hidden";
  };

  // =========================================================
  // CLOSE LIGHTBOX
  // =========================================================

  const closeLightbox = () => {
    setLightboxOpen(false);

    document.body.style.overflow = "";
  };

  // =========================================================
  // NEXT IMAGE
  // =========================================================

  const nextImage = useCallback(() => {
    if (!galleryImages.length) return;

    setActiveImageIndex((current) =>
      current === galleryImages.length - 1
        ? 0
        : current + 1
    );
  }, [galleryImages.length]);

  // =========================================================
  // PREVIOUS IMAGE
  // =========================================================

  const previousImage = useCallback(() => {
    if (!galleryImages.length) return;

    setActiveImageIndex((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1
    );
  }, [galleryImages.length]);

  // =========================================================
  // KEYBOARD LIGHTBOX
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!lightboxOpen) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
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
    lightboxOpen,
    nextImage,
    previousImage,
  ]);

  // =========================================================
  // CLEAN BODY SCROLL
  // =========================================================

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // =========================================================
  // LOADING YEARS
  // =========================================================

  if (loadingYears) {
    return (
      <section className="min-h-[500px] bg-white py-[100px]">
        <div className="mx-auto max-w-[1320px] px-5">
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-gray-200
                  border-t-[#e71b93]
                "
              />

              <p className="text-gray-500">
                Loading alumni...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <>
      <section
        className="
          relative
          w-full
          overflow-hidden
          bg-white
          py-[70px]
          sm:py-[80px]
          md:py-[90px]
          lg:py-[110px]
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1320px]
            px-4
            sm:px-5
            lg:px-6
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-[40px]
              lg:grid-cols-[minmax(300px,1fr)_minmax(0,2fr)]
              lg:gap-[50px]
              xl:grid-cols-[350px_minmax(0,1fr)]
            "
          >
            {/* =====================================================
                LEFT SIDEBAR
            ===================================================== */}

            <div className="w-full">
              <aside
                className="
                  relative
                  lg:sticky
                  lg:top-[30px]
                "
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[8px]
                    bg-[#f5f5f6]
                    p-[25px]
                    sm:p-[30px]
                  "
                >
                  {/* TITLE */}

                  <button
                    type="button"
                    onClick={handleAlumniClick}
                    className="
                      relative
                      -mx-[25px]
                      -mt-[25px]
                      mb-[30px]
                      block
                      w-[calc(100%+50px)]
                      cursor-pointer
                      bg-[#e71b93]
                      px-[25px]
                      py-[14px]
                      text-left
                      font-['Figtree',sans-serif]
                      text-[21px]
                      font-bold
                      leading-[30px]
                      text-white
                      sm:-mx-[30px]
                      sm:-mt-[30px]
                      sm:w-[calc(100%+60px)]
                      sm:px-[30px]
                      sm:text-[23px]
                      sm:leading-[32px]
                    "
                  >
                    Alumni
                  </button>

                  {/* YEARS */}

                  {years.length === 0 ? (
                    <div
                      className="
                        rounded-lg
                        bg-white
                        p-5
                        text-center
                        text-sm
                        text-gray-500
                      "
                    >
                      No academic years found.
                    </div>
                  ) : (
                    <ul className="m-0 list-none space-y-[14px] p-0">
                      {years.map((year) => {
                        const isActive =
                          String(
                            selectedYear?.slug || ""
                          ).toLowerCase() ===
                          String(
                            year.slug || ""
                          ).toLowerCase();

                        return (
                          <li
                            key={`${year.id}-${year.slug}`}
                            className="group relative"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleYearClick(
                                  year
                                )
                              }
                              disabled={
                                loadingStudents
                              }
                              className={`
                                relative
                                block
                                w-full
                                overflow-hidden
                                rounded-full
                                border
                                px-[25px]
                                py-[15px]
                                pr-[75px]
                                text-left
                                font-['Figtree',sans-serif]
                                text-[16px]
                                font-semibold
                                leading-[25px]
                                transition-all
                                duration-300
                                sm:px-[30px]
                                sm:py-[17px]
                                sm:pr-[75px]

                                ${
                                  isActive
                                    ? "border-[#e71b93] text-white"
                                    : "border-black/50 text-black hover:translate-x-[3px] hover:border-[#e71b93] hover:text-white"
                                }

                                ${
                                  loadingStudents
                                    ? "cursor-wait"
                                    : "cursor-pointer"
                                }
                              `}
                            >
                              <span
                                className={`
                                  absolute
                                  inset-0
                                  z-0
                                  rounded-full
                                  bg-gradient-to-r
                                  from-[#e71b93]
                                  via-[#e71b93]
                                  to-[#050505]
                                  transition-transform
                                  duration-500

                                  ${
                                    isActive
                                      ? "translate-y-0"
                                      : "translate-y-[-105%] group-hover:translate-y-0"
                                  }
                                `}
                              />

                              <span className="relative z-[2]">
                                {getYearName(year)}
                              </span>

                              <span
                                className={`
                                  absolute
                                  right-[6px]
                                  top-1/2
                                  z-[3]
                                  flex
                                  h-[55px]
                                  w-[55px]
                                  -translate-y-1/2
                                  items-center
                                  justify-center
                                  rounded-full
                                  transition-all
                                  duration-300

                                  ${
                                    isActive
                                      ? "bg-white text-black"
                                      : "bg-black text-white group-hover:bg-white group-hover:text-black"
                                  }
                                `}
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
              </aside>
            </div>

            {/* =====================================================
                RIGHT CONTENT
            ===================================================== */}

            <div className="w-full min-w-0">
              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="mb-[30px] sm:mb-[40px]">
                <h2
                  className="
                    m-0
                    pl-[10px]
                    pt-[5px]
                    font-['Figtree',sans-serif]
                    text-[30px]
                    font-semibold
                    leading-[40px]
                    text-[#050734]
                    sm:text-[38px]
                    sm:leading-[50px]
                    md:text-[45px]
                    md:leading-[55px]
                    lg:pl-[25px]
                    lg:text-[52px]
                    lg:leading-[62px]
                  "
                >
                  {selectedYear
                    ? `Alumni ${getYearName(
                        selectedYear
                      )}`
                    : "Alumni"}
                </h2>

                <div
                  className="
                    ml-[10px]
                    mt-[12px]
                    h-[4px]
                    w-[60px]
                    rounded-full
                    bg-[#e71b93]
                    lg:ml-[25px]
                  "
                />
              </div>

              {/* ERROR */}

              {error && (
                <div
                  className="
                    mb-6
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-5
                    py-4
                    text-red-600
                  "
                >
                  <p className="font-semibold">
                    {error}
                  </p>
                </div>
              )}

              {/* =================================================
                  ALUMNI MENU = ALL IMAGES
              ================================================= */}

              {!selectedYear && (
                <>
                  {loadingGallery ? (
                    <div
                      className="
                        flex
                        min-h-[350px]
                        items-center
                        justify-center
                        rounded-[15px]
                        bg-[#f8f8f8]
                      "
                    >
                      <div className="text-center">
                        <div
                          className="
                            mx-auto
                            mb-4
                            h-9
                            w-9
                            animate-spin
                            rounded-full
                            border-4
                            border-gray-200
                            border-t-[#e71b93]
                          "
                        />

                        <p className="text-gray-500">
                          Loading alumni images...
                        </p>
                      </div>
                    </div>
                  ) : galleryImages.length > 0 ? (
                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-2
                        xl:grid-cols-3
                      "
                    >
                      {galleryImages.map(
                        (image, index) => (
                          <button
                            key={`${image.id}-${index}`}
                            type="button"
                            onClick={() =>
                              openLightbox(index)
                            }
                            className="
                              group
                              relative
                              h-[220px]
                              w-full
                              cursor-zoom-in
                              overflow-hidden
                              rounded-[15px]
                              bg-gray-100
                              shadow-sm
                              outline-none
                              focus:ring-2
                              focus:ring-[#e71b93]
                              focus:ring-offset-2
                            "
                            aria-label="View image"
                          >
                            <img
                              src={image.url}
                              alt={
                                image.alt ||
                                "Alumni image"
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-110
                              "
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.opacity =
                                  "0";
                              }}
                            />

                            {/* ONLY IMAGE HOVER EFFECT
                                NO TEXT / NO ALUMNI */}
                            <span
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-black/0
                                transition-colors
                                duration-300
                                group-hover:bg-black/10
                              "
                            />
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                        rounded-[15px]
                        bg-[#f8f8f8]
                        px-6
                        py-14
                        text-center
                      "
                    >
                      <div
                        className="
                          mx-auto
                          mb-5
                          flex
                          h-[80px]
                          w-[80px]
                          items-center
                          justify-center
                          rounded-full
                          bg-pink-100
                        "
                      >
                        <ArrowRight
                          size={32}
                          className="text-[#e71b93]"
                        />
                      </div>

                      <h3
                        className="
                          mb-2
                          text-2xl
                          font-bold
                          text-[#050734]
                          sm:text-3xl
                        "
                      >
                        No Images
                      </h3>

                      <p className="text-gray-500">
                        No alumni images have
                        been added yet.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* =================================================
                  SELECTED YEAR = STUDENTS ONLY
              ================================================= */}

              {selectedYear && (
                <>
                  {loadingStudents ? (
                    <div
                      className="
                        flex
                        min-h-[300px]
                        items-center
                        justify-center
                        rounded-[15px]
                        bg-[#f8f8f8]
                      "
                    >
                      <div className="text-center">
                        <div
                          className="
                            mx-auto
                            mb-4
                            h-9
                            w-9
                            animate-spin
                            rounded-full
                            border-4
                            border-gray-200
                            border-t-[#e71b93]
                          "
                        />

                        <p className="text-gray-500">
                          Loading students...
                        </p>
                      </div>
                    </div>
                  ) : students.length > 0 ? (
                    <div
                      className="
                        w-full
                        overflow-x-auto
                        rounded-[15px]
                        bg-[#f5f5f6]
                        shadow-sm
                      "
                    >
                      <table
                        className="
                          w-full
                          min-w-[650px]
                          border-collapse
                          overflow-hidden
                          font-['Figtree',sans-serif]
                        "
                      >
                        <thead>
                          <tr className="bg-[#e71b93] text-white">
                            <th
                              className="
                                px-[20px]
                                py-[18px]
                                text-left
                                text-[15px]
                                font-bold
                                uppercase
                                tracking-[0.3px]
                                sm:px-[25px]
                                sm:text-[16px]
                              "
                            >
                              Name of the Student
                            </th>

                            <th
                              className="
                                px-[20px]
                                py-[18px]
                                text-left
                                text-[15px]
                                font-bold
                                uppercase
                                tracking-[0.3px]
                                sm:px-[25px]
                                sm:text-[16px]
                              "
                            >
                              Course / Designation
                            </th>

                            <th
                              className="
                                px-[20px]
                                py-[18px]
                                text-left
                                text-[15px]
                                font-bold
                                uppercase
                                tracking-[0.3px]
                                sm:px-[25px]
                                sm:text-[16px]
                              "
                            >
                              Contact Number
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {students.map(
                            (
                              student,
                              index
                            ) => (
                              <tr
                                key={
                                  student.id ||
                                  student.student_id ||
                                  index
                                }
                                className="
                                  border-b
                                  border-gray-200
                                  bg-white
                                  transition-colors
                                  duration-300
                                  hover:bg-pink-50
                                "
                              >
                                <td
                                  className="
                                    px-[20px]
                                    py-[20px]
                                    text-[15px]
                                    font-semibold
                                    text-[#050734]
                                    sm:px-[25px]
                                    sm:text-[16px]
                                  "
                                >
                                  {getStudentName(
                                    student
                                  )}
                                </td>

                                <td
                                  className="
                                    px-[20px]
                                    py-[20px]
                                    text-[15px]
                                    text-[#666666]
                                    sm:px-[25px]
                                    sm:text-[16px]
                                  "
                                >
                                  {getStudentCourse(
                                    student
                                  )}
                                </td>

                                <td
                                  className="
                                    px-[20px]
                                    py-[20px]
                                    text-[15px]
                                    text-[#666666]
                                    sm:px-[25px]
                                    sm:text-[16px]
                                  "
                                >
                                  {getStudentContact(
                                    student
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div
                      className="
                        rounded-[15px]
                        bg-[#f8f8f8]
                        px-5
                        py-12
                        text-center
                        text-gray-500
                      "
                    >
                      No alumni students found
                      for{" "}
                      <span className="font-semibold text-[#050734]">
                        {getYearName(
                          selectedYear
                        )}
                      </span>
                      .
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}

      {lightboxOpen &&
        galleryImages.length > 0 && (
          <div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/90
              p-4
              sm:p-8
            "
            onClick={closeLightbox}
          >
            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeLightbox}
              className="
                absolute
                right-4
                top-4
                z-[10001]
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur-sm
                transition
                hover:bg-[#e71b93]
                sm:right-7
                sm:top-7
              "
              aria-label="Close image"
            >
              <X size={24} />
            </button>

            {/* PREVIOUS BUTTON */}

            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="
                  absolute
                  left-3
                  top-1/2
                  z-[10001]
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  backdrop-blur-sm
                  transition
                  hover:bg-[#e71b93]
                  sm:left-7
                "
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* IMAGE */}

            <div
              className="
                relative
                flex
                max-h-[90vh]
                max-w-[92vw]
                items-center
                justify-center
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <img
                src={
                  galleryImages[
                    activeImageIndex
                  ]?.url
                }
                alt={
                  galleryImages[
                    activeImageIndex
                  ]?.alt || "Alumni image"
                }
                className="
                  max-h-[85vh]
                  max-w-[90vw]
                  rounded-lg
                  object-contain
                  shadow-2xl
                "
              />
            </div>

            {/* NEXT BUTTON */}

            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="
                  absolute
                  right-3
                  top-1/2
                  z-[10001]
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  backdrop-blur-sm
                  transition
                  hover:bg-[#e71b93]
                  sm:right-7
                "
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            )}

            {/* IMAGE COUNT */}

            {galleryImages.length > 1 && (
              <div
                className="
                  absolute
                  bottom-5
                  left-1/2
                  z-[10001]
                  -translate-x-1/2
                  rounded-full
                  bg-black/60
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-sm
                "
              >
                {activeImageIndex + 1} /{" "}
                {galleryImages.length}
              </div>
            )}
          </div>
        )}
    </>
  );
};

export default Alumni;

