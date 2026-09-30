import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "";

// =====================================================
// EMPTY FORM
// =====================================================

const emptyGallery = {
  title: "",
  sort_order: 1,
  status: 1,
  image: null,
};

// =====================================================
// COMPONENT
// =====================================================

const AdminGalleryHome = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [settings, setSettings] = useState({
    badge_title: "Gallery",
    heading:
      "Capturing Moments That Celebrate Every Student’s Journey",
  });

  const [gallery, setGallery] = useState([]);

  const [galleryModal, setGalleryModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [galleryForm, setGalleryForm] =
    useState(emptyGallery);

  const [imagePreview, setImagePreview] = useState("");

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `${API_URL}/gallery-home`
    );

    const text = await response.text();

    console.log("GALLERY STATUS:", response.status);
    console.log("GALLERY RAW RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(
        `Backend returned invalid JSON. Status: ${response.status}. Response: ${text}`
      );
    }

    console.log("GALLERY JSON:", data);

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        `Gallery API failed with status ${response.status}`
      );
    }

    if (!data.success) {
      throw new Error(
        data.error ||
        data.message ||
        "Failed to load gallery"
      );
    }

    setSettings(
      data.settings || {
        badge_title: "Gallery",
        heading:
          "Capturing Moments That Celebrate Every Student’s Journey",
      }
    );

    setGallery(
      Array.isArray(data.gallery)
        ? data.gallery
        : []
    );
  } catch (error) {
    console.error(
      "FETCH GALLERY ERROR:",
      error
    );

    alert(
      error.message ||
      "Failed to load gallery"
    );
  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${IMAGE_URL}${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };

  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const saveSettings = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/gallery-home/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            badge_title:
              settings.badge_title,

            heading:
              settings.heading,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from settings API"
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save settings"
        );
      }

      showMessage(
        "success",
        "Gallery settings saved successfully"
      );
    } catch (error) {
      console.error(
        "SAVE SETTINGS ERROR:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAddGallery = () => {
    setEditingId(null);

    setGalleryForm({
      title: "",
      sort_order:
        gallery.length + 1,
      status: 1,
      image: null,
    });

    setImagePreview("");

    setGalleryModal(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditGallery = (item) => {
    setEditingId(item.id);

    setGalleryForm({
      title: item.title || "",

      sort_order:
        Number(item.sort_order) || 1,

      status:
        Number(item.status) === 1
          ? 1
          : 0,

      image: null,
    });

    setImagePreview(
      item.image
        ? getImageUrl(item.image)
        : ""
    );

    setGalleryModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setGalleryModal(false);

    setEditingId(null);

    setGalleryForm({
      title: "",
      sort_order: 1,
      status: 1,
      image: null,
    });

    setImagePreview("");
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // TYPE
    if (!file.type.startsWith("image/")) {
      showMessage(
        "error",
        "Please select a valid image"
      );

      e.target.value = "";
      return;
    }

    // SIZE
    if (file.size > 5 * 1024 * 1024) {
      showMessage(
        "error",
        "Image size should be less than 5MB"
      );

      e.target.value = "";
      return;
    }

    setGalleryForm((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // SAVE GALLERY
  // =====================================================

  const saveGallery = async () => {
    // TITLE VALIDATION
    if (!galleryForm.title.trim()) {
      showMessage(
        "error",
        "Gallery title is required"
      );

      return;
    }

    // IMAGE REQUIRED ONLY FOR ADD
    if (
      !editingId &&
      !galleryForm.image
    ) {
      showMessage(
        "error",
        "Please select an image"
      );

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "title",
        galleryForm.title.trim()
      );

      formData.append(
        "sort_order",
        String(
          Number(galleryForm.sort_order) || 1
        )
      );

      formData.append(
        "status",
        String(
          galleryForm.status ? 1 : 0
        )
      );

      // IMPORTANT
      // Send image only when a new image is selected
      if (galleryForm.image) {
        formData.append(
          "image",
          galleryForm.image
        );
      }

      const url = editingId
        ? `${API_URL}/gallery-home/${editingId}`
        : `${API_URL}/gallery-home`;

      const response = await fetch(url, {
        method: editingId
          ? "PUT"
          : "POST",
        body: formData,
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from gallery API. Check backend route."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save gallery"
        );
      }

      showMessage(
        "success",
        editingId
          ? "Gallery updated successfully"
          : "Gallery added successfully"
      );

      closeModal();

      await fetchGallery();
    } catch (error) {
      console.error(
        "SAVE GALLERY ERROR:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to save gallery"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteGallery = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/gallery-home/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid response from delete API"
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete gallery"
        );
      }

      showMessage(
        "success",
        "Gallery image deleted successfully"
      );

      await fetchGallery();
    } catch (error) {
      console.error(
        "DELETE GALLERY ERROR:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to delete gallery"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-indigo-600
            "
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading Gallery...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
              Gallery
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage school gallery images and section content
            </p>
          </div>

          <button
            type="button"
            onClick={fetchGallery}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
            "
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* SETTINGS */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-5 md:px-6">

            <h2 className="text-lg font-bold text-slate-800">
              Gallery Settings
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Manage the heading displayed above the gallery
            </p>

          </div>

          <div className="p-5 md:p-6">

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* BADGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Badge Title
                </label>

                <input
                  type="text"
                  value={settings.badge_title}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      badge_title:
                        e.target.value,
                    }))
                  }
                  placeholder="Gallery"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-500/20
                  "
                />
              </div>

              {/* HEADING */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Main Heading
                </label>

                <input
                  type="text"
                  value={settings.heading}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      heading:
                        e.target.value,
                    }))
                  }
                  placeholder="Capturing Moments..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-500/20
                  "
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end">

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="
                  rounded-xl
                  bg-indigo-600
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Saving..."
                  : "Save Settings"}
              </button>

            </div>

          </div>
        </div>

        {/* GALLERY */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Gallery Images
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {gallery.length} image
                {gallery.length !== 1
                  ? "s"
                  : ""}{" "}
                available
              </p>
            </div>

            <button
              type="button"
              onClick={openAddGallery}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
              "
            >
              <Plus size={18} />
              Add Gallery
            </button>

          </div>

          <div className="p-5 md:p-6">

            {gallery.length === 0 ? (

              <div className="py-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ImageIcon size={30} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-700">
                  No gallery images
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Add your first gallery image
                </p>

                <button
                  type="button"
                  onClick={openAddGallery}
                  className="
                    mt-5
                    rounded-xl
                    bg-indigo-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-indigo-700
                  "
                >
                  + Add Gallery
                </button>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {gallery.map((item) => (

                  <div
                    key={item.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      transition
                      hover:-translate-y-1
                      hover:shadow-lg
                    "
                  >

                    {/* IMAGE */}

                    <div className="relative h-52 overflow-hidden bg-slate-100">

                      {item.image ? (

                        <img
                          src={getImageUrl(
                            item.image
                          )}
                          alt={
                            item.title ||
                            "Gallery"
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            hover:scale-105
                          "
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-slate-400">
                          <ImageIcon size={35} />
                        </div>

                      )}

                      {/* STATUS */}

                      <div className="absolute left-3 top-3">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            Number(
                              item.status
                            ) === 1
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          {Number(
                            item.status
                          ) === 1
                            ? "ACTIVE"
                            : "HIDDEN"}
                        </span>

                      </div>

                      {/* ORDER */}

                      <div className="absolute right-3 top-3">

                        <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                          #
                          {
                            item.sort_order
                          }
                        </span>

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="p-4">

                      <h3 className="truncate text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Display order:{" "}
                        {item.sort_order}
                      </p>

                      {/* ACTIONS */}

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">

                        <button
                          type="button"
                          onClick={() =>
                            openEditGallery(
                              item
                            )
                          }
                          className="
                            flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-slate-100
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-600
                            transition
                            hover:bg-indigo-50
                            hover:text-indigo-600
                          "
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteGallery(
                              item.id
                            )
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-red-50
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-red-600
                            transition
                            hover:bg-red-100
                          "
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        </div>

      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {galleryModal && (

        <div
          className="
            fixed
            inset-0
            z-[999]
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
              max-h-[92vh]
              w-full
              max-w-xl
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h3 className="text-lg font-bold text-slate-800">
                  {editingId
                    ? "Edit Gallery"
                    : "Add Gallery"}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Upload and manage gallery image
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-500
                  transition
                  hover:bg-slate-200
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* BODY */}

            <div className="space-y-5 p-6">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gallery Title
                </label>

                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) =>
                    setGalleryForm(
                      (prev) => ({
                        ...prev,
                        title:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="School Annual Day"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-500/20
                  "
                />

              </div>

              {/* ORDER + STATUS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      galleryForm.sort_order
                    }
                    onChange={(e) =>
                      setGalleryForm(
                        (prev) => ({
                          ...prev,
                          sort_order:
                            e.target.value,
                        })
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-indigo-500
                      focus:bg-white
                    "
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    value={
                      galleryForm.status
                    }
                    onChange={(e) =>
                      setGalleryForm(
                        (prev) => ({
                          ...prev,
                          status:
                            Number(
                              e.target.value
                            ),
                        })
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-indigo-500
                      focus:bg-white
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

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gallery Image
                </label>

                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">

                  {imagePreview && (

                    <div className="relative mb-4 h-56 overflow-hidden rounded-xl bg-slate-100">

                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />

                    </div>

                  )}

                  <label
                    className="
                      flex
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-8
                      text-center
                      transition
                      hover:border-indigo-300
                      hover:bg-indigo-50/30
                    "
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Upload size={22} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Click to upload image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG, JPEG or WEBP
                    </p>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />

                  </label>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-100
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveGallery}
                disabled={saving}
                className="
                  rounded-xl
                  bg-indigo-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Gallery"
                  : "Add Gallery"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminGalleryHome;