import React, {
  useEffect,
  useState
} from "react";

import {
  FiUpload,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiMenu,
  FiRefreshCw
} from "react-icons/fi";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const SERVER_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "";


/*
|--------------------------------------------------------------------------
| Image URL
|--------------------------------------------------------------------------
*/

const getImageUrl = (image) => {

  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${SERVER_URL}${
    image.startsWith("/")
      ? image
      : `/${image}`
  }`;
};


const emptySettings = {

  description: "",

  phone: "",

  address: "",

  email: "",

  privacy_text: "PRIVATE POLICY",

  privacy_url: "#",

  copyright_year: "2026",

  powered_by_text: "Bonifon",

  powered_by_url:
    "https://www.bonifontechnologies.com",

  facebook_url: "",

  instagram_url: "",

  youtube_url: ""
};


const emptyLink = {

  name: "",

  href: "",

  sort_order: 0,

  status: 1
};


export default function FooterAdmin() {

  /*
  |--------------------------------------------------------------------------
  | Main State
  |--------------------------------------------------------------------------
  */

  const [settings, setSettings] =
    useState(emptySettings);

  const [logo, setLogo] =
    useState("");

  const [logoFile, setLogoFile] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [quickLinks, setQuickLinks] =
    useState([]);

  const [academicLinks, setAcademicLinks] =
    useState([]);


  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [quickForm, setQuickForm] =
    useState(emptyLink);

  const [academicForm, setAcademicForm] =
    useState(emptyLink);


  const [editingQuickId, setEditingQuickId] =
    useState(null);

  const [editingAcademicId, setEditingAcademicId] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | UI State
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] =
    useState(true);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [draggedQuickId, setDraggedQuickId] =
    useState(null);

  const [draggedAcademicId, setDraggedAcademicId] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | Load Footer
  |--------------------------------------------------------------------------
  */

  const fetchFooter = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/footer`,
          {
            cache: "no-store"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load footer"
        );
      }

      if (data.settings) {

        setSettings({
          ...emptySettings,
          ...data.settings
        });

        setLogo(
          data.settings.logo || ""
        );

        setLogoPreview(
          data.settings.logo
            ? getImageUrl(
                data.settings.logo
              )
            : ""
        );
      }

      setQuickLinks(
        data.quickLinks || []
      );

      setAcademicLinks(
        data.academicLinks || []
      );

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Unable to load footer"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchFooter();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Settings Change
  |--------------------------------------------------------------------------
  */

  const handleSettingsChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setSettings(
      previous => ({
        ...previous,
        [name]: value
      })
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Save Settings
  |--------------------------------------------------------------------------
  */

  const saveSettings = async () => {

    try {

      setSavingSettings(true);

      const response =
        await fetch(
          `${API_URL}/footer/settings`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
              settings
            )
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save settings"
        );
      }

      alert(
        "Footer settings saved successfully"
      );

      await fetchFooter();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to save settings"
      );

    } finally {

      setSavingSettings(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Logo File Select
  |--------------------------------------------------------------------------
  */

  const handleLogoSelect = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file"
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Logo image must be below 5 MB"
      );

      return;
    }

    setLogoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setLogoPreview(
      previewUrl
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Upload Logo
  |--------------------------------------------------------------------------
  */

  const uploadLogo = async () => {

    if (!logoFile) {

      alert(
        "Please select a logo first"
      );

      return;
    }

    try {

      setUploadingLogo(true);

      const formData =
        new FormData();

      formData.append(
        "logo",
        logoFile
      );

      const response =
        await fetch(
          `${API_URL}/footer/logo`,
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Logo upload failed"
        );
      }

      setLogo(
        data.logo || ""
      );

      setLogoFile(null);

      alert(
        "Logo uploaded successfully"
      );

      await fetchFooter();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Logo upload failed"
      );

    } finally {

      setUploadingLogo(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Delete Logo
  |--------------------------------------------------------------------------
  */

  const deleteLogo = async () => {

    if (!logo) {

      alert(
        "There is no logo to delete"
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete the footer logo?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/footer/logo`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete logo"
        );
      }

      setLogo("");

      setLogoPreview("");

      setLogoFile(null);

      alert(
        "Logo deleted successfully"
      );

      await fetchFooter();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to delete logo"
      );

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Quick Form Change
  |--------------------------------------------------------------------------
  */

  const handleQuickFormChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setQuickForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Academic Form Change
  |--------------------------------------------------------------------------
  */

  const handleAcademicFormChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setAcademicForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Add / Update Quick Link
  |--------------------------------------------------------------------------
  */

  const saveQuickLink = async (
    event
  ) => {

    event.preventDefault();

    if (
      !quickForm.name.trim() ||
      !quickForm.href.trim()
    ) {

      alert(
        "Please enter link name and URL"
      );

      return;
    }

    try {

      const isEditing =
        editingQuickId !== null;

      const url = isEditing
        ? `${API_URL}/footer/quick-links/${editingQuickId}`
        : `${API_URL}/footer/quick-links`;

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
                "application/json"
            },

            body: JSON.stringify({
              ...quickForm,
              sort_order:
                Number(
                  quickForm.sort_order
                ),
              status:
                Number(
                  quickForm.status
                )
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save quick link"
        );
      }

      setQuickForm(
        emptyLink
      );

      setEditingQuickId(
        null
      );

      await fetchFooter();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to save quick link"
      );

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Add / Update Academic Link
  |--------------------------------------------------------------------------
  */

  const saveAcademicLink = async (
    event
  ) => {

    event.preventDefault();

    if (
      !academicForm.name.trim() ||
      !academicForm.href.trim()
    ) {

      alert(
        "Please enter link name and URL"
      );

      return;
    }

    try {

      const isEditing =
        editingAcademicId !== null;

      const url = isEditing
        ? `${API_URL}/footer/academic-links/${editingAcademicId}`
        : `${API_URL}/footer/academic-links`;

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
                "application/json"
            },

            body: JSON.stringify({
              ...academicForm,
              sort_order:
                Number(
                  academicForm.sort_order
                ),
              status:
                Number(
                  academicForm.status
                )
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save academic link"
        );
      }

      setAcademicForm(
        emptyLink
      );

      setEditingAcademicId(
        null
      );

      await fetchFooter();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to save academic link"
      );

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Edit Quick Link
  |--------------------------------------------------------------------------
  */

  const editQuickLink = (
    item
  ) => {

    setEditingQuickId(
      item.id
    );

    setQuickForm({
      name: item.name || "",
      href: item.href || "",
      sort_order:
        item.sort_order || 0,
      status:
        item.status ?? 1
    });

    window.scrollTo({
      top: 700,
      behavior: "smooth"
    });
  };


  /*
  |--------------------------------------------------------------------------
  | Edit Academic Link
  |--------------------------------------------------------------------------
  */

  const editAcademicLink = (
    item
  ) => {

    setEditingAcademicId(
      item.id
    );

    setAcademicForm({
      name: item.name || "",
      href: item.href || "",
      sort_order:
        item.sort_order || 0,
      status:
        item.status ?? 1
    });

    window.scrollTo({
      top: 700,
      behavior: "smooth"
    });
  };


  /*
  |--------------------------------------------------------------------------
  | Delete Quick Link
  |--------------------------------------------------------------------------
  */

  const deleteQuickLink = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Delete this quick link?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/footer/quick-links/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Delete failed"
        );
      }

      await fetchFooter();

    } catch (error) {

      alert(
        error.message ||
        "Delete failed"
      );

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Delete Academic Link
  |--------------------------------------------------------------------------
  */

  const deleteAcademicLink = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Delete this academic link?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/footer/academic-links/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Delete failed"
        );
      }

      await fetchFooter();

    } catch (error) {

      alert(
        error.message ||
        "Delete failed"
      );

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Reorder Quick Links
  |--------------------------------------------------------------------------
  */

  const reorderQuickLinks = async (
    draggedId,
    targetId
  ) => {

    if (
      draggedId === targetId
    ) {
      return;
    }

    const oldIndex =
      quickLinks.findIndex(
        item =>
          item.id === draggedId
      );

    const newIndex =
      quickLinks.findIndex(
        item =>
          item.id === targetId
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const updated = [
      ...quickLinks
    ];

    const [
      movedItem
    ] = updated.splice(
      oldIndex,
      1
    );

    updated.splice(
      newIndex,
      0,
      movedItem
    );

    setQuickLinks(
      updated
    );

    try {

      const response =
        await fetch(
          `${API_URL}/footer/quick-links/reorder`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              items: updated.map(
                (item, index) => ({
                  id: item.id,
                  sort_order:
                    index + 1
                })
              )
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to reorder"
        );
      }

    } catch (error) {

      alert(
        error.message ||
        "Failed to save sorting"
      );

      await fetchFooter();
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Reorder Academic Links
  |--------------------------------------------------------------------------
  */

  const reorderAcademicLinks = async (
    draggedId,
    targetId
  ) => {

    if (
      draggedId === targetId
    ) {
      return;
    }

    const oldIndex =
      academicLinks.findIndex(
        item =>
          item.id === draggedId
      );

    const newIndex =
      academicLinks.findIndex(
        item =>
          item.id === targetId
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const updated = [
      ...academicLinks
    ];

    const [
      movedItem
    ] = updated.splice(
      oldIndex,
      1
    );

    updated.splice(
      newIndex,
      0,
      movedItem
    );

    setAcademicLinks(
      updated
    );

    try {

      const response =
        await fetch(
          `${API_URL}/footer/academic-links/reorder`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              items: updated.map(
                (item, index) => ({
                  id: item.id,
                  sort_order:
                    index + 1
                })
              )
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to reorder"
        );
      }

    } catch (error) {

      alert(
        error.message ||
        "Failed to save sorting"
      );

      await fetchFooter();
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Drag Events - Quick
  |--------------------------------------------------------------------------
  */

  const handleQuickDragStart = (
    event,
    id
  ) => {

    setDraggedQuickId(
      id
    );

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(id)
    );
  };


  const handleQuickDrop = (
    event,
    targetId
  ) => {

    event.preventDefault();

    const draggedId =
      Number(
        event.dataTransfer.getData(
          "text/plain"
        )
      );

    reorderQuickLinks(
      draggedId,
      targetId
    );

    setDraggedQuickId(
      null
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Drag Events - Academic
  |--------------------------------------------------------------------------
  */

  const handleAcademicDragStart = (
    event,
    id
  ) => {

    setDraggedAcademicId(
      id
    );

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(id)
    );
  };


  const handleAcademicDrop = (
    event,
    targetId
  ) => {

    event.preventDefault();

    const draggedId =
      Number(
        event.dataTransfer.getData(
          "text/plain"
        )
      );

    reorderAcademicLinks(
      draggedId,
      targetId
    );

    setDraggedAcademicId(
      null
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="p-8 text-center">

        <FiRefreshCw
          className="mx-auto animate-spin"
          size={28}
        />

        <p className="mt-3 text-gray-600">
          Loading footer...
        </p>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-gray-800">

              Footer Management

            </h1>

            <p className="text-sm text-gray-500">

              Manage website footer content,
              logo and navigation links.

            </p>

          </div>

          <button
            type="button"
            onClick={fetchFooter}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >

            <FiRefreshCw />

            Refresh

          </button>

        </div>


        {/* ========================================================= */}
        {/* LOGO */}
        {/* ========================================================= */}

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold text-gray-800">

            Footer Logo

          </h2>


          <div className="grid gap-6 md:grid-cols-2">

            {/* Preview */}

            <div>

              <p className="mb-2 text-sm font-medium text-gray-600">

                Current Preview

              </p>

              <div className="flex min-h-[180px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">

                {logoPreview ? (

                  <img
                    src={logoPreview}
                    alt="Footer Logo"
                    className="max-h-40 max-w-full object-contain"
                  />

                ) : (

                  <div className="text-center text-gray-400">

                    <p>
                      No logo uploaded
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* Upload */}

            <div>

              <p className="mb-2 text-sm font-medium text-gray-600">

                Upload New Logo

              </p>

              <div className="rounded-xl border border-gray-200 p-5">

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleLogoSelect
                  }
                  className="mb-4 block w-full text-sm"
                />


                {logoFile && (

                  <p className="mb-4 text-sm text-gray-500">

                    Selected:
                    {" "}
                    {logoFile.name}

                  </p>

                )}


                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={uploadLogo}
                    disabled={
                      !logoFile ||
                      uploadingLogo
                    }
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <FiUpload />

                    {uploadingLogo
                      ? "Uploading..."
                      : "Upload Logo"}

                  </button>


                  {logo && (

                    <button
                      type="button"
                      onClick={deleteLogo}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >

                      <FiTrash2 />

                      Delete Logo

                    </button>

                  )}

                </div>


                <p className="mt-3 text-xs text-gray-500">

                  Maximum file size: 5 MB.
                  Image files only.

                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================================= */}
        {/* FOOTER SETTINGS */}
        {/* ========================================================= */}

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-800">

                Footer Settings

              </h2>

              <p className="text-sm text-gray-500">

                Manage contact information,
                social media and copyright.

              </p>

            </div>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Description */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Description

              </label>

              <textarea
                name="description"
                value={
                  settings.description
                }
                onChange={
                  handleSettingsChange
                }
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>


            {/* Phone */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Phone

              </label>

              <input
                name="phone"
                value={
                  settings.phone
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Email

              </label>

              <input
                type="email"
                name="email"
                value={
                  settings.email
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Address */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Address

              </label>

              <input
                name="address"
                value={
                  settings.address
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Facebook */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Facebook URL

              </label>

              <input
                name="facebook_url"
                value={
                  settings.facebook_url
                }
                onChange={
                  handleSettingsChange
                }
                placeholder="https://facebook.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Instagram */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Instagram URL

              </label>

              <input
                name="instagram_url"
                value={
                  settings.instagram_url
                }
                onChange={
                  handleSettingsChange
                }
                placeholder="https://instagram.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Youtube */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                YouTube URL

              </label>

              <input
                name="youtube_url"
                value={
                  settings.youtube_url
                }
                onChange={
                  handleSettingsChange
                }
                placeholder="https://youtube.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Privacy Text */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Privacy Text

              </label>

              <input
                name="privacy_text"
                value={
                  settings.privacy_text
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Privacy URL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Privacy URL

              </label>

              <input
                name="privacy_url"
                value={
                  settings.privacy_url
                }
                onChange={
                  handleSettingsChange
                }
                placeholder="/privacy-policy"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Copyright */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Copyright Year

              </label>

              <input
                name="copyright_year"
                value={
                  settings.copyright_year
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Powered By */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Powered By Text

              </label>

              <input
                name="powered_by_text"
                value={
                  settings.powered_by_text
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>


            {/* Powered By URL */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">

                Powered By URL

              </label>

              <input
                name="powered_by_url"
                value={
                  settings.powered_by_url
                }
                onChange={
                  handleSettingsChange
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />

            </div>

          </div>


          <div className="mt-6">

            <button
              type="button"
              onClick={
                saveSettings
              }
              disabled={
                savingSettings
              }
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >

              <FiSave />

              {savingSettings
                ? "Saving..."
                : "Save Footer Settings"}

            </button>

          </div>

        </div>


        {/* ========================================================= */}
        {/* LINKS */}
        {/* ========================================================= */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ======================================================= */}
          {/* QUICK LINKS */}
          {/* ======================================================= */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-5">

              <h2 className="text-lg font-semibold text-gray-800">

                Quick Links

              </h2>

              <p className="mt-1 text-xs text-gray-500">

                Drag and drop to change display order.

              </p>

            </div>


            {/* Link List */}

            <div className="space-y-2">

              {quickLinks.map(
                (item, index) => (

                  <div
                    key={item.id}
                    draggable
                    onDragStart={
                      event =>
                        handleQuickDragStart(
                          event,
                          item.id
                        )
                    }
                    onDragOver={
                      event =>
                        event.preventDefault()
                    }
                    onDrop={
                      event =>
                        handleQuickDrop(
                          event,
                          item.id
                        )
                    }
                    className={`flex cursor-move items-center gap-3 rounded-lg border p-3 transition ${
                      draggedQuickId ===
                      item.id
                        ? "border-blue-400 bg-blue-50 opacity-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >

                    <FiMenu
                      className="shrink-0 text-gray-400"
                      size={20}
                    />


                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">

                      {index + 1}

                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium text-gray-800">

                        {item.name}

                      </p>

                      <p className="truncate text-xs text-gray-400">

                        {item.href}

                      </p>

                    </div>


                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                        Number(item.status)
                          === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {Number(item.status)
                        === 1
                        ? "Active"
                        : "Hidden"}

                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        editQuickLink(
                          item
                        )
                      }
                      className="rounded p-2 text-blue-600 hover:bg-blue-50"
                    >

                      <FiEdit2 />

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        deleteQuickLink(
                          item.id
                        )
                      }
                      className="rounded p-2 text-red-600 hover:bg-red-50"
                    >

                      <FiTrash2 />

                    </button>

                  </div>

                )
              )}


              {quickLinks.length === 0 && (

                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">

                  No quick links added.

                </div>

              )}

            </div>


            {/* Quick Link Form */}

            <form
              onSubmit={
                saveQuickLink
              }
              className="mt-6 border-t pt-6"
            >

              <h3 className="mb-4 font-medium text-gray-800">

                {editingQuickId
                  ? "Edit Quick Link"
                  : "Add Quick Link"}

              </h3>


              <div className="space-y-3">

                <input
                  name="name"
                  value={
                    quickForm.name
                  }
                  onChange={
                    handleQuickFormChange
                  }
                  placeholder="Link name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <input
                  name="href"
                  value={
                    quickForm.href
                  }
                  onChange={
                    handleQuickFormChange
                  }
                  placeholder="/index.php/about-us"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />


                <select
                  name="status"
                  value={
                    quickForm.status
                  }
                  onChange={
                    handleQuickFormChange
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >

                  <option value={1}>
                    Active
                  </option>

                  <option value={0}>
                    Hidden
                  </option>

                </select>


                <div className="flex gap-2">

                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >

                    {editingQuickId
                      ? <FiSave />
                      : <FiPlus />}

                    {editingQuickId
                      ? "Update"
                      : "Add Link"}

                  </button>


                  {editingQuickId && (

                    <button
                      type="button"
                      onClick={() => {

                        setEditingQuickId(
                          null
                        );

                        setQuickForm(
                          emptyLink
                        );

                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-600"
                    >

                      <FiX />

                    </button>

                  )}

                </div>

              </div>

            </form>

          </div>


          {/* ======================================================= */}
          {/* ACADEMIC LINKS */}
          {/* ======================================================= */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-5">

              <h2 className="text-lg font-semibold text-gray-800">

                Our Academics

              </h2>

              <p className="mt-1 text-xs text-gray-500">

                Drag and drop to change display order.

              </p>

            </div>


            {/* Academic List */}

            <div className="space-y-2">

              {academicLinks.map(
                (item, index) => (

                  <div
                    key={item.id}
                    draggable
                    onDragStart={
                      event =>
                        handleAcademicDragStart(
                          event,
                          item.id
                        )
                    }
                    onDragOver={
                      event =>
                        event.preventDefault()
                    }
                    onDrop={
                      event =>
                        handleAcademicDrop(
                          event,
                          item.id
                        )
                    }
                    className={`flex cursor-move items-center gap-3 rounded-lg border p-3 transition ${
                      draggedAcademicId ===
                      item.id
                        ? "border-blue-400 bg-blue-50 opacity-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >

                    <FiMenu
                      className="shrink-0 text-gray-400"
                      size={20}
                    />


                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">

                      {index + 1}

                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium text-gray-800">

                        {item.name}

                      </p>

                      <p className="truncate text-xs text-gray-400">

                        {item.href}

                      </p>

                    </div>


                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                        Number(item.status)
                          === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {Number(item.status)
                        === 1
                        ? "Active"
                        : "Hidden"}

                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        editAcademicLink(
                          item
                        )
                      }
                      className="rounded p-2 text-blue-600 hover:bg-blue-50"
                    >

                      <FiEdit2 />

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        deleteAcademicLink(
                          item.id
                        )
                      }
                      className="rounded p-2 text-red-600 hover:bg-red-50"
                    >

                      <FiTrash2 />

                    </button>

                  </div>

                )
              )}


              {academicLinks.length === 0 && (

                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">

                  No academic links added.

                </div>

              )}

            </div>


            {/* Academic Form */}

            <form
              onSubmit={
                saveAcademicLink
              }
              className="mt-6 border-t pt-6"
            >

              <h3 className="mb-4 font-medium text-gray-800">

                {editingAcademicId
                  ? "Edit Academic Link"
                  : "Add Academic Link"}

              </h3>


              <div className="space-y-3">

                <input
                  name="name"
                  value={
                    academicForm.name
                  }
                  onChange={
                    handleAcademicFormChange
                  }
                  placeholder="Link name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <input
                  name="href"
                  value={
                    academicForm.href
                  }
                  onChange={
                    handleAcademicFormChange
                  }
                  placeholder="/index.php/admission-procedure"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />


                <select
                  name="status"
                  value={
                    academicForm.status
                  }
                  onChange={
                    handleAcademicFormChange
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >

                  <option value={1}>
                    Active
                  </option>

                  <option value={0}>
                    Hidden
                  </option>

                </select>


                <div className="flex gap-2">

                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >

                    {editingAcademicId
                      ? <FiSave />
                      : <FiPlus />}

                    {editingAcademicId
                      ? "Update"
                      : "Add Link"}

                  </button>


                  {editingAcademicId && (

                    <button
                      type="button"
                      onClick={() => {

                        setEditingAcademicId(
                          null
                        );

                        setAcademicForm(
                          emptyLink
                        );

                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-600"
                    >

                      <FiX />

                    </button>

                  )}

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}