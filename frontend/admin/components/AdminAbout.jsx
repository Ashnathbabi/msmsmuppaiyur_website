
import React, { useEffect, useState } from "react";

const API_ROOT =
  import.meta.env.VITE_API_URL || "";

const API_URL = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;


// ======================================================
// IMAGE SERVER URL
// ======================================================

const SERVER_URL = API_ROOT.replace(/\/api$/, "");


// ======================================================
// ADMIN ABOUT
// ======================================================

const AdminAbout = () => {

  // ====================================================
  // FORM DATA
  // ====================================================

  const [form, setForm] = useState({
    id: "",
    badge_title: "About School",
    heading: "",
    description: "",
    main_image: "",
    about_bg: "",
    elements_image: "",
    sub_logo: "",
    status: 1,
  });


  // ====================================================
  // SELECTED IMAGE FILES
  // ====================================================

  const [files, setFiles] = useState({
    main_image: null,
    about_bg: null,
    elements_image: null,
    sub_logo: null,
  });


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // ====================================================
  // GET IMAGE URL
  // ====================================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    // Already full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Server relative path
    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    return `${SERVER_URL}/${image}`;
  };


  // ====================================================
  // GET PREVIEW URL
  // ====================================================

  const getPreviewUrl = (fieldName) => {

    // Newly selected image
    if (files[fieldName]) {
      return URL.createObjectURL(files[fieldName]);
    }

    // Existing database image
    return getImageUrl(form[fieldName]);
  };


  // ====================================================
  // FETCH ABOUT
  // ====================================================

  useEffect(() => {

    fetchAbout();

  }, []);


  const fetchAbout = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/about/admin`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status}`
        );
      }

      const result = await response.json();

      console.log("ABOUT ADMIN RESPONSE:", result);


      if (
        result.success &&
        result.data
      ) {

        setForm({
          id: result.data.id || "",

          badge_title:
            result.data.badge_title ||
            "About School",

          heading:
            result.data.heading || "",

          description:
            result.data.description || "",

          main_image:
            result.data.main_image || "",

          about_bg:
            result.data.about_bg || "",

          elements_image:
            result.data.elements_image || "",

          sub_logo:
            result.data.sub_logo || "",

          status:
            result.data.status ?? 1,
        });

      }

    } catch (error) {

      console.error(
        "GET ABOUT ERROR:",
        error
      );

      alert(
        "Failed to load About content"
      );

    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // TEXT INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ====================================================
  // IMAGE CHANGE
  // ====================================================

  const handleImageChange = (
    e,
    fieldName
  ) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    // Check image type

    if (!file.type.startsWith("image/")) {

      alert(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }


    // Check file size - 5MB

    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Image size must be less than 5MB."
      );

      e.target.value = "";

      return;
    }


    // Store actual File object

    setFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

  };


  // ====================================================
  // UPDATE ABOUT
  // ====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!form.id) {

      alert(
        "About record not found."
      );

      return;
    }


    try {

      setSaving(true);


      // ==================================================
      // FORM DATA
      // ==================================================

      const formData = new FormData();


      // Text fields

      formData.append(
        "badge_title",
        form.badge_title || ""
      );


      formData.append(
        "heading",
        form.heading || ""
      );


      formData.append(
        "description",
        form.description || ""
      );


      formData.append(
        "status",
        String(form.status ?? 1)
      );


      // ==================================================
      // IMAGE FILES
      // ==================================================

      if (files.main_image) {

        formData.append(
          "main_image",
          files.main_image
        );

      }


      if (files.about_bg) {

        formData.append(
          "about_bg",
          files.about_bg
        );

      }


      if (files.elements_image) {

        formData.append(
          "elements_image",
          files.elements_image
        );

      }


      if (files.sub_logo) {

        formData.append(
          "sub_logo",
          files.sub_logo
        );

      }


      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        "Updating About ID:",
        form.id
      );

      console.log(
        "Selected files:",
        files
      );


      // ==================================================
      // API REQUEST
      // ==================================================

      const response = await fetch(
        `${API_URL}/about/${form.id}`,
        {
          method: "PUT",

          // IMPORTANT:
          // DO NOT add Content-Type here.
          // Browser automatically creates multipart/form-data
          // boundary when using FormData.

          body: formData,
        }
      );


      if (!response.ok) {

        throw new Error(
          `HTTP Error: ${response.status}`
        );

      }


      const result =
        await response.json();


      console.log(
        "UPDATE ABOUT RESPONSE:",
        result
      );


      // ==================================================
      // SUCCESS
      // ==================================================

      if (result.success) {

        alert(
          "About updated successfully"
        );


        // Clear selected files

        setFiles({
          main_image: null,
          about_bg: null,
          elements_image: null,
          sub_logo: null,
        });


        // Reload database data

        await fetchAbout();

      } else {

        alert(
          result.message ||
          "Failed to update About"
        );

      }

    } catch (error) {

      console.error(
        "UPDATE ABOUT ERROR:",
        error
      );


      alert(
        error.message ||
        "Something went wrong while updating About."
      );

    } finally {

      setSaving(false);

    }

  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <div className="flex min-h-[300px] items-center justify-center">

        <p className="text-gray-500">
          Loading About...
        </p>

      </div>
    );

  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="w-full p-4 md:p-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6">

        <h2 className="text-2xl font-semibold text-gray-800">
          About School
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage About School content
        </p>

      </div>


      {/* ==================================================
          FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-5 shadow-sm md:p-6"
      >


        {/* ==================================================
            BADGE TITLE
        ================================================== */}

        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Badge Title
          </label>

          <input
            type="text"
            name="badge_title"
            value={form.badge_title}
            onChange={handleChange}
            placeholder="About School"
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-500
            "
          />

        </div>


        {/* ==================================================
            HEADING
        ================================================== */}

        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Heading
          </label>

          <input
            type="text"
            name="heading"
            value={form.heading}
            onChange={handleChange}
            placeholder="Welcome To Mount Senario Matriculation Hr.Sec School"
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-500
            "
          />

        </div>


        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={7}
            placeholder="Enter About School description..."
            className="
              w-full
              resize-y
              rounded-lg
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-500
            "
          />

        </div>


        {/* ==================================================
            MAIN IMAGE
        ================================================== */}

        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Main Image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            onChange={(e) =>
              handleImageChange(
                e,
                "main_image"
              )
            }
            className="
              block
              w-full
              rounded-lg
              border
              border-gray-300
              p-2
              text-sm
            "
          />


          {(
            files.main_image ||
            form.main_image
          ) && (

            <div className="mt-3">

              <img
                src={getPreviewUrl(
                  "main_image"
                )}
                alt="Main About"
                className="
                  h-40
                  w-40
                  rounded-lg
                  border
                  object-cover
                "
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}

        </div>


        {/* ==================================================
            BACKGROUND IMAGE
        ================================================== */}

        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            About Background Image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            onChange={(e) =>
              handleImageChange(
                e,
                "about_bg"
              )
            }
            className="
              block
              w-full
              rounded-lg
              border
              border-gray-300
              p-2
              text-sm
            "
          />


          {(
            files.about_bg ||
            form.about_bg
          ) && (

            <div className="mt-3">

              <img
                src={getPreviewUrl(
                  "about_bg"
                )}
                alt="About Background"
                className="
                  h-32
                  w-48
                  rounded-lg
                  border
                  object-cover
                "
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}

        </div>


        {/* ==================================================
            ELEMENTS IMAGE
        ================================================== */}

        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Elements Image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            onChange={(e) =>
              handleImageChange(
                e,
                "elements_image"
              )
            }
            className="
              block
              w-full
              rounded-lg
              border
              border-gray-300
              p-2
              text-sm
            "
          />


          {(
            files.elements_image ||
            form.elements_image
          ) && (

            <div className="mt-3">

              <img
                src={getPreviewUrl(
                  "elements_image"
                )}
                alt="Elements"
                className="
                  h-32
                  w-48
                  rounded-lg
                  border
                  object-contain
                "
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}

        </div>


        {/* ==================================================
            SUB LOGO
        ================================================== */}

        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Sub Logo
          </label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
            onChange={(e) =>
              handleImageChange(
                e,
                "sub_logo"
              )
            }
            className="
              block
              w-full
              rounded-lg
              border
              border-gray-300
              p-2
              text-sm
            "
          />


          {(
            files.sub_logo ||
            form.sub_logo
          ) && (

            <div className="mt-3">

              <img
                src={getPreviewUrl(
                  "sub_logo"
                )}
                alt="Sub Logo"
                className="
                  h-24
                  w-24
                  rounded-lg
                  border
                  object-contain
                "
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}

        </div>


        {/* ==================================================
            STATUS
        ================================================== */}

        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              focus:border-blue-500
            "
          >

            <option value={1}>
              Active
            </option>

            <option value={0}>
              Inactive
            </option>

          </select>

        </div>


        {/* ==================================================
            BUTTON
        ================================================== */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="
              rounded-lg
              bg-blue-600
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {saving
              ? "Updating..."
              : "Update About"}

          </button>

        </div>

      </form>

    </div>

  );

};


export default AdminAbout;
