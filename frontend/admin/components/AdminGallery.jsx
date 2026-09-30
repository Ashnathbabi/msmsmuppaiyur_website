import React, { useEffect, useState } from "react";

import {
  Plus,
  ImagePlus,
  Trash2,
  Power,
  X,
  Upload,
  Images,
} from "lucide-react";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || ""
)
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

const apiUrl = (endpoint) => {
  return `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
};

// =====================================================
// COMPONENT
// =====================================================

const GalleryAdmin = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [years, setYears] = useState([]);
  const [events, setEvents] = useState([]);

  const [generalImages, setGeneralImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Loading
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingGeneralImages, setLoadingGeneralImages] =
    useState(false);

  // Saving
  const [savingYear, setSavingYear] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Error
  const [error, setError] = useState("");

  // =====================================================
  // MODALS
  // =====================================================

  const [showYearModal, setShowYearModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const [yearName, setYearName] = useState("");
  const [eventName, setEventName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // general = main 4 images
  // event = event images
  const [uploadMode, setUploadMode] = useState("general");

  // =====================================================
  // RESPONSE HELPER
  // =====================================================

  const getResponseData = async (response) => {
    const contentType =
      response.headers.get("content-type") || "";

    const responseText = await response.text();

    if (!contentType.includes("application/json")) {
      if (
        responseText.trim().startsWith("<!doctype") ||
        responseText.trim().startsWith("<html") ||
        responseText.trim().startsWith("<")
      ) {
        throw new Error(
          `API returned HTML instead of JSON. Status: ${response.status}`
        );
      }

      throw new Error(
        responseText ||
          `Server returned unexpected response. Status: ${response.status}`
      );
    }

    let data = {};

    try {
      data = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      throw new Error(
        "Server returned invalid JSON response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    const value = String(imagePath).trim();

    // Already full URL
    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const cleanPath = value.replace(/^\/+/, "");

    if (cleanPath.startsWith("uploads/")) {
      return `${API_BASE_URL}/${cleanPath}`;
    }

    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  // =====================================================
  // LOAD ACADEMIC YEARS
  // =====================================================

  const loadYears = async () => {
    try {
      setLoadingYears(true);
      setError("");

      const url = apiUrl("/api/years");

      console.log("Loading years:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await getResponseData(response);

      console.log("Years API response:", data);

      setYears(data.years || []);

      // Automatically select first year
      if (data.years?.length > 0) {
        setSelectedYear(data.years[0]);
      }
    } catch (error) {
      console.error("Load years error:", error);

      setYears([]);

      setError(
        error.message || "Failed to load academic years"
      );
    } finally {
      setLoadingYears(false);
    }
  };

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  const loadEvents = async (yearId) => {
    if (!yearId) {
      setEvents([]);
      return;
    }

    try {
      setLoadingEvents(true);
      setError("");

      const url = apiUrl(
        `/api/years/${yearId}/events`
      );

      console.log("Loading events:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await getResponseData(response);

      console.log("Events API response:", data);

      setEvents(data.events || []);

      // Clear old event
      setSelectedEvent(null);
      setGalleryImages([]);
    } catch (error) {
      console.error("Load events error:", error);

      setEvents([]);
      setSelectedEvent(null);
      setGalleryImages([]);

      setError(
        error.message || "Failed to load events"
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  // =====================================================
  // LOAD GENERAL IMAGES
  // =====================================================

  const loadGeneralImages = async () => {
    try {
      setLoadingGeneralImages(true);

      const url = apiUrl(
        `/api/general-images?_=${Date.now()}`
      );

      console.log(
        "Loading general images:",
        url
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await getResponseData(response);

      console.log(
        "General gallery response:",
        data
      );

      setGeneralImages(data.images || []);
    } catch (error) {
      console.error(
        "Load general images error:",
        error
      );

      setGeneralImages([]);

      setError(
        error.message ||
          "Failed to load general images"
      );
    } finally {
      setLoadingGeneralImages(false);
    }
  };

  // =====================================================
  // LOAD EVENT IMAGES
  // =====================================================

  const loadImages = async (eventId) => {
    if (!eventId) {
      setGalleryImages([]);
      return;
    }

    try {
      setLoadingImages(true);
      setError("");

      const url = apiUrl(
        `/api/events/${eventId}/images?_=${Date.now()}`
      );

      console.log(
        "Loading event images:",
        url
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await getResponseData(response);

      console.log(
        "Event images response:",
        data
      );

      setGalleryImages(data.images || []);
    } catch (error) {
      console.error(
        "Load event images error:",
        error
      );

      setGalleryImages([]);

      setError(
        error.message ||
          "Failed to load event images"
      );
    } finally {
      setLoadingImages(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadYears();
    loadGeneralImages();
  }, []);

  // =====================================================
  // YEAR CHANGE
  // =====================================================

  useEffect(() => {
    if (!selectedYear?.id) {
      setEvents([]);
      setSelectedEvent(null);
      setGalleryImages([]);
      return;
    }

    loadEvents(selectedYear.id);
  }, [selectedYear?.id]);

  // =====================================================
  // EVENT CHANGE
  // =====================================================

  useEffect(() => {
    if (!selectedEvent?.id) {
      setGalleryImages([]);
      return;
    }

    loadImages(selectedEvent.id);
  }, [selectedEvent?.id]);

  // =====================================================
  // CREATE YEAR
  // =====================================================

  const createYear = async (e) => {
    e.preventDefault();

    if (!yearName.trim()) {
      setError("Please enter academic year.");
      return;
    }

    try {
      setSavingYear(true);
      setError("");

      const response = await fetch(
        apiUrl("/api/admin/years"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            year_name: yearName.trim(),
            is_active: 1,
          }),
        }
      );

      const data =
        await getResponseData(response);

      console.log(
        "Create year response:",
        data
      );

      setYearName("");
      setShowYearModal(false);

      await loadYears();
    } catch (error) {
      console.error(
        "Create year error:",
        error
      );

      setError(
        error.message ||
          "Failed to create year."
      );
    } finally {
      setSavingYear(false);
    }
  };

  // =====================================================
  // TOGGLE YEAR STATUS
  // =====================================================

  const toggleYearStatus = async (year) => {
    const newStatus =
      Number(year.is_active) === 1
        ? 0
        : 1;

    try {
      setError("");

      const response = await fetch(
        apiUrl(
          `/api/admin/years/${year.id}/status`
        ),
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      await getResponseData(response);

      setYears((prev) =>
        prev.map((item) =>
          Number(item.id) ===
          Number(year.id)
            ? {
                ...item,
                is_active: newStatus,
              }
            : item
        )
      );

      if (
        Number(selectedYear?.id) ===
        Number(year.id)
      ) {
        setSelectedYear((prev) =>
          prev
            ? {
                ...prev,
                is_active: newStatus,
              }
            : prev
        );
      }
    } catch (error) {
      console.error(
        "Toggle year error:",
        error
      );

      setError(
        error.message ||
          "Failed to update year."
      );
    }
  };

  // =====================================================
  // CREATE EVENT
  // =====================================================

  const createEvent = async (e) => {
    e.preventDefault();

    if (!selectedYear?.id) {
      setError("Please select a year.");
      return;
    }

    if (!eventName.trim()) {
      setError("Please enter event name.");
      return;
    }

    try {
      setSavingEvent(true);
      setError("");

      const response = await fetch(
        apiUrl("/api/admin/events"),
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            academic_year_id:
              selectedYear.id,
            event_name:
              eventName.trim(),
            is_active: 1,
          }),
        }
      );

      const data =
        await getResponseData(response);

      console.log(
        "Create event response:",
        data
      );

      setEventName("");
      setShowEventModal(false);

      await loadEvents(selectedYear.id);
    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      setError(
        error.message ||
          "Failed to create event."
      );
    } finally {
      setSavingEvent(false);
    }
  };

  // =====================================================
  // TOGGLE EVENT STATUS
  // =====================================================

  const toggleEventStatus = async (event) => {
    const newStatus =
      Number(event.is_active) === 1
        ? 0
        : 1;

    try {
      setError("");

      const response = await fetch(
        apiUrl(
          `/api/admin/events/${event.id}/status`
        ),
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      await getResponseData(response);

      setEvents((prev) =>
        prev.map((item) =>
          Number(item.id) ===
          Number(event.id)
            ? {
                ...item,
                is_active: newStatus,
              }
            : item
        )
      );

      if (
        Number(selectedEvent?.id) ===
        Number(event.id)
      ) {
        setSelectedEvent((prev) =>
          prev
            ? {
                ...prev,
                is_active: newStatus,
              }
            : prev
        );
      }
    } catch (error) {
      console.error(
        "Toggle event error:",
        error
      );

      setError(
        error.message ||
          "Failed to update event."
      );
    }
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const maxSize =
      10 * 1024 * 1024;

    let validFiles = files.filter(
      (file) =>
        validTypes.includes(file.type) &&
        file.size <= maxSize
    );

    if (uploadMode === "general") {
      const remainingSlots = Math.max(
        0,
        4 - generalImages.length
      );

      if (remainingSlots === 0) {
        setError(
          "Main gallery already has 4 images. Delete an image before uploading."
        );

        setSelectedFiles([]);
        e.target.value = "";
        return;
      }

      if (
        validFiles.length >
        remainingSlots
      ) {
        validFiles =
          validFiles.slice(
            0,
            remainingSlots
          );

        setError(
          `Only ${remainingSlots} more image${
            remainingSlots > 1
              ? "s"
              : ""
          } can be uploaded. Maximum is 4.`
        );
      } else if (
        validFiles.length !==
        files.length
      ) {
        setError(
          "Only JPG, JPEG, PNG, WEBP and GIF images up to 10MB are allowed."
        );
      } else {
        setError("");
      }
    } else {
      if (
        validFiles.length !==
        files.length
      ) {
        setError(
          "Some files were skipped. Only JPG, JPEG, PNG, WEBP and GIF images up to 10MB are allowed."
        );
      } else {
        setError("");
      }
    }

    setSelectedFiles(validFiles);

    e.target.value = "";
  };

  // =====================================================
  // UPLOAD IMAGES
  // =====================================================

  const uploadImages = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError("Please select images.");
      return;
    }

    // ===================================================
    // GENERAL IMAGES
    // ===================================================

    if (uploadMode === "general") {
      const totalAfterUpload =
        generalImages.length +
        selectedFiles.length;

      if (totalAfterUpload > 4) {
        setError(
          "Main gallery can contain maximum 4 images."
        );
        return;
      }

      try {
        setUploading(true);
        setError("");

        const formData =
          new FormData();

        formData.append(
          "gallery_type",
          "inner"
        );

        selectedFiles.forEach((file) => {
          formData.append(
            "images",
            file
          );
        });

        const response = await fetch(
          apiUrl(
            "/api/admin/upload"
          ),
          {
            method: "POST",
            body: formData,
          }
        );

        const data =
          await getResponseData(
            response
          );

        console.log(
          "General upload response:",
          data
        );

        setSelectedFiles([]);
        setShowUploadModal(false);

        await loadGeneralImages();
      } catch (error) {
        console.error(
          "General upload error:",
          error
        );

        setError(
          error.message ||
            "General image upload failed."
        );
      } finally {
        setUploading(false);
      }

      return;
    }

    // ===================================================
    // EVENT IMAGES
    // ===================================================

    if (!selectedYear?.id) {
      setError(
        "Please select a year."
      );
      return;
    }

    if (!selectedEvent?.id) {
      setError(
        "Please select an event."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData =
        new FormData();

      formData.append(
        "gallery_type",
        "inner"
      );

      formData.append(
        "academic_year_id",
        String(selectedYear.id)
      );

      formData.append(
        "event_id",
        String(selectedEvent.id)
      );

      selectedFiles.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      const response = await fetch(
        apiUrl(
          "/api/admin/upload"
        ),
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await getResponseData(
          response
        );

      console.log(
        "Event upload response:",
        data
      );

      setSelectedFiles([]);
      setShowUploadModal(false);

      await loadImages(
        selectedEvent.id
      );
    } catch (error) {
      console.error(
        "Event upload error:",
        error
      );

      setError(
        error.message ||
          "Event image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const deleteImage = async (
    image,
    type
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        apiUrl(
          `/api/admin/images/${image.id}`
        ),
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      await getResponseData(response);

      if (type === "general") {
        setGeneralImages((prev) =>
          prev.filter(
            (item) =>
              Number(item.id) !==
              Number(image.id)
          )
        );
      } else {
        setGalleryImages((prev) =>
          prev.filter(
            (item) =>
              Number(item.id) !==
              Number(image.id)
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete image error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete image."
      );
    }
  };

  // =====================================================
  // OPEN GENERAL UPLOAD
  // =====================================================

  const openGeneralUpload = () => {
    if (generalImages.length >= 4) {
      setError(
        "Main gallery already has 4 images."
      );
      return;
    }

    setUploadMode("general");
    setSelectedFiles([]);
    setError("");
    setShowUploadModal(true);
  };

  // =====================================================
  // OPEN EVENT UPLOAD
  // =====================================================

  const openEventUpload = () => {
    if (!selectedEvent?.id) {
      setError(
        "Please select an event first."
      );
      return;
    }

    setUploadMode("event");
    setSelectedFiles([]);
    setError("");
    setShowUploadModal(true);
  };

  // =====================================================
  // CLOSE UPLOAD MODAL
  // =====================================================

  const closeUploadModal = () => {
    if (uploading) {
      return;
    }

    setSelectedFiles([]);
    setShowUploadModal(false);
  };

  // =====================================================
  // RENDER IMAGE CARD
  // =====================================================

  const renderImageCard = (
    image,
    fallbackAlt = "Gallery Image",
    type = "event"
  ) => {
    const imageSource =
      image.image_url ||
      image.image ||
      image.file_path ||
      image.path ||
      "";

    const imageAlt =
      image.alt_text ||
      image.title ||
      image.event_name ||
      fallbackAlt;

    return (
      <div
        key={image.id}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
          {imageSource ? (
            <img
              src={getImageUrl(imageSource)}
              alt={imageAlt}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Image not available
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="mb-3 truncate text-xs text-gray-500">
            {imageAlt}
          </p>

          <button
            type="button"
            onClick={() =>
              deleteImage(
                image,
                type
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={15} />
            Delete Image
          </button>
        </div>
      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 sm:p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-[#050734]">
              Gallery Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage main gallery images,
              academic years, events and
              event gallery images.
            </p>
          </div>

          <button
            type="button"
            onClick={openGeneralUpload}
            disabled={
              generalImages.length >= 4
            }
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e71b93] px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload size={18} />
            Upload Main Images
          </button>

        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-4"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* =================================================
          MAIN 3 COLUMN
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_330px_minmax(0,1fr)]">

        {/* =================================================
            LEFT - YEARS
        ================================================= */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-lg font-bold text-[#050734]">
              Academic Years
            </h2>

            <button
              type="button"
              onClick={() => {
                setYearName("");
                setError("");
                setShowYearModal(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e71b93] text-white hover:bg-black"
            >
              <Plus size={18} />
            </button>

          </div>

          {loadingYears ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading years...
            </div>
          ) : years.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              No academic years found.
            </div>
          ) : (
            <div className="space-y-3">

              {years.map((year) => {

                const active =
                  Number(
                    selectedYear?.id
                  ) ===
                  Number(year.id);

                const isEnabled =
                  Number(
                    year.is_active
                  ) === 1;

                return (
                  <div
                    key={year.id}
                    className={`rounded-xl border p-3 transition ${
                      active
                        ? "border-[#e71b93] bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(year);
                        setSelectedEvent(null);
                        setGalleryImages([]);
                      }}
                      className="w-full text-left"
                    >

                      <div className="flex items-center justify-between gap-2">

                        <span className="font-bold text-gray-800">
                          {year.year_name}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                            isEnabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isEnabled
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleYearStatus(year)
                      }
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                        isEnabled
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      <Power size={14} />

                      {isEnabled
                        ? "Disable"
                        : "Enable"}
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* =================================================
            MIDDLE - EVENTS
        ================================================= */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-[#050734]">
                Events
              </h2>

              {selectedYear && (
                <p className="mt-1 text-xs text-gray-500">
                  {selectedYear.year_name}
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!selectedYear}
              onClick={() => {
                setEventName("");
                setError("");
                setShowEventModal(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e71b93] text-white hover:bg-black disabled:opacity-40"
            >
              <Plus size={18} />
            </button>

          </div>

          {!selectedYear ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              Select a year.
            </div>
          ) : loadingEvents ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              No events found.
            </div>
          ) : (
            <div className="space-y-3">

              {events.map((event) => {

                const active =
                  Number(
                    selectedEvent?.id
                  ) ===
                  Number(event.id);

                const isEnabled =
                  Number(
                    event.is_active
                  ) === 1;

                return (
                  <div
                    key={event.id}
                    className={`rounded-xl border p-3 ${
                      active
                        ? "border-[#e71b93] bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEvent(event)
                      }
                      className="w-full text-left"
                    >

                      <div className="flex items-start justify-between gap-2">

                        <span className="font-semibold text-gray-800">
                          {event.event_name}
                        </span>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                            isEnabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isEnabled
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleEventStatus(event)
                      }
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                        isEnabled
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      <Power size={14} />

                      {isEnabled
                        ? "Disable Event"
                        : "Enable Event"}
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* =================================================
            RIGHT - GALLERY
        ================================================= */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          {/* =================================================
              MAIN GALLERY
          ================================================= */}

          {!selectedEvent && (
            <div>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[#050734]">
                    <Images size={20} />
                    Main Gallery Images
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Maximum 4 separate images.
                    No year or event required.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openGeneralUpload}
                  disabled={
                    generalImages.length >= 4
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e71b93] px-4 py-2.5 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Upload size={17} />
                  Upload
                </button>

              </div>

              {loadingGeneralImages ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  Loading main images...
                </div>
              ) : generalImages.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">

                  <ImagePlus
                    size={50}
                    className="mb-4 text-[#e71b93]"
                  />

                  <p className="text-lg font-bold text-gray-700">
                    No main images
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Upload maximum 4 images.
                  </p>

                  <button
                    type="button"
                    onClick={openGeneralUpload}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e71b93] px-5 py-3 text-sm font-bold text-white hover:bg-black"
                  >
                    <Upload size={17} />
                    Upload Images
                  </button>

                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {generalImages.map((image) =>
                    renderImageCard(
                      image,
                      "Main Gallery Image",
                      "general"
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* =================================================
              EVENT GALLERY
          ================================================= */}

          {selectedEvent && (
            <div>

              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[#050734]">
                    <Images size={20} />
                    Event Gallery Images
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {selectedYear?.year_name}
                    {" / "}
                    {selectedEvent.event_name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openEventUpload}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e71b93] px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
                >
                  <Upload size={17} />
                  Upload Images
                </button>

              </div>

              {loadingImages ? (
                <div className="flex min-h-[350px] items-center justify-center text-sm text-gray-500">
                  Loading event images...
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">

                  <ImagePlus
                    size={45}
                    className="mb-3 text-gray-300"
                  />

                  <p className="font-semibold text-gray-600">
                    No event images
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Upload images for this event.
                  </p>

                  <button
                    type="button"
                    onClick={openEventUpload}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e71b93] px-5 py-3 text-sm font-bold text-white hover:bg-black"
                  >
                    <Upload size={17} />
                    Upload Images
                  </button>

                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">

                  {galleryImages.map((image) =>
                    renderImageCard(
                      image,
                      selectedEvent.event_name,
                      "event"
                    )
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          YEAR MODAL
      ===================================================== */}

      {showYearModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={() =>
            setShowYearModal(false)
          }
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-xl font-bold text-[#050734]">
                Add Academic Year
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowYearModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <form onSubmit={createYear}>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Academic Year
              </label>

              <input
                type="text"
                value={yearName}
                onChange={(e) =>
                  setYearName(
                    e.target.value
                  )
                }
                placeholder="Example: 2027 - 2028"
                autoFocus
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

              <button
                type="submit"
                disabled={
                  savingYear ||
                  !yearName.trim()
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e71b93] px-5 py-3 font-bold text-white hover:bg-black disabled:opacity-50"
              >
                <Plus size={17} />

                {savingYear
                  ? "Saving..."
                  : "Create Year"}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          EVENT MODAL
      ===================================================== */}

      {showEventModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={() =>
            setShowEventModal(false)
          }
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-[#050734]">
                  Add Event
                </h3>

                {selectedYear && (
                  <p className="mt-1 text-xs text-gray-500">
                    Year:{" "}
                    {selectedYear.year_name}
                  </p>
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEventModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <form onSubmit={createEvent}>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Name
              </label>

              <input
                type="text"
                value={eventName}
                onChange={(e) =>
                  setEventName(
                    e.target.value
                  )
                }
                placeholder="Example: Annual Day"
                autoFocus
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

              <button
                type="submit"
                disabled={
                  savingEvent ||
                  !eventName.trim()
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e71b93] px-5 py-3 font-bold text-white hover:bg-black disabled:opacity-50"
              >
                <Plus size={17} />

                {savingEvent
                  ? "Saving..."
                  : "Create Event"}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      {showUploadModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={closeUploadModal}
        >

          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-[#050734]">
                  {uploadMode === "event"
                    ? "Upload Event Images"
                    : "Upload Main Images"}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {uploadMode === "event"
                    ? `${selectedYear?.year_name || ""} / ${
                        selectedEvent?.event_name || ""
                      }`
                    : "Separate gallery images - no year/event required"}
                </p>

              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <form onSubmit={uploadImages}>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-[#e71b93]">

                <ImagePlus
                  size={45}
                  className="mb-3 text-[#e71b93]"
                />

                <span className="text-sm font-bold text-gray-700">
                  Select Images
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  JPG, JPEG, PNG, WEBP, GIF
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  Maximum 10MB per image
                </span>

                {uploadMode === "general" && (
                  <>
                    <span className="mt-2 text-xs font-bold text-[#e71b93]">
                      {generalImages.length}/4
                      images used
                    </span>

                    <span className="mt-1 text-xs text-gray-400">
                      Maximum 4 images total
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

              {/* Selected Files */}

              {selectedFiles.length > 0 && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">

                  <p className="mb-3 text-sm font-bold text-gray-700">
                    {selectedFiles.length}{" "}
                    image
                    {selectedFiles.length > 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>

                  <div className="max-h-40 space-y-2 overflow-y-auto">

                    {selectedFiles.map(
                      (file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2"
                        >

                          <span className="max-w-[80%] truncate text-xs text-gray-600">
                            {file.name}
                          </span>

                          <span className="text-[10px] text-gray-400">
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </span>

                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  uploading ||
                  selectedFiles.length === 0
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e71b93] px-5 py-3 font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload size={17} />

                {uploading
                  ? "Uploading..."
                  : `Upload ${
                      selectedFiles.length || ""
                    } Images`}
              </button>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;