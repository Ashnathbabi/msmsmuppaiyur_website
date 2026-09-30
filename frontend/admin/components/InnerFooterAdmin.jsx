import React, {
  useEffect,
  useState,
} from "react";

import {
  FiUpload,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiMenu,
  FiRefreshCw,
} from "react-icons/fi";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "";


const defaultSettings = {
  description: "",
  phone: "",
  address: "",
  email: "",

  privacy_text: "PRIVATE POLICY",
  privacy_url: "#",

  copyright_year: "2026",

  powered_by_text: "Bonifon",
  powered_by_url: "",

  facebook_url: "",
  instagram_url: "",
  youtube_url: "",

  logo: "",
  background_image: "",
};


const InnerFooterAdmin = () => {

  const [settings, setSettings] =
    useState(defaultSettings);

  const [quickLinks, setQuickLinks] =
    useState([]);


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  const [logoPreview, setLogoPreview] =
    useState("");

  const [backgroundPreview, setBackgroundPreview] =
    useState("");


  const [quickName, setQuickName] =
    useState("");

  const [quickHref, setQuickHref] =
    useState("");

  const [quickStatus, setQuickStatus] =
    useState(true);

  const [editingId, setEditingId] =
    useState(null);


  /* =====================================================
     LOAD
  ====================================================== */

  const loadFooter = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/inner-footer`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {

        setSettings({
          ...defaultSettings,
          ...data.settings,
        });

        setQuickLinks(
          data.quickLinks || []
        );

      }

    } catch (error) {

      console.error(
        "Load error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadFooter();
  }, []);


  /* =====================================================
     HANDLE INPUT
  ====================================================== */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  /* =====================================================
     SAVE SETTINGS
  ====================================================== */

  const saveSettings = async () => {

    try {

      setSaving(true);

      const response = await fetch(
        `${API_URL}/inner-footer/settings`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            settings
          ),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message
        );
      }

      alert(
        "Inner footer settings saved successfully"
      );

      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Failed to save settings"
      );

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     LOGO UPLOAD
  ====================================================== */

  const handleLogoUpload = async (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Maximum file size is 5 MB"
      );

      return;
    }


    setLogoPreview(
      URL.createObjectURL(file)
    );


    const formData =
      new FormData();

    formData.append(
      "logo",
      file
    );


    try {

      const response =
        await fetch(
          `${API_URL}/inner-footer/logo`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message
        );

      }


      alert(
        "Logo uploaded successfully"
      );


      setLogoPreview("");

      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Logo upload failed"
      );

      setLogoPreview("");

    }
  };


  /* =====================================================
     DELETE LOGO
  ====================================================== */

  const deleteLogo = async () => {

    if (
      !window.confirm(
        "Delete footer logo?"
      )
    ) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/inner-footer/logo`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message
        );

      }


      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Delete failed"
      );

    }
  };


  /* =====================================================
     BACKGROUND UPLOAD
  ====================================================== */

  const handleBackgroundUpload = async (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;


    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Maximum file size is 5 MB"
      );

      return;
    }


    setBackgroundPreview(
      URL.createObjectURL(file)
    );


    const formData =
      new FormData();

    formData.append(
      "background",
      file
    );


    try {

      const response =
        await fetch(
          `${API_URL}/inner-footer/background`,
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message
        );

      }


      alert(
        "Background uploaded successfully"
      );


      setBackgroundPreview("");

      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Background upload failed"
      );

      setBackgroundPreview("");

    }
  };


  /* =====================================================
     DELETE BACKGROUND
  ====================================================== */

  const deleteBackground = async () => {

    if (
      !window.confirm(
        "Delete background image?"
      )
    ) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/inner-footer/background`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message
        );

      }


      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Delete failed"
      );

    }
  };


  /* =====================================================
     ADD / UPDATE QUICK LINK
  ====================================================== */

  const saveQuickLink = async () => {

    if (
      !quickName.trim() ||
      !quickHref.trim()
    ) {

      alert(
        "Enter link name and URL"
      );

      return;
    }


    try {

      const isEditing =
        editingId !== null;


      const url = isEditing
        ? `${API_URL}/inner-footer/quick-links/${editingId}`
        : `${API_URL}/inner-footer/quick-links`;


      const response =
        await fetch(
          url,
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                quickName,

              href:
                quickHref,

              status:
                quickStatus,
            }),
          }
        );


      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message
        );

      }


      resetQuickForm();

      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Failed to save quick link"
      );

    }
  };


  /* =====================================================
     EDIT QUICK LINK
  ====================================================== */

  const editQuickLink = (item) => {

    setEditingId(item.id);

    setQuickName(item.name);

    setQuickHref(item.href);

    setQuickStatus(
      Number(item.status) === 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     DELETE QUICK LINK
  ====================================================== */

  const deleteQuickLink = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete this quick link?"
      )
    ) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/inner-footer/quick-links/${id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message
        );

      }


      await loadFooter();

    } catch (error) {

      alert(
        error.message ||
        "Delete failed"
      );

    }
  };


  /* =====================================================
     RESET QUICK FORM
  ====================================================== */

  const resetQuickForm = () => {

    setEditingId(null);

    setQuickName("");

    setQuickHref("");

    setQuickStatus(true);

  };


  /* =====================================================
     DRAG START
  ====================================================== */

  const [draggedId, setDraggedId] =
    useState(null);


  const handleDragStart = (
    id
  ) => {

    setDraggedId(id);

  };


  const handleDrop = async (
    targetId
  ) => {

    if (
      draggedId === null ||
      draggedId === targetId
    ) {
      return;
    }


    const oldList = [
      ...quickLinks,
    ];


    const draggedIndex =
      oldList.findIndex(
        (item) =>
          item.id === draggedId
      );


    const targetIndex =
      oldList.findIndex(
        (item) =>
          item.id === targetId
      );


    const newList = [
      ...oldList,
    ];


    const [removed] =
      newList.splice(
        draggedIndex,
        1
      );


    newList.splice(
      targetIndex,
      0,
      removed
    );


    setQuickLinks(newList);


    try {

      await fetch(
        `${API_URL}/inner-footer/quick-links/reorder`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            items:
              newList,
          }),
        }
      );

    } catch (error) {

      console.error(
        "Reorder error:",
        error
      );

      await loadFooter();

    }


    setDraggedId(null);

  };


  if (loading) {

    return (
      <div className="p-6">
        Loading Inner Footer...
      </div>
    );

  }


  return (

    <div
      className="
        min-h-screen
        bg-gray-100
        p-4
        md:p-6
      "
    >

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-3
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
                text-gray-800
              "
            >
              Inner Footer
            </h1>

            <p className="text-sm text-gray-500">
              Manage your website inner footer
            </p>

          </div>


          <button
            onClick={loadFooter}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-gray-800
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-gray-700
            "
          >

            <FiRefreshCw />

            Refresh

          </button>

        </div>


        {/* =================================================
            SETTINGS
        ================================================== */}

        <div
          className="
            mb-6
            rounded-xl
            bg-white
            p-5
            shadow-sm
            md:p-6
          "
        >

          <h2
            className="
              mb-5
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Footer Settings
          </h2>


          <div
            className="
              grid
              grid-cols-1
              gap-5
              lg:grid-cols-2
            "
          >


            {/* DESCRIPTION */}

            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={
                  settings.description
                }
                onChange={
                  handleChange
                }
                rows={4}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* PHONE */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <input
                name="phone"
                value={
                  settings.phone
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                name="email"
                value={
                  settings.email
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* ADDRESS */}

            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Address
              </label>

              <input
                name="address"
                value={
                  settings.address
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* FACEBOOK */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Facebook URL
              </label>

              <input
                name="facebook_url"
                value={
                  settings.facebook_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://facebook.com/..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* INSTAGRAM */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Instagram URL
              </label>

              <input
                name="instagram_url"
                value={
                  settings.instagram_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://instagram.com/..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* YOUTUBE */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                YouTube URL
              </label>

              <input
                name="youtube_url"
                value={
                  settings.youtube_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://youtube.com/..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* COPYRIGHT */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Copyright Year
              </label>

              <input
                name="copyright_year"
                value={
                  settings.copyright_year
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  outline-none
                  focus:border-black
                "
              />

            </div>


            {/* PRIVACY TEXT */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Privacy Text
              </label>

              <input
                name="privacy_text"
                value={
                  settings.privacy_text
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />

            </div>


            {/* PRIVACY URL */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Privacy URL
              </label>

              <input
                name="privacy_url"
                value={
                  settings.privacy_url
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />

            </div>


            {/* POWERED BY */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Powered By Text
              </label>

              <input
                name="powered_by_text"
                value={
                  settings.powered_by_text
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />

            </div>


            {/* POWERED URL */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Powered By URL
              </label>

              <input
                name="powered_by_url"
                value={
                  settings.powered_by_url
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />

            </div>

          </div>


          {/* =================================================
              SAVE
          ================================================== */}

          <div className="mt-6">

            <button
              onClick={saveSettings}
              disabled={saving}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-black
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-gray-800
                disabled:opacity-50
              "
            >

              <FiSave />

              {saving
                ? "Saving..."
                : "Save Settings"}

            </button>

          </div>

        </div>


        {/* =================================================
            IMAGES
        ================================================== */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >


          {/* LOGO */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Footer Logo
            </h2>


            <div
              className="
                mb-4
                flex
                min-h-[160px]
                items-center
                justify-center
                rounded-lg
                border-2
                border-dashed
                border-gray-300
                bg-gray-50
                p-5
              "
            >

              {(logoPreview ||
                settings.logo) ? (

                <img
                  src={
                    logoPreview ||
                    `${IMAGE_URL}${settings.logo}`
                  }
                  alt="Footer Logo"
                  className="
                    max-h-[140px]
                    max-w-full
                    object-contain
                  "
                />

              ) : (

                <span className="text-sm text-gray-400">
                  No logo uploaded
                </span>

              )}

            </div>


            <div className="flex flex-wrap gap-2">

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-lg
                  bg-black
                  px-4
                  py-2
                  text-sm
                  text-white
                "
              >

                <FiUpload />

                Upload Logo

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={
                    handleLogoUpload
                  }
                />

              </label>


              {settings.logo && (

                <button
                  onClick={
                    deleteLogo
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2
                    text-sm
                    text-white
                  "
                >

                  <FiTrash2 />

                  Delete

                </button>

              )}

            </div>

          </div>


          {/* BACKGROUND */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold">
              Background Image
            </h2>


            <div
              className="
                mb-4
                h-[160px]
                overflow-hidden
                rounded-lg
                border
                bg-gray-100
              "
            >

              {(backgroundPreview ||
                settings.background_image) ? (

                <img
                  src={
                    backgroundPreview ||
                    `${IMAGE_URL}${settings.background_image}`
                  }
                  alt="Footer Background"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

              ) : (

                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No background uploaded
                </div>

              )}

            </div>


            <div className="flex flex-wrap gap-2">

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-lg
                  bg-black
                  px-4
                  py-2
                  text-sm
                  text-white
                "
              >

                <FiUpload />

                Upload Background

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={
                    handleBackgroundUpload
                  }
                />

              </label>


              {settings.background_image && (

                <button
                  onClick={
                    deleteBackground
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2
                    text-sm
                    text-white
                  "
                >

                  <FiTrash2 />

                  Delete

                </button>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            QUICK LINKS
        ================================================== */}

        <div
          className="
            rounded-xl
            bg-white
            p-5
            shadow-sm
            md:p-6
          "
        >

          <h2
            className="
              mb-5
              text-lg
              font-semibold
            "
          >
            Quick Links
          </h2>


          {/* FORM */}

          <div
            className="
              mb-6
              grid
              grid-cols-1
              gap-3
              md:grid-cols-12
            "
          >

            <input
              value={quickName}
              onChange={(e) =>
                setQuickName(
                  e.target.value
                )
              }
              placeholder="Link Name"
              className="
                rounded-lg
                border
                px-3
                py-2
                md:col-span-4
              "
            />


            <input
              value={quickHref}
              onChange={(e) =>
                setQuickHref(
                  e.target.value
                )
              }
              placeholder="URL / Path"
              className="
                rounded-lg
                border
                px-3
                py-2
                md:col-span-4
              "
            />


            <label
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                px-3
                py-2
                md:col-span-2
              "
            >

              <input
                type="checkbox"
                checked={quickStatus}
                onChange={(e) =>
                  setQuickStatus(
                    e.target.checked
                  )
                }
              />

              Active

            </label>


            <button
              onClick={
                saveQuickLink
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-black
                px-4
                py-2
                text-sm
                text-white
              "
            >

              {editingId
                ? <FiSave />
                : <FiPlus />}

              {editingId
                ? "Update"
                : "Add"}

            </button>

          </div>


          {/* CANCEL */}

          {editingId && (

            <button
              onClick={
                resetQuickForm
              }
              className="
                mb-4
                flex
                items-center
                gap-2
                text-sm
                text-gray-600
              "
            >

              <FiX />

              Cancel Editing

            </button>

          )}


          {/* LIST */}

          <div className="space-y-2">

            {quickLinks.map(
              (item) => (

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
                    cursor-move
                    flex-col
                    gap-3
                    rounded-lg
                    border
                    bg-gray-50
                    p-3

                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >

                  <div className="flex items-center gap-3">

                    <FiMenu
                      className="text-gray-400"
                    />

                    <div>

                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.href}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-2">

                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        ${
                          Number(item.status) === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }
                      `}
                    >
                      {Number(item.status) === 1
                        ? "Active"
                        : "Hidden"}
                    </span>


                    <button
                      onClick={() =>
                        editQuickLink(
                          item
                        )
                      }
                      className="
                        rounded-lg
                        border
                        p-2
                        text-blue-600
                        hover:bg-blue-50
                      "
                    >

                      <FiEdit2 />

                    </button>


                    <button
                      onClick={() =>
                        deleteQuickLink(
                          item.id
                        )
                      }
                      className="
                        rounded-lg
                        border
                        p-2
                        text-red-600
                        hover:bg-red-50
                      "
                    >

                      <FiTrash2 />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );
};


export default InnerFooterAdmin;