import React, {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Save,
  GripVertical,
  RefreshCw,
} from "lucide-react";

// ============================================================
// API CONFIG
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "";

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  title: "",
  description: "",
  sort_order: 1,
  status: 1,
  image: null,
};

// ============================================================
// SAFE API RESPONSE
// ============================================================

const parseResponse = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  // ----------------------------------------------------------
  // JSON RESPONSE
  // ----------------------------------------------------------

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Request failed"
      );
    }

    return result;
  }

  // ----------------------------------------------------------
  // NON JSON RESPONSE
  // ----------------------------------------------------------

  const text =
    await response.text();

  console.error(
    "Non-JSON server response:",
    text
  );

  throw new Error(
    `Server returned ${response.status}. Please check the backend server.`
  );
};

// ============================================================
// COMPONENT
// ============================================================

function HeroBannerAdmin() {
  const [slides, setSlides] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const [preview, setPreview] =
    useState("");

  const [draggedId, setDraggedId] =
    useState(null);

  // ==========================================================
  // FETCH SLIDES
  // ==========================================================

  const fetchSlides = async () => {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/hero`
        );

      const result =
        await parseResponse(
          response
        );

      if (result.success) {
        setSlides(
          result.data || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch hero slides error:",
        error
      );

      alert(
        error.message ||
          "Failed to load hero slides"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchSlides();
  }, []);

  // ==========================================================
  // CLEANUP PREVIEW URL
  // ==========================================================

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          preview
        );
      }
    };
  }, [preview]);

  // ==========================================================
  // OPEN ADD
  // ==========================================================

  const openAdd = () => {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      sort_order:
        slides.length + 1,
      status: 1,
      image: null,
    });

    setPreview("");

    setShowModal(true);
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const openEdit = (slide) => {
    setEditingId(slide.id);

    setForm({
      title: slide.title || "",
      description:
        slide.description || "",
      sort_order:
        slide.sort_order || 1,
      status:
        Number(slide.status) === 1
          ? 1
          : 0,
      image: null,
    });

    setPreview(
      slide.image
        ? `${IMAGE_URL}${slide.image}`
        : ""
    );

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    setShowModal(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setPreview("");
  };

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name ===
          "sort_order" ||
        name === "status"
          ? Number(value)
          : value,
    }));
  };

  // ==========================================================
  // IMAGE CHANGE
  // ==========================================================

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    // --------------------------------------------------------
    // FILE TYPE
    // --------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";

      return;
    }

    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image size must be less than 5MB."
      );

      e.target.value = "";

      return;
    }

    // --------------------------------------------------------
    // OLD BLOB PREVIEW
    // --------------------------------------------------------

    if (
      preview &&
      preview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        preview
      );
    }

    // --------------------------------------------------------
    // SET FILE
    // --------------------------------------------------------

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    // --------------------------------------------------------
    // PREVIEW
    // --------------------------------------------------------

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setPreview(previewUrl);
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    if (
      !form.title.trim()
    ) {
      alert(
        "Please enter slide title."
      );

      return;
    }

    // --------------------------------------------------------
    // IMAGE REQUIRED FOR NEW SLIDE
    // --------------------------------------------------------

    if (
      !editingId &&
      !form.image
    ) {
      alert(
        "Please upload an image."
      );

      return;
    }

    try {
      setSaving(true);

      // ------------------------------------------------------
      // FORM DATA
      // ------------------------------------------------------

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "sort_order",
        String(
          form.sort_order
        )
      );

      formData.append(
        "status",
        String(form.status)
      );

      if (form.image) {
        formData.append(
          "image",
          form.image
        );
      }

      // ------------------------------------------------------
      // URL
      // ------------------------------------------------------

      const url = editingId
        ? `${API_URL}/hero/${editingId}`
        : `${API_URL}/hero`;

      // ------------------------------------------------------
      // METHOD
      // ------------------------------------------------------

      const method = editingId
        ? "PUT"
        : "POST";

      // ------------------------------------------------------
      // REQUEST
      // ------------------------------------------------------

      const response =
        await fetch(url, {
          method,
          body: formData,
        });

      // ------------------------------------------------------
      // SAFE RESPONSE
      // ------------------------------------------------------

      const result =
        await parseResponse(
          response
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to save slide"
        );
      }

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      alert(
        editingId
          ? "Hero slide updated successfully."
          : "Hero slide added successfully."
      );

      closeModal();

      await fetchSlides();
    } catch (error) {
      console.error(
        "Save hero slide error:",
        error
      );

      alert(
        error.message ||
          "Failed to save hero slide."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE SLIDE
  // ==========================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this hero slide?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/hero/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await parseResponse(
          response
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete slide"
        );
      }

      alert(
        "Hero slide deleted successfully."
      );

      await fetchSlides();
    } catch (error) {
      console.error(
        "Delete hero slide error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete slide."
      );
    }
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const toggleStatus = async (
    slide
  ) => {
    try {
      const formData =
        new FormData();

      formData.append(
        "title",
        slide.title || ""
      );

      formData.append(
        "description",
        slide.description || ""
      );

      formData.append(
        "sort_order",
        String(
          slide.sort_order || 0
        )
      );

      formData.append(
        "status",
        String(
          Number(
            slide.status
          ) === 1
            ? 0
            : 1
        )
      );

      const response =
        await fetch(
          `${API_URL}/hero/${slide.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

      const result =
        await parseResponse(
          response
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to update status"
        );
      }

      await fetchSlides();
    } catch (error) {
      console.error(
        "Toggle status error:",
        error
      );

      alert(
        error.message ||
          "Failed to update status."
      );
    }
  };

  // ==========================================================
  // DRAG START
  // ==========================================================

  const handleDragStart = (
    id
  ) => {
    setDraggedId(id);
  };

  // ==========================================================
  // DRAG END
  // ==========================================================

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // ==========================================================
  // DROP
  // ==========================================================

  const handleDrop = async (
    targetId
  ) => {
    if (
      !draggedId ||
      draggedId === targetId
    ) {
      setDraggedId(null);

      return;
    }

    const current = [
      ...slides,
    ];

    const fromIndex =
      current.findIndex(
        (item) =>
          item.id ===
          draggedId
      );

    const toIndex =
      current.findIndex(
        (item) =>
          item.id ===
          targetId
      );

    if (
      fromIndex === -1 ||
      toIndex === -1
    ) {
      setDraggedId(null);

      return;
    }

    // --------------------------------------------------------
    // MOVE ITEM
    // --------------------------------------------------------

    const [
      movedItem,
    ] = current.splice(
      fromIndex,
      1
    );

    current.splice(
      toIndex,
      0,
      movedItem
    );

    // --------------------------------------------------------
    // UPDATE ORDER
    // --------------------------------------------------------

    const updated =
      current.map(
        (item, index) => ({
          ...item,
          sort_order:
            index + 1,
        })
      );

    // --------------------------------------------------------
    // UPDATE UI
    // --------------------------------------------------------

    setSlides(updated);

    setDraggedId(null);

    try {
      const response =
        await fetch(
          `${API_URL}/hero/reorder`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              items:
                updated.map(
                  (item) => ({
                    id: item.id,
                  })
                ),
            }),
          }
        );

      const result =
        await parseResponse(
          response
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to reorder slides"
        );
      }
    } catch (error) {
      console.error(
        "Reorder error:",
        error
      );

      alert(
        error.message ||
          "Failed to save slide order."
      );

      await fetchSlides();
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        p-4
        md:p-6
        lg:p-8
      "
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
            "
          >
            Hero Banner
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage homepage hero
            slider content.
          </p>
        </div>

        <div
          className="
            flex
            gap-2
          "
        >
          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchSlides}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={17}
            />

            Refresh
          </button>

          {/* ADD */}

          <button
            type="button"
            onClick={openAdd}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-[#e71b93]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#d91686]
            "
          >
            <Plus size={18} />

            Add Slide
          </button>
        </div>
      </div>

      {/* ====================================================
          SLIDES LIST
      ==================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >
        {/* LOADING */}

        {loading ? (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              text-sm
              text-gray-500
            "
          >
            Loading hero slides...
          </div>
        ) : slides.length === 0 ? (
          /* EMPTY */

          <div
            className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              p-8
              text-center
            "
          >
            <div
              className="
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-pink-50
                text-[#e71b93]
              "
            >
              <Plus size={24} />
            </div>

            <h3
              className="
                text-lg
                font-semibold
                text-gray-900
              "
            >
              No Hero Slides
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Add your first hero
              banner slide.
            </p>
          </div>
        ) : (
          /* LIST */

          <div
            className="
              divide-y
              divide-gray-100
            "
          >
            {slides.map(
              (slide, index) => (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={() =>
                    handleDragStart(
                      slide.id
                    )
                  }
                  onDragEnd={
                    handleDragEnd
                  }
                  onDragOver={(e) =>
                    e.preventDefault()
                  }
                  onDrop={() =>
                    handleDrop(
                      slide.id
                    )
                  }
                  className={`
                    flex
                    flex-col
                    gap-4
                    p-4
                    transition
                    md:flex-row
                    md:items-center
                    ${
                      draggedId ===
                      slide.id
                        ? "opacity-40"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  {/* DRAG */}

                  <div
                    className="
                      hidden
                      cursor-grab
                      text-gray-400
                      md:block
                    "
                  >
                    <GripVertical
                      size={20}
                    />
                  </div>

                  {/* ORDER */}

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-100
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    {index + 1}
                  </div>

                  {/* IMAGE */}

                  <div
                    className="
                      h-28
                      w-full
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-gray-100
                      md:w-48
                    "
                  >
                    {slide.image ? (
                      <img
                        src={`${IMAGE_URL}${slide.image}`}
                        alt={
                          slide.title ||
                          "Hero banner"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                        onError={(
                          e
                        ) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                          text-xs
                          text-gray-400
                        "
                      >
                        No Image
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <h3
                        className="
                          text-base
                          font-semibold
                          text-gray-900
                        "
                      >
                        {slide.title}
                      </h3>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-semibold
                          uppercase
                          ${
                            Number(
                              slide.status
                            ) === 1
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {Number(
                          slide.status
                        ) === 1
                          ? "Active"
                          : "Hidden"}
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-sm
                        text-gray-500
                      "
                    >
                      {slide.description ||
                        "No description"}
                    </p>
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                  >
                    {/* STATUS */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(
                          slide
                        )
                      }
                      title={
                        Number(
                          slide.status
                        ) === 1
                          ? "Hide"
                          : "Show"
                      }
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-gray-200
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-gray-900
                      "
                    >
                      {Number(
                        slide.status
                      ) === 1 ? (
                        <EyeOff
                          size={17}
                        />
                      ) : (
                        <Eye
                          size={17}
                        />
                      )}
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(
                          slide
                        )
                      }
                      title="Edit"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-gray-200
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-gray-900
                      "
                    >
                      <Pencil
                        size={17}
                      />
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          slide.id
                        )
                      }
                      title="Delete"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-red-100
                        text-red-500
                        transition
                        hover:bg-red-50
                      "
                    >
                      <Trash2
                        size={17}
                      />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ====================================================
          MODAL
      ==================================================== */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-4
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                  "
                >
                  {editingId
                    ? "Edit Hero Slide"
                    : "Add Hero Slide"}
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                  "
                >
                  Manage banner image
                  and content.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              {/* IMAGE */}

              <div className="mb-5">
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Banner Image
                </label>

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    bg-gray-50
                  "
                >
                  {preview ? (
                    <div
                      className="
                        relative
                      "
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="
                          h-56
                          w-full
                          object-cover
                        "
                      />

                      {/* CHANGE IMAGE */}

                      <label
                        className="
                          absolute
                          bottom-3
                          right-3
                          flex
                          cursor-pointer
                          items-center
                          gap-2
                          rounded-lg
                          bg-black/70
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          backdrop-blur
                        "
                      >
                        <Upload
                          size={15}
                        />

                        Change Image

                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          onChange={
                            handleImageChange
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label
                      className="
                        flex
                        h-56
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        text-center
                      "
                    >
                      <div
                        className="
                          mb-3
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-full
                          bg-pink-50
                          text-[#e71b93]
                        "
                      >
                        <Upload
                          size={22}
                        />
                      </div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-700
                        "
                      >
                        Upload Banner Image
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-400
                        "
                      >
                        JPG, PNG or WEBP
                        · Max 5MB
                      </p>

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-400
                  "
                >
                  Recommended size:
                  1920 × 900 px
                </p>
              </div>

              {/* TITLE */}

              <div className="mb-5">
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  placeholder="Enter hero title"
                  maxLength={500}
                  disabled={saving}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#e71b93]
                    focus:ring-2
                    focus:ring-[#e71b93]/10
                    disabled:bg-gray-50
                  "
                />
              </div>

              {/* DESCRIPTION */}

              <div className="mb-5">
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
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="Enter hero description"
                  disabled={saving}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#e71b93]
                    focus:ring-2
                    focus:ring-[#e71b93]/10
                    disabled:bg-gray-50
                  "
                />
              </div>

              {/* ORDER + STATUS */}

              <div
                className="
                  mb-6
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                {/* ORDER */}

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
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={
                      form.sort_order
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    disabled={saving}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#e71b93]
                      focus:ring-2
                      focus:ring-[#e71b93]/10
                      disabled:bg-gray-50
                    "
                  />
                </div>

                {/* STATUS */}

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
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#e71b93]
                      focus:ring-2
                      focus:ring-[#e71b93]/10
                      disabled:bg-gray-50
                    "
                  >
                    <option value={1}>
                      Active
                    </option>

                    <option value={0}>
                      Hidden
                    </option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  border-t
                  border-gray-100
                  pt-5
                "
              >
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-lg
                    border
                    border-gray-200
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#e71b93]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#d91686]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Slide"
                    : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroBannerAdmin;