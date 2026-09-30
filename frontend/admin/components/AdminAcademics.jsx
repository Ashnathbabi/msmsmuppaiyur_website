import React, { useEffect, useState } from "react";

/* =========================================================
   API URL
========================================================= */

const API_ROOT =
  import.meta.env.VITE_API_URL || "";

const API_URL = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm = {
  id: null,
  page_slug: "",
  page_title: "",
  description: "",
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminAcademics = () => {
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     GET ALL ACADEMIC PAGES
  ======================================================= */

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/academics`);

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error("ACADEMICS API NON JSON:", text);

        throw new Error(
          "Server returned an invalid response. Please check the API route."
        );
      }

      const result = await response.json();

      console.log("ACADEMICS LIST RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch academic pages."
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to load academic pages."
        );
      }

      setPages(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error("FETCH ACADEMICS ERROR:", err);

      setError(
        err.message ||
          "Unable to load academic pages."
      );

      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchPages();
  }, []);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  /* =======================================================
     SLUG AUTO GENERATE FROM TITLE
     
     Example:
     "School Activities" -> "school-activities"
  ======================================================= */

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /* =======================================================
     TITLE CHANGE
     
     Automatically generate slug only while creating
     a new page.
  ======================================================= */

  const handleTitleChange = (e) => {
    const title = e.target.value;

    setForm((prev) => ({
      ...prev,
      page_title: title,
      ...(prev.id
        ? {}
        : {
            page_slug: generateSlug(title),
          }),
    }));

    setMessage("");
    setError("");
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (page) => {
    setForm({
      id: page.id,
      page_slug: page.page_slug || "",
      page_title: page.page_title || "",
      description: page.description || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     NEW PAGE
  ======================================================= */

  const handleNew = () => {
    setForm({
      ...emptyForm,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SAVE / UPDATE
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!form.page_title?.trim()) {
      setError("Sidebar heading / title is required.");
      return;
    }

    if (!form.page_slug?.trim()) {
      setError("Page slug is required.");
      return;
    }

    /* -----------------------------------------------------
       SLUG VALIDATION
    ----------------------------------------------------- */

    const cleanSlug = form.page_slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    if (!cleanSlug) {
      setError(
        "Please enter a valid page slug."
      );
      return;
    }

    /* -----------------------------------------------------
       CHECK DUPLICATE SLUG
    ----------------------------------------------------- */

    const duplicatePage = pages.find(
      (page) =>
        page.page_slug === cleanSlug &&
        page.id !== form.id
    );

    if (duplicatePage) {
      setError(
        "This page slug already exists. Please use a different slug."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        page_slug: cleanSlug,

        page_title:
          form.page_title.trim(),

        description:
          form.description?.trim() || "",
      };

      console.log(
        "ACADEMICS SAVE PAYLOAD:",
        payload
      );

      let response;

      /* ===================================================
         UPDATE
      =================================================== */

      if (form.id) {
        response = await fetch(
          `${API_URL}/academics/${form.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      /* ===================================================
         CREATE
      =================================================== */

      else {
        response = await fetch(
          `${API_URL}/academics`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.text();

        console.error(
          "SAVE API NON JSON:",
          text
        );

        throw new Error(
          "Server returned an invalid response. Please check the backend route."
        );
      }

      const result =
        await response.json();

      console.log(
        "ACADEMICS SAVE RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save academic page."
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to save academic page."
        );
      }

      /* ---------------------------------------------------
         SUCCESS
      --------------------------------------------------- */

      setMessage(
        form.id
          ? "Academic sidebar page updated successfully."
          : "Academic sidebar page added successfully."
      );

      /* ---------------------------------------------------
         RESET
      --------------------------------------------------- */

      setForm({
        ...emptyForm,
      });

      /* ---------------------------------------------------
         REFRESH
      --------------------------------------------------- */

      await fetchPages();
    } catch (err) {
      console.error(
        "SAVE ACADEMICS ERROR:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this sidebar page?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/academics/${id}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.text();

        console.error(
          "DELETE API NON JSON:",
          text
        );

        throw new Error(
          "Server returned an invalid response."
        );
      }

      const result =
        await response.json();

      console.log(
        "DELETE ACADEMICS RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete page."
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to delete page."
        );
      }

      setMessage(
        "Academic sidebar page deleted successfully."
      );

      if (form.id === id) {
        setForm({
          ...emptyForm,
        });
      }

      await fetchPages();
    } catch (err) {
      console.error(
        "DELETE ACADEMICS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to delete academic page."
      );
    }
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gray-50
        p-4
        sm:p-6
        lg:p-8
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
              sm:text-3xl
            "
          >
            Academics
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Add and manage your Academics
            sidebar pages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNew}
          className="
            w-full
            rounded-md
            bg-[#700515]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#580411]
            sm:w-auto
          "
        >
          + Add New Sidebar
        </button>
      </div>

      {/* ===================================================
          SUCCESS
      =================================================== */}

      {message && (
        <div
          className="
            mb-5
            rounded-md
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            font-medium
            text-green-700
          "
        >
          {message}
        </div>
      )}

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div
          className="
            mb-5
            rounded-md
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* ===================================================
          FORM CARD
      =================================================== */}

      <div
        className="
          mb-6
          rounded-xl
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >
        {/* FORM HEADER */}

        <div
          className="
            mb-6
            border-b
            border-gray-200
            pb-4
          "
        >
          <h3
            className="
              text-xl
              font-semibold
              text-gray-800
            "
          >
            {form.id
              ? "Edit Sidebar Page"
              : "Add Sidebar Page"}
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Create your own sidebar heading
            and page content.
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* =================================================
              PAGE TITLE + SLUG
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            {/* PAGE TITLE */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Sidebar Heading / Title

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="page_title"
                value={form.page_title}
                onChange={handleTitleChange}
                placeholder="Example: School Activities"
                maxLength={255}
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-[#700515]
                  focus:ring-1
                  focus:ring-[#700515]
                "
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-gray-400
                "
              >
                This heading will appear in
                the public Academics sidebar.
              </p>
            </div>

            {/* PAGE SLUG */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Page Slug

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="page_slug"
                value={form.page_slug}
                onChange={handleChange}
                placeholder="school-activities"
                maxLength={255}
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-[#700515]
                  focus:ring-1
                  focus:ring-[#700515]
                "
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-gray-400
                "
              >
                Use lowercase letters and
                hyphens only. Example:
                school-activities
              </p>
            </div>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="mt-5">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter page content..."
              rows={12}
              className="
                w-full
                resize-y
                rounded-md
                border
                border-gray-300
                px-4
                py-3
                text-sm
                leading-6
                text-gray-700
                outline-none
                transition
                focus:border-[#700515]
                focus:ring-1
                focus:ring-[#700515]
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              This content will be displayed
              on the selected public page.
            </p>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            className="
              mt-7
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={handleNew}
              disabled={saving}
              className="
                rounded-md
                border
                border-gray-300
                bg-white
                px-6
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                rounded-md
                bg-[#700515]
                px-7
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#580411]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving
                ? "Saving..."
                : form.id
                ? "Update"
                : "Save Sidebar"}
            </button>
          </div>
        </form>
      </div>

      {/* ===================================================
          LIST CARD
      =================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          bg-white
          shadow-sm
        "
      >
        {/* LIST HEADER */}

        <div
          className="
            border-b
            border-gray-200
            p-5
            sm:p-6
          "
        >
          <h3
            className="
              text-xl
              font-semibold
              text-gray-800
            "
          >
            Academic Sidebar Pages
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage the headings displayed
            in the public Academics sidebar.
          </p>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            className="
              flex
              items-center
              justify-center
              px-5
              py-14
            "
          >
            <div
              className="
                h-8
                w-8
                animate-spin
                rounded-full
                border-4
                border-gray-200
                border-t-[#700515]
              "
            />
          </div>
        ) : pages.length === 0 ? (
          /* EMPTY */

          <div
            className="
              px-5
              py-14
              text-center
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-gray-500
              "
            >
              No sidebar pages found.
            </p>

            <button
              type="button"
              onClick={() =>
    navigate("/admin/add-sidebar")
  }
              className="
                mt-4
                rounded-md
                bg-[#700515]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#580411]
              "
            >
              Add Sidebar Page
            </button>
          </div>
        ) : (
          /* TABLE */

          <div className="overflow-x-auto">
            <table
              className="
                min-w-[900px]
                w-full
                divide-y
                divide-gray-200
              "
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    #
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Page Slug
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Sidebar Heading
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Description
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Updated
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                    "
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody
                className="
                  divide-y
                  divide-gray-100
                  bg-white
                "
              >
                {pages.map(
                  (page, index) => (
                    <tr
                      key={page.id}
                      className="
                        transition
                        hover:bg-gray-50
                      "
                    >
                      {/* NUMBER */}

                      <td
                        className="
                          whitespace-nowrap
                          px-5
                          py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        {index + 1}
                      </td>

                      {/* SLUG */}

                      <td
                        className="
                          whitespace-nowrap
                          px-5
                          py-4
                        "
                      >
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-[#f7e9eb]
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-[#700515]
                          "
                        >
                          {page.page_slug}
                        </span>
                      </td>

                      {/* TITLE */}

                      <td
                        className="
                          max-w-[220px]
                          px-5
                          py-4
                          text-sm
                          font-semibold
                          text-gray-800
                        "
                      >
                        <div className="line-clamp-2">
                          {page.page_title ||
                            "-"}
                        </div>
                      </td>

                      {/* DESCRIPTION */}

                      <td
                        className="
                          max-w-[400px]
                          px-5
                          py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        <div className="line-clamp-3">
                          {page.description ||
                            "-"}
                        </div>
                      </td>

                      {/* UPDATED */}

                      <td
                        className="
                          whitespace-nowrap
                          px-5
                          py-4
                          text-sm
                          text-gray-500
                        "
                      >
                        {formatDate(
                          page.updated_at
                        )}
                      </td>

                      {/* ACTION */}

                      <td
                        className="
                          whitespace-nowrap
                          px-5
                          py-4
                        "
                      >
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                page
                              )
                            }
                            className="
                              rounded-md
                              bg-gray-100
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              text-gray-700
                              transition
                              hover:bg-gray-200
                            "
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                page.id
                              )
                            }
                            className="
                              rounded-md
                              bg-red-50
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              text-red-600
                              transition
                              hover:bg-red-100
                            "
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAcademics;