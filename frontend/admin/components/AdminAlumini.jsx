import React, { useEffect, useState } from "react";
import API from "../../src/services/api";

const AlumniAdmin = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [students, setStudents] = useState([]);

  // GLOBAL ALUMNI GALLERY
  // Gallery is NOT connected to academic year
  const [gallery, setGallery] = useState([]);

  const [yearForm, setYearForm] = useState({
    year_name: "",
    slug: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    course: "",
    contact: "",
  });

  const [galleryForm, setGalleryForm] = useState({
    image: null,
    alt_text: "",
  });

  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingStudents, setLoadingStudents] =
    useState(false);
  const [loadingGallery, setLoadingGallery] =
    useState(false);

  const [savingYear, setSavingYear] = useState(false);
  const [savingStudent, setSavingStudent] =
    useState(false);
  const [savingGallery, setSavingGallery] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // CLEAR MESSAGES
  // =========================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // =========================================================
  // CREATE SLUG
  // =========================================================

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    // Backend returned full URL
    if (typeof image === "string") {
      if (
        image.startsWith("http://") ||
        image.startsWith("https://")
      ) {
        return image;
      }

      const baseURL =
        (API.defaults?.baseURL || "").replace(/\/api$/, "");

      const cleanBaseURL =
        baseURL.replace(/\/+$/, "");

      const cleanImage = image.startsWith("/")
        ? image
        : `/${image}`;

      return `${cleanBaseURL}${cleanImage}`;
    }

    // Backend returned object
    const imagePath =
      image.url ||
      image.image_url ||
      image.imageUrl ||
      image.path ||
      image.file ||
      image.src ||
      image.image;

    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const baseURL =
      (API.defaults?.baseURL || "").replace(/\/api$/, "");

    const cleanBaseURL =
      baseURL.replace(/\/+$/, "");

    const cleanImage =
      imagePath.startsWith("/")
        ? imagePath
        : `/${imagePath}`;

    return `${cleanBaseURL}${cleanImage}`;
  };

  // =========================================================
  // GET ALL ACADEMIC YEARS
  // =========================================================

  const fetchYears = async () => {
    try {
      setLoadingYears(true);

      const response = await API.get(
        "/alumni/years"
      );

      console.log(
        "ACADEMIC YEARS:",
        response.data
      );

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.years)
        ? response.data.years
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setYears(data);

      if (data.length > 0) {
        setSelectedYear((current) => {
          const exists = data.some(
            (year) =>
              Number(year.id) ===
              Number(current)
          );

          if (exists) {
            return current;
          }

          return String(data[0].id);
        });
      } else {
        setSelectedYear("");
        setStudents([]);
      }
    } catch (err) {
      console.error(
        "FETCH YEARS ERROR:",
        err
      );

      setYears([]);

      setError(
        err.response?.data?.message ||
          "Failed to load academic years"
      );
    } finally {
      setLoadingYears(false);
    }
  };

  // =========================================================
  // GET GLOBAL ALUMNI GALLERY
  //
  // IMPORTANT:
  // No academic year is required.
  // =========================================================

  const fetchGallery = async () => {
    try {
      setLoadingGallery(true);

      const response = await API.get(
        "/alumni/gallery"
      );

      console.log(
        "GLOBAL ALUMNI GALLERY:",
        response.data
      );

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (
        Array.isArray(response.data?.gallery)
      ) {
        data = response.data.gallery;
      } else if (
        Array.isArray(response.data?.images)
      ) {
        data = response.data.images;
      } else if (
        Array.isArray(response.data?.data)
      ) {
        data = response.data.data;
      } else if (
        Array.isArray(response.data?.data?.gallery)
      ) {
        data = response.data.data.gallery;
      } else if (
        Array.isArray(response.data?.data?.images)
      ) {
        data = response.data.data.images;
      }

      console.log(
        "FINAL GALLERY DATA:",
        data
      );

      setGallery(data);
    } catch (err) {
      console.error(
        "FETCH GALLERY ERROR:",
        err
      );

      setGallery([]);

      setError(
        err.response?.data?.message ||
          "Failed to load alumni gallery"
      );
    } finally {
      setLoadingGallery(false);
    }
  };

  // =========================================================
  // GET STUDENTS BY YEAR
  //
  // Students are still year based.
  // Gallery is NOT year based.
  // =========================================================

  const fetchYearStudents = async (yearId) => {
    if (!yearId) {
      setStudents([]);
      return;
    }

    const selectedYearObject =
      years.find(
        (year) =>
          Number(year.id) ===
          Number(yearId)
      );

    if (!selectedYearObject) {
      setStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);

      const response = await API.get(
        `/alumni/year/${selectedYearObject.slug}`
      );

      console.log(
        "YEAR STUDENT DATA:",
        response.data
      );

      const studentData =
        Array.isArray(
          response.data?.students
        )
          ? response.data.students
          : Array.isArray(
              response.data?.data?.students
            )
          ? response.data.data.students
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setStudents(studentData);
    } catch (err) {
      console.error(
        "FETCH STUDENTS ERROR:",
        err
      );

      setStudents([]);

      setError(
        err.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchYears();

    // IMPORTANT:
    // Gallery loads independently.
    fetchGallery();
  }, []);

  // =========================================================
  // LOAD STUDENTS WHEN YEAR CHANGES
  // =========================================================

  useEffect(() => {
    if (
      selectedYear &&
      years.length > 0
    ) {
      fetchYearStudents(
        selectedYear
      );
    } else {
      setStudents([]);
    }
  }, [selectedYear, years]);

  // =========================================================
  // YEAR FORM CHANGE
  // =========================================================

  const handleYearChange = (e) => {
    const { name, value } = e.target;

    setYearForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // STUDENT FORM CHANGE
  // =========================================================

  const handleStudentChange = (e) => {
    const { name, value } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // GALLERY FORM CHANGE
  // =========================================================

  const handleGalleryChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setGalleryForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));
    } else {
      setGalleryForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =========================================================
  // ADD ACADEMIC YEAR
  // =========================================================

  const addYear = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!yearForm.year_name.trim()) {
      setError(
        "Please enter academic year"
      );
      return;
    }

    try {
      setSavingYear(true);

      const yearName =
        yearForm.year_name.trim();

      const slug =
        yearForm.slug.trim() ||
        createSlug(yearName);

      const response = await API.post(
        "/alumni/years",
        {
          year_name: yearName,
          slug,
        }
      );

      console.log(
        "ADD YEAR RESPONSE:",
        response.data
      );

      setMessage(
        "Academic year added successfully"
      );

      setYearForm({
        year_name: "",
        slug: "",
      });

      await fetchYears();

      if (response.data?.id) {
        setSelectedYear(
          String(response.data.id)
        );
      }
    } catch (err) {
      console.error(
        "ADD YEAR ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to add academic year"
      );
    } finally {
      setSavingYear(false);
    }
  };

  // =========================================================
  // DELETE ACADEMIC YEAR
  // =========================================================

  const deleteYear = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this academic year?\n\nAll students belonging to this year may also be deleted."
      );

    if (!confirmDelete) return;

    clearMessages();

    try {
      setSavingYear(true);

      await API.delete(
        `/alumni/years/${id}`
      );

      setMessage(
        "Academic year deleted successfully"
      );

      const remainingYears =
        years.filter(
          (year) =>
            Number(year.id) !==
            Number(id)
        );

      setYears(remainingYears);

      if (remainingYears.length > 0) {
        setSelectedYear(
          String(
            remainingYears[0].id
          )
        );
      } else {
        setSelectedYear("");
        setStudents([]);
      }
    } catch (err) {
      console.error(
        "DELETE YEAR ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete academic year"
      );
    } finally {
      setSavingYear(false);
    }
  };

  // =========================================================
  // ADD STUDENT
  // =========================================================

  const addStudent = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!selectedYear) {
      setError(
        "Please select an academic year"
      );
      return;
    }

    if (!studentForm.name.trim()) {
      setError(
        "Student name is required"
      );
      return;
    }

    try {
      setSavingStudent(true);

      await API.post(
        "/alumni/students",
        {
          academic_year_id:
            Number(selectedYear),

          name:
            studentForm.name.trim(),

          course:
            studentForm.course.trim(),

          contact:
            studentForm.contact.trim(),
        }
      );

      setMessage(
        "Student added successfully"
      );

      setStudentForm({
        name: "",
        course: "",
        contact: "",
      });

      await fetchYearStudents(
        selectedYear
      );
    } catch (err) {
      console.error(
        "ADD STUDENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to add student"
      );
    } finally {
      setSavingStudent(false);
    }
  };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const deleteStudent = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this student?"
      );

    if (!confirmDelete) return;

    clearMessages();

    try {
      setLoadingStudents(true);

      await API.delete(
        `/alumni/students/${id}`
      );

      setMessage(
        "Student deleted successfully"
      );

      await fetchYearStudents(
        selectedYear
      );
    } catch (err) {
      console.error(
        "DELETE STUDENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete student"
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // =========================================================
  // ADD GLOBAL GALLERY IMAGE
  //
  // IMPORTANT:
  // academic_year_id is NOT sent.
  // =========================================================

  const addGallery = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!galleryForm.image) {
      setError(
        "Please select an image"
      );
      return;
    }

    try {
      setSavingGallery(true);

      const formData = new FormData();

      // DO NOT send academic_year_id
      // because gallery is global.

      formData.append(
        "image",
        galleryForm.image
      );

      formData.append(
        "alt_text",
        galleryForm.alt_text.trim()
      );

      console.log(
        "UPLOADING GLOBAL ALUMNI IMAGE"
      );

      const response = await API.post(
        "/alumni/gallery",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "ADD GALLERY RESPONSE:",
        response.data
      );

      setMessage(
        "Alumni gallery image added successfully"
      );

      setGalleryForm({
        image: null,
        alt_text: "",
      });

      // Reset file input
      const fileInput =
        document.getElementById(
          "gallery-image"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      // Refresh GLOBAL gallery
      await fetchGallery();
    } catch (err) {
      console.error(
        "ADD GALLERY ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Failed to upload gallery image"
      );
    } finally {
      setSavingGallery(false);
    }
  };

  // =========================================================
  // DELETE GLOBAL GALLERY IMAGE
  // =========================================================

  const deleteGallery = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this alumni gallery image?"
      );

    if (!confirmDelete) return;

    clearMessages();

    try {
      setLoadingGallery(true);

      await API.delete(
        `/alumni/gallery/${id}`
      );

      setMessage(
        "Gallery image deleted successfully"
      );

      await fetchGallery();
    } catch (err) {
      console.error(
        "DELETE GALLERY ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete gallery image"
      );
    } finally {
      setLoadingGallery(false);
    }
  };

  // =========================================================
  // SELECTED YEAR DATA
  // =========================================================

  const selectedYearData =
    years.find(
      (year) =>
        Number(year.id) ===
        Number(selectedYear)
    );

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-100 p-5 sm:p-10">
      <div className="mx-auto max-w-[1200px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#050734]">
            Alumni Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage academic years, students and global alumni gallery
          </p>
        </div>

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-700">
            {message}
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-600">
            {error}
          </div>
        )}

        {/* =====================================================
            ADD ACADEMIC YEAR
        ===================================================== */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-1 text-xl font-bold text-[#050734]">
            Add Academic Year
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Example: 2025 - 2026
          </p>

          <form
            onSubmit={addYear}
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
          >

            <input
              type="text"
              name="year_name"
              value={yearForm.year_name}
              onChange={handleYearChange}
              placeholder="2025 - 2026"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e71b93] focus:ring-1 focus:ring-[#e71b93]"
            />

            <input
              type="text"
              name="slug"
              value={yearForm.slug}
              onChange={handleYearChange}
              placeholder="2025-2026"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e71b93] focus:ring-1 focus:ring-[#e71b93]"
            />

            <button
              type="submit"
              disabled={savingYear}
              className="rounded-lg bg-[#e71b93] px-7 py-3 font-semibold text-white transition hover:bg-[#c9157d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingYear
                ? "Saving..."
                : "Add Year"}
            </button>

          </form>
        </div>

        {/* =====================================================
            ACADEMIC YEARS
        ===================================================== */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#050734]">
                Academic Years
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a year to manage students
              </p>
            </div>

            {loadingYears && (
              <span className="text-sm text-gray-500">
                Loading...
              </span>
            )}

          </div>

          {years.length === 0 ? (
            <div className="rounded-lg bg-gray-50 px-5 py-8 text-center text-gray-500">
              No academic years found.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {years.map((year) => {

                const isSelected =
                  Number(selectedYear) ===
                  Number(year.id);

                return (
                  <div
                    key={year.id}
                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-lg
                      border
                      p-4
                      transition
                      ${
                        isSelected
                          ? "border-[#e71b93] bg-pink-50"
                          : "border-gray-200 bg-gray-50"
                      }
                    `}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedYear(
                          String(year.id)
                        )
                      }
                      className={`
                        text-left
                        font-semibold
                        ${
                          isSelected
                            ? "text-[#e71b93]"
                            : "text-[#050734]"
                        }
                      `}
                    >
                      {year.year_name}
                    </button>

                    <button
                      type="button"
                      disabled={savingYear}
                      onClick={() =>
                        deleteYear(year.id)
                      }
                      className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                    >
                      Delete
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* =====================================================
            SELECT YEAR FOR STUDENTS
        ===================================================== */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <label className="mb-2 block font-semibold text-[#050734]">
            Select Academic Year
          </label>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93] focus:ring-1 focus:ring-[#e71b93]"
          >

            <option value="">
              Select Academic Year
            </option>

            {years.map((year) => (
              <option
                key={year.id}
                value={year.id}
              >
                {year.year_name}
              </option>
            ))}

          </select>

        </div>

        {/* =====================================================
            ADD STUDENT
        ===================================================== */}

        {selectedYear && (
          <form
            onSubmit={addStudent}
            className="mb-8 rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5">

              <h2 className="text-xl font-bold text-[#050734]">
                Add Student
              </h2>

              {selectedYearData && (
                <p className="mt-1 text-sm text-[#e71b93]">
                  Academic Year:{" "}
                  {selectedYearData.year_name}
                </p>
              )}

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <input
                type="text"
                name="name"
                value={studentForm.name}
                onChange={handleStudentChange}
                placeholder="Student Name"
                required
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

              <input
                type="text"
                name="course"
                value={studentForm.course}
                onChange={handleStudentChange}
                placeholder="Course / Designation"
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

              <input
                type="text"
                name="contact"
                value={studentForm.contact}
                onChange={handleStudentChange}
                placeholder="Contact Number"
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

            </div>

            <button
              type="submit"
              disabled={savingStudent}
              className="mt-5 rounded-lg bg-[#e71b93] px-6 py-3 font-semibold text-white transition hover:bg-[#c9157d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStudent
                ? "Adding..."
                : "Add Student"}
            </button>

          </form>
        )}

        {/* =====================================================
            GLOBAL ALUMNI GALLERY UPLOAD
        ===================================================== */}

        <form
          onSubmit={addGallery}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >

          <div className="mb-5">

            <h2 className="text-xl font-bold text-[#050734]">
              Add Alumni Gallery Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              These images will appear directly on the Alumni page.
              No academic year is required.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* IMAGE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select Image
              </label>

              <input
                id="gallery-image"
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleGalleryChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, JPEG, PNG or WEBP. Maximum 5MB.
              </p>

            </div>

            {/* ALT TEXT */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Image Alt Text
              </label>

              <input
                type="text"
                name="alt_text"
                value={galleryForm.alt_text}
                onChange={handleGalleryChange}
                placeholder="Alumni event"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

            </div>

          </div>

          {/* PREVIEW */}

          {galleryForm.image && (
            <div className="mt-5">

              <p className="mb-2 text-sm font-semibold text-gray-700">
                Preview
              </p>

              <img
                src={URL.createObjectURL(
                  galleryForm.image
                )}
                alt="Preview"
                className="h-40 w-40 rounded-lg border object-cover"
              />

            </div>
          )}

          <button
            type="submit"
            disabled={savingGallery}
            className="mt-5 rounded-lg bg-[#e71b93] px-6 py-3 font-semibold text-white transition hover:bg-[#c9157d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingGallery
              ? "Uploading..."
              : "Add Image"}
          </button>

        </form>

        {/* =====================================================
            GLOBAL ALUMNI GALLERY
        ===================================================== */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-[#050734]">
                Alumni Gallery
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                All images shown on the Alumni page
              </p>

            </div>

            {loadingGallery && (
              <span className="text-sm text-gray-500">
                Loading...
              </span>
            )}

          </div>

          {gallery.length === 0 ? (
            <div className="rounded-lg bg-gray-50 px-5 py-10 text-center text-gray-500">
              No alumni gallery images found.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

              {gallery.map(
                (item, index) => {

                  const imageSource =
                    item?.image ||
                    item?.image_url ||
                    item?.imageUrl ||
                    item?.url ||
                    item?.path ||
                    item?.file ||
                    item?.src;

                  const imageUrl =
                    getImageUrl(
                      imageSource
                    );

                  return (
                    <div
                      key={
                        item.id ||
                        item.gallery_id ||
                        index
                      }
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >

                      {/* IMAGE */}

                      <div className="aspect-square overflow-hidden bg-gray-100">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              item.alt_text ||
                              "Alumni"
                            }
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.error(
                                "IMAGE LOAD ERROR:",
                                imageUrl
                              );

                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-red-500">
                            Image URL not found
                          </div>
                        )}

                      </div>

                      {/* DETAILS */}

                      <div className="p-3">

                        {item.alt_text && (
                          <p className="mb-3 truncate text-sm text-gray-600">
                            {item.alt_text}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteGallery(
                              item.id ||
                                item.gallery_id
                            )
                          }
                          disabled={
                            loadingGallery
                          }
                          className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          Delete Image
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* =====================================================
            STUDENTS TABLE
        ===================================================== */}

        <div className="overflow-x-auto rounded-xl bg-white shadow">

          <div className="border-b px-6 py-5">

            <h2 className="text-xl font-bold text-[#050734]">
              Students
            </h2>

            {selectedYearData && (
              <p className="mt-1 text-sm text-gray-500">
                {selectedYearData.year_name}
              </p>
            )}

          </div>

          <table className="w-full min-w-[700px]">

            <thead>

              <tr className="bg-[#050734] text-white">

                <th className="px-5 py-4 text-left">
                  Name
                </th>

                <th className="px-5 py-4 text-left">
                  Course
                </th>

                <th className="px-5 py-4 text-left">
                  Contact
                </th>

                <th className="px-5 py-4 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loadingStudents ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading students...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map(
                  (student) => (
                    <tr
                      key={
                        student.id
                      }
                      className="border-b border-gray-200 transition hover:bg-pink-50"
                    >

                      <td className="px-5 py-4 font-semibold text-[#050734]">
                        {student.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {student.course ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {student.contact ||
                          "-"}
                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            deleteStudent(
                              student.id
                            )
                          }
                          className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    {selectedYear
                      ? "No students found for this academic year."
                      : "Select an academic year."}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
};

export default AlumniAdmin;
