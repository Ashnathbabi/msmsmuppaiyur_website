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
  Save,
  X,
  GripVertical,
  RefreshCw,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const emptyForm = {
  title: "",
  sort_order: 1,
  status: 1,
};

// ============================================================
// SAFE RESPONSE
// ============================================================

const parseResponse = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

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

  const text =
    await response.text();

  console.error(
    "Non JSON response:",
    text
  );

  throw new Error(
    `Server returned ${response.status}`
  );
};

// ============================================================
// COMPONENT
// ============================================================

function MarqueeAdmin() {
  const [items, setItems] =
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

  const [draggedId, setDraggedId] =
    useState(null);

  // ==========================================================
  // FETCH
  // ==========================================================

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/marquee`
        );

      const result =
        await parseResponse(
          response
        );

      if (result.success) {
        setItems(
          result.data || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch marquee error:",
        error
      );

      alert(
        error.message ||
          "Failed to load announcements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ==========================================================
  // OPEN ADD
  // ==========================================================

  const openAdd = () => {
    setEditingId(null);

    setForm({
      title: "",
      sort_order:
        items.length + 1,
      status: 1,
    });

    setShowModal(true);
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const openEdit = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      sort_order:
        item.sort_order || 1,
      status:
        Number(item.status) === 1
          ? 1
          : 0,
    });

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE
  // ==========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingId(null);
    setForm({
      ...emptyForm,
    });
  };

  // ==========================================================
  // CHANGE
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
  // SAVE
  // ==========================================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !form.title.trim()
    ) {
      alert(
        "Please enter announcement text."
      );

      return;
    }

    try {
      setSaving(true);

      const body = {
        title:
          form.title.trim(),

        sort_order:
          Number(
            form.sort_order
          ) || 1,

        status:
          Number(form.status),
      };

      const url = editingId
        ? `${API_URL}/marquee/${editingId}`
        : `${API_URL}/marquee`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        });

      const result =
        await parseResponse(
          response
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to save announcement"
        );
      }

      alert(
        editingId
          ? "Announcement updated successfully."
          : "Announcement added successfully."
      );

      closeModal();

      await fetchItems();
    } catch (error) {
      console.error(
        "Save marquee error:",
        error
      );

      alert(
        error.message ||
          "Failed to save announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/marquee/${id}`,
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
            "Failed to delete announcement"
        );
      }

      await fetchItems();
    } catch (error) {
      console.error(
        "Delete marquee error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete announcement."
      );
    }
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const toggleStatus = async (
    item
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/marquee/${item.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                item.title,

              sort_order:
                item.sort_order,

              status:
                Number(
                  item.status
                ) === 1
                  ? 0
                  : 1,
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
            "Failed to update status"
        );
      }

      await fetchItems();
    } catch (error) {
      console.error(
        "Toggle marquee status error:",
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
      ...items,
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

    const updated =
      current.map(
        (item, index) => ({
          ...item,
          sort_order:
            index + 1,
        })
      );

    setItems(updated);

    setDraggedId(null);

    try {
      const response =
        await fetch(
          `${API_URL}/marquee/reorder`,
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
            "Failed to reorder announcements"
        );
      }
    } catch (error) {
      console.error(
        "Reorder error:",
        error
      );

      alert(
        error.message ||
          "Failed to save order."
      );

      await fetchItems();
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
            What's New
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage scrolling
            announcements displayed
            on the homepage.
          </p>
        </div>

        <div
          className="
            flex
            gap-2
          "
        >
          <button
            type="button"
            onClick={fetchItems}
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
              hover:bg-gray-50
            "
          >
            <RefreshCw
              size={17}
            />

            Refresh
          </button>

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
              hover:bg-[#d91686]
            "
          >
            <Plus size={18} />

            Add Announcement
          </button>
        </div>
      </div>

      {/* ====================================================
          LIST
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
        {loading ? (
          <div
            className="
              flex
              min-h-[250px]
              items-center
              justify-center
              text-sm
              text-gray-500
            "
          >
            Loading announcements...
          </div>
        ) : items.length === 0 ? (
          <div
            className="
              flex
              min-h-[250px]
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
              No Announcements
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Add your first
              homepage announcement.
            </p>
          </div>
        ) : (
          <div
            className="
              divide-y
              divide-gray-100
            "
          >
            {items.map(
              (item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() =>
                    handleDragStart(
                      item.id
                    )
                  }
                  onDragOver={(e) =>
                    e.preventDefault()
                  }
                  onDrop={() =>
                    handleDrop(
                      item.id
                    )
                  }
                  className="
                    flex
                    flex-col
                    gap-4
                    p-4
                    transition
                    hover:bg-gray-50
                    md:flex-row
                    md:items-center
                  "
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
                        {item.title}
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
                              item.status
                            ) === 1
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {Number(
                          item.status
                        ) === 1
                          ? "Active"
                          : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(
                          item
                        )
                      }
                      title={
                        Number(
                          item.status
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
                        hover:bg-gray-100
                      "
                    >
                      {Number(
                        item.status
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

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(
                          item
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
                        hover:bg-gray-100
                      "
                    >
                      <Pencil
                        size={17}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item.id
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
              w-full
              max-w-xl
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >
            {/* HEADER */}

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
                    ? "Edit Announcement"
                    : "Add Announcement"}
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                  "
                >
                  Add content for the
                  homepage What's New
                  ticker.
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
                  hover:bg-gray-100
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
              {/* ANNOUNCEMENT */}

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
                  Announcement
                </label>

                <textarea
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  rows={4}
                  maxLength={500}
                  disabled={saving}
                  placeholder="Example: Admission 2026 - 2027 is going on..."
                  className="
                    w-full
                    resize-none
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
                  "
                />

                <p
                  className="
                    mt-1
                    text-right
                    text-xs
                    text-gray-400
                  "
                >
                  {form.title.length}/500
                </p>
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
                    "
                  />
                </div>

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
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

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
                    hover:bg-[#d91686]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Add Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarqueeAdmin;