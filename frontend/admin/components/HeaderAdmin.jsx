
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  GripVertical,
} from "lucide-react";

const HeaderAdmin = () => {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "/api";

  const IMAGE_URL =
    import.meta.env.VITE_IMAGE_URL ||
    "";

  // ==========================================================
  // SETTINGS
  // ==========================================================

  const [settings, setSettings] = useState({
    logo: "",
    logoFile: null,
    email: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    phone_label: "Call Us",
    phone_number: "",
    apply_text: "Apply Now",
    apply_url: "/contact",
    status: 1,
  });

  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    href: "",
    sort_order: 1,
    status: 1,
  });

  // ==========================================================
  // LOAD HEADER
  // ==========================================================

  useEffect(() => {
    loadHeader();
  }, []);

  const loadHeader = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/header/admin`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch header data"
        );
      }

      const result = await response.json();

      if (result.success) {
        if (result.data?.settings) {
          setSettings({
            ...result.data.settings,
            logoFile: null,
          });
        }

        setMenuItems(
          result.data?.menuItems || []
        );
      }
    } catch (error) {
      console.error(
        "Header admin error:",
        error
      );

      alert(
        error.message ||
          "Failed to load header data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // SETTINGS CHANGE
  // ==========================================================

  const handleSettingsChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // LOGO CHANGE
  // ==========================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, JPEG, PNG, WEBP and SVG images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Logo size must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    setSettings((prev) => ({
      ...prev,
      logoFile: file,
    }));
  };

  // ==========================================================
  // LOGO URL
  // ==========================================================

  const getLogoUrl = () => {
    if (!settings.logo) {
      return "";
    }

    if (
      settings.logo.startsWith("http://") ||
      settings.logo.startsWith("https://")
    ) {
      return settings.logo;
    }

    return `${IMAGE_URL}${settings.logo}`;
  };

  // ==========================================================
  // SAVE HEADER SETTINGS
  // ==========================================================

  const saveSettings = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      // Logo file
      if (settings.logoFile) {
        formData.append(
          "logo",
          settings.logoFile
        );
      }

      // Other settings
      formData.append(
        "email",
        settings.email || ""
      );

      formData.append(
        "facebook_url",
        settings.facebook_url || ""
      );

      formData.append(
        "instagram_url",
        settings.instagram_url || ""
      );

      formData.append(
        "youtube_url",
        settings.youtube_url || ""
      );

      formData.append(
        "phone_label",
        settings.phone_label || ""
      );

      formData.append(
        "phone_number",
        settings.phone_number || ""
      );

      formData.append(
        "apply_text",
        settings.apply_text || ""
      );

      formData.append(
        "apply_url",
        settings.apply_url || ""
      );

      formData.append(
        "status",
        Number(settings.status ?? 1)
      );

      const response = await fetch(
        `${API_URL}/header/settings`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update settings"
        );
      }

      // Update state with latest backend data
      if (result.data) {
        setSettings({
          ...result.data,
          logoFile: null,
        });
      }

      alert(
        "Header settings updated successfully"
      );
    } catch (error) {
      console.error(
        "Save settings error:",
        error
      );

      alert(
        error.message ||
          "Failed to update settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // RESET MENU FORM
  // ==========================================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      href: "",
      sort_order:
        menuItems.length + 1,
      status: 1,
    });
  };

  // ==========================================================
  // MENU FORM CHANGE
  // ==========================================================

  const handleFormChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // SAVE MENU ITEM
  // ==========================================================

  const saveMenuItem = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Menu name is required");
      return;
    }

    if (!form.href.trim()) {
      alert("Menu URL is required");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/header/menu/${editingId}`
        : `${API_URL}/header/menu`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          href: form.href.trim(),
          sort_order:
            Number(form.sort_order) || 0,
          status:
            Number(form.status) === 1
              ? 1
              : 0,
        }),
      });

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save menu"
        );
      }

      const wasEditing =
        Boolean(editingId);

      resetForm();

      await loadHeader();

      alert(
        wasEditing
          ? "Menu updated successfully"
          : "Menu added successfully"
      );
    } catch (error) {
      console.error(
        "Save menu error:",
        error
      );

      alert(
        error.message ||
          "Failed to save menu"
      );
    }
  };

  // ==========================================================
  // EDIT MENU
  // ==========================================================

  const editMenu = (item) => {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      href: item.href || "",
      sort_order:
        Number(item.sort_order) || 1,
      status:
        Number(item.status) === 1
          ? 1
          : 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // DELETE MENU
  // ==========================================================

  const deleteMenu = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/header/menu/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete menu"
        );
      }

      if (editingId === id) {
        resetForm();
      }

      await loadHeader();

      alert(
        "Menu deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete menu error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete menu"
      );
    }
  };

  // ==========================================================
  // DRAG START
  // ==========================================================

  const handleDragStart = (
    e,
    index
  ) => {
    e.dataTransfer.effectAllowed =
      "move";

    e.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  };

  // ==========================================================
  // DROP / REORDER
  // ==========================================================

  const handleDrop = async (
    e,
    targetIndex
  ) => {
    e.preventDefault();

    const sourceIndex = Number(
      e.dataTransfer.getData(
        "text/plain"
      )
    );

    if (
      Number.isNaN(sourceIndex) ||
      sourceIndex < 0 ||
      sourceIndex >= menuItems.length
    ) {
      return;
    }

    if (
      sourceIndex === targetIndex
    ) {
      return;
    }

    const updated = [
      ...menuItems,
    ];

    const [movedItem] =
      updated.splice(
        sourceIndex,
        1
      );

    updated.splice(
      targetIndex,
      0,
      movedItem
    );

    // Optimistic update
    setMenuItems(updated);

    try {
      const response = await fetch(
        `${API_URL}/header/menu/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            items: updated.map(
              (item, index) => ({
                id: item.id,
                sort_order:
                  index + 1,
              })
            ),
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to reorder menu"
        );
      }

      // Refresh from database
      await loadHeader();
    } catch (error) {
      console.error(
        "Reorder error:",
        error
      );

      alert(
        error.message ||
          "Failed to reorder menu"
      );

      // Restore database order
      await loadHeader();
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="p-6">
        Loading Header...
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-8 p-6">

      {/* ======================================================
          HEADER SETTINGS
      ====================================================== */}

      <div className="rounded-xl bg-white p-6 shadow">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Header Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage header logo, contact,
              social media and sticky
              header settings.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#2E0797] px-5 py-3 font-semibold text-white hover:bg-[#2d3381] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-semibold">
              Header Logo
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleLogoChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

            <p className="mt-2 text-xs text-gray-500">
              Supported: JPG, JPEG, PNG,
              WEBP, SVG. Maximum 5MB.
            </p>

            {/* Current Logo */}

            {settings.logo && (
              <div className="mt-4">

                <p className="mb-2 text-sm font-medium text-gray-600">
                  Current Logo
                </p>

                <div className="flex min-h-[100px] items-center rounded-lg border bg-gray-50 p-4">

                  <img
                    src={getLogoUrl()}
                    alt="Header Logo"
                    className="h-20 max-w-[280px] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>

              </div>
            )}

            {/* New Logo Selected */}

            {settings.logoFile && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">

                <p className="text-sm font-semibold text-blue-700">
                  New logo selected
                </p>

                <p className="mt-1 text-sm text-blue-600">
                  {settings.logoFile.name}
                </p>

              </div>
            )}

          </div>

          {/* ==================================================
              EMAIL
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                settings.email || ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="school@example.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              FACEBOOK
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Facebook URL
            </label>

            <input
              type="text"
              name="facebook_url"
              value={
                settings.facebook_url ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="https://facebook.com/..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              INSTAGRAM
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Instagram URL
            </label>

            <input
              type="text"
              name="instagram_url"
              value={
                settings.instagram_url ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="https://instagram.com/..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              YOUTUBE
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              YouTube URL
            </label>

            <input
              type="text"
              name="youtube_url"
              value={
                settings.youtube_url ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="https://youtube.com/..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              PHONE LABEL
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Phone Label
            </label>

            <input
              type="text"
              name="phone_label"
              value={
                settings.phone_label ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="Call Us"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              PHONE NUMBER
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Phone Number
            </label>

            <input
              type="text"
              name="phone_number"
              value={
                settings.phone_number ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              APPLY TEXT
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Apply Button Text
            </label>

            <input
              type="text"
              name="apply_text"
              value={
                settings.apply_text ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="Apply Now"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              APPLY URL
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Apply Button URL
            </label>

            <input
              type="text"
              name="apply_url"
              value={
                settings.apply_url ||
                ""
              }
              onChange={
                handleSettingsChange
              }
              placeholder="/contact"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
            />

          </div>

          {/* ==================================================
              HEADER STATUS
          ================================================== */}

          <div className="md:col-span-2">

            <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-4">

              <input
                type="checkbox"
                id="header_status"
                checked={
                  Number(
                    settings.status
                  ) === 1
                }
                onChange={(e) =>
                  setSettings(
                    (prev) => ({
                      ...prev,
                      status:
                        e.target.checked
                          ? 1
                          : 0,
                    })
                  )
                }
                className="h-5 w-5"
              />

              <label
                htmlFor="header_status"
                className="cursor-pointer text-sm font-semibold text-gray-700"
              >
                Enable Header
              </label>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          MENU FORM
      ====================================================== */}

      <div className="rounded-xl bg-white p-6 shadow">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Header Menu
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              This same menu will be used
              in Header and Sticky Header.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              <X size={18} />
              Cancel
            </button>
          )}

        </div>

        <form
          onSubmit={saveMenuItem}
          className="grid grid-cols-1 gap-4 md:grid-cols-5"
        >

          {/* Menu Name */}

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Menu Name"
            className="rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
          />

          {/* URL */}

          <input
            type="text"
            name="href"
            value={form.href}
            onChange={handleFormChange}
            placeholder="/about"
            className="rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
          />

          {/* Order */}

          <input
            type="number"
            name="sort_order"
            min="1"
            value={form.sort_order}
            onChange={handleFormChange}
            placeholder="Order"
            className="rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
          />

          {/* Status */}

          <select
            name="status"
            value={form.status}
            onChange={handleFormChange}
            className="rounded-lg border px-4 py-3 outline-none focus:border-[#2E0797]"
          >
            <option value={1}>
              Active
            </option>

            <option value={0}>
              Hidden
            </option>
          </select>

          {/* Submit */}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2E0797] px-5 py-3 font-semibold text-white hover:bg-[#2d3381]"
          >
            {editingId ? (
              <>
                <Pencil size={18} />
                Update Menu
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Menu
              </>
            )}
          </button>

        </form>

      </div>

      {/* ======================================================
          MENU LIST
      ====================================================== */}

      <div className="rounded-xl bg-white p-6 shadow">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Menu Items
          </h2>

          <span className="text-sm text-gray-500">
            Drag items to reorder
          </span>

        </div>

        <div className="space-y-3">

          {menuItems.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
              No menu items found.
            </div>
          ) : (
            menuItems.map(
              (item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(
                      e,
                      index
                    )
                  }
                  onDragOver={(e) =>
                    e.preventDefault()
                  }
                  onDrop={(e) =>
                    handleDrop(
                      e,
                      index
                    )
                  }
                  className="flex cursor-move items-center gap-4 rounded-lg border p-4 transition hover:bg-gray-50"
                >

                  {/* Drag */}

                  <GripVertical
                    size={20}
                    className="shrink-0 text-gray-400"
                  />

                  {/* Details */}

                  <div className="min-w-0 flex-1">

                    <div className="font-semibold text-gray-800">
                      {item.name}
                    </div>

                    <div className="truncate text-sm text-gray-500">
                      {item.href}
                    </div>

                  </div>

                  {/* Order */}

                  <div className="hidden text-sm text-gray-500 md:block">
                    Order:{" "}
                    {index + 1}
                  </div>

                  {/* Status */}

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      Number(
                        item.status
                      ) === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(
                      item.status
                    ) === 1
                      ? "Active"
                      : "Hidden"}
                  </span>

                  {/* Edit */}

                  <button
                    type="button"
                    onClick={() =>
                      editMenu(item)
                    }
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="Edit Menu"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() =>
                      deleteMenu(
                        item.id
                      )
                    }
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    title="Delete Menu"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default HeaderAdmin;
