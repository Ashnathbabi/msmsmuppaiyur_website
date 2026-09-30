
import React, { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "";

const emptyStep = {
  step_number: "",
  title: "",
  description: "",
};

const emptyFacility = {
  title: "",
  link: "",
  sort_order: 0,
  status: 1,
  image: null,
};

const getImageUrl = (image) => {
  if (!image) return "";

  // Already complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // /uploads/howtoapply/image.png
  if (image.startsWith("/uploads/")) {
    return `${IMAGE_URL}${image}`;
  }

  // uploads/howtoapply/image.png
  if (image.startsWith("uploads/")) {
    return `${IMAGE_URL}/${image}`;
  }

  // only filename
  return `${IMAGE_URL}/uploads/howtoapply/${image}`;
};

const AdminHowToApply = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [settings, setSettings] = useState({
    badge_title: "How to apply",
    heading: "Admissions Made Easy for Future Achievers",
    center_image: "",
  });

  const [centerImage, setCenterImage] = useState(null);
  const [centerPreview, setCenterPreview] = useState("");

  const [steps, setSteps] = useState([]);
  const [facilities, setFacilities] = useState([]);

  // Step Modal
  const [stepModal, setStepModal] = useState(false);
  const [editingStepId, setEditingStepId] = useState(null);
  const [stepForm, setStepForm] = useState(emptyStep);

  // Facility Modal
  const [facilityModal, setFacilityModal] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState(null);
  const [facilityForm, setFacilityForm] = useState(emptyFacility);
  const [facilityPreview, setFacilityPreview] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);

    const url = `${API_URL}/how-to-apply`;

    console.log("GET:", url);

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: Failed to load How To Apply`
      );
    }

    const data = await response.json();

    console.log("HOW TO APPLY RESPONSE:", data);
    console.log(
      "CENTER IMAGE FROM API:",
      data?.settings?.center_image
    );

    if (!data.success) {
      throw new Error(
        data.message || "Failed to load How To Apply data"
      );
    }

    const settingsData = data.settings || {};

    setSettings({
      badge_title: settingsData.badge_title || "",
      heading: settingsData.heading || "",
      center_image: settingsData.center_image || "",
    });

    // ==============================
    // CENTER IMAGE
    // ==============================
    if (settingsData.center_image) {
      const imageUrl = getImageUrl(
        settingsData.center_image
      );

      console.log("CENTER IMAGE URL:", imageUrl);

      setCenterPreview(imageUrl);
    } else {
      setCenterPreview("");
    }

    setSteps(data.steps || []);
    setFacilities(data.facilities || []);

  } catch (error) {
    console.error("FETCH HOW TO APPLY ERROR:", error);

    showMessage(
      "error",
      error.message || "Unable to load How To Apply data"
    );
  } finally {
    setLoading(false);
  }
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
  // SETTINGS
  // =====================================================

  const saveSettings = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/how-to-apply/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            badge_title: settings.badge_title,
            heading: settings.heading,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save settings"
        );
      }

      showMessage(
        "success",
        "Settings saved successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CENTER IMAGE
  // =====================================================

  const handleCenterImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCenterImage(file);

    // Local preview before upload
    setCenterPreview(
      URL.createObjectURL(file)
    );
  };

 const uploadCenterImage = async () => {
  console.log("UPLOAD BUTTON CLICKED");
  console.log("CENTER IMAGE:", centerImage);

  if (!centerImage) {
    showMessage("error", "Please select an image first");
    return;
  }

  try {
    setSaving(true);

    const formData = new FormData();
    formData.append("image", centerImage);

    console.log("SENDING IMAGE:", centerImage.name);

    const response = await fetch(
      `${API_URL}/how-to-apply/center-image`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("UPLOAD RESPONSE STATUS:", response.status);

    const data = await response.json();

    console.log("UPLOAD RESPONSE:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Image upload failed"
      );
    }

    showMessage(
      "success",
      "Center image uploaded successfully"
    );

    setCenterImage(null);

    await fetchData();

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    showMessage(
      "error",
      error.message || "Image upload failed"
    );

  } finally {
    setSaving(false);
  }
};

  // =====================================================
  // STEP MODAL
  // =====================================================

  const openAddStep = () => {
    setEditingStepId(null);

    setStepForm({
      step_number: String(
        steps.length + 1
      ).padStart(2, "0"),
      title: "",
      description: "",
    });

    setStepModal(true);
  };

  const openEditStep = (step) => {
    setEditingStepId(step.id);

    setStepForm({
      step_number: step.step_number || "",
      title: step.title || "",
      description: step.description || "",
    });

    setStepModal(true);
  };

  const closeStepModal = () => {
    setStepModal(false);
    setEditingStepId(null);
    setStepForm(emptyStep);
  };

  const saveStep = async () => {
    if (!stepForm.title.trim()) {
      showMessage(
        "error",
        "Step title is required"
      );
      return;
    }

    if (!stepForm.description.trim()) {
      showMessage(
        "error",
        "Step description is required"
      );
      return;
    }

    try {
      setSaving(true);

      const url = editingStepId
        ? `${API_URL}/how-to-apply/steps/${editingStepId}`
        : `${API_URL}/how-to-apply/steps`;

      const response = await fetch(url, {
        method: editingStepId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stepForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save step"
        );
      }

      showMessage(
        "success",
        editingStepId
          ? "Step updated successfully"
          : "Step added successfully"
      );

      closeStepModal();

      await fetchData();
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Failed to save step"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteStep = async (id) => {
    if (!window.confirm("Delete this step?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/how-to-apply/steps/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete step"
        );
      }

      showMessage(
        "success",
        "Step deleted successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Failed to delete step"
      );
    }
  };

  // =====================================================
  // FACILITY MODAL
  // =====================================================

  const openAddFacility = () => {
    setEditingFacilityId(null);

    setFacilityForm({
      title: "",
      link: "",
      sort_order: facilities.length + 1,
      status: 1,
      image: null,
    });

    setFacilityPreview("");
    setFacilityModal(true);
  };

  const openEditFacility = (facility) => {
    setEditingFacilityId(facility.id);

    setFacilityForm({
      title: facility.title || "",
      link: facility.link || "",
      sort_order: facility.sort_order || 0,
      status: facility.status ?? 1,
      image: null,
    });

    setFacilityPreview(
      facility.image
        ? getImageUrl(facility.image)
        : ""
    );

    setFacilityModal(true);
  };

  const closeFacilityModal = () => {
    setFacilityModal(false);
    setEditingFacilityId(null);
    setFacilityForm(emptyFacility);
    setFacilityPreview("");
  };

  const handleFacilityImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFacilityForm((prev) => ({
      ...prev,
      image: file,
    }));

    setFacilityPreview(
      URL.createObjectURL(file)
    );
  };

  const saveFacility = async () => {
    if (!facilityForm.title.trim()) {
      showMessage(
        "error",
        "Facility title is required"
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "title",
        facilityForm.title
      );

      formData.append(
        "link",
        facilityForm.link || ""
      );

      formData.append(
        "sort_order",
        facilityForm.sort_order || 0
      );

      formData.append(
        "status",
        facilityForm.status ? 1 : 0
      );

      if (facilityForm.image) {
        formData.append(
          "image",
          facilityForm.image
        );
      }

      const url = editingFacilityId
        ? `${API_URL}/how-to-apply/facilities/${editingFacilityId}`
        : `${API_URL}/how-to-apply/facilities`;

      const response = await fetch(url, {
        method: editingFacilityId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save facility"
        );
      }

      showMessage(
        "success",
        editingFacilityId
          ? "Facility updated successfully"
          : "Facility added successfully"
      );

      closeFacilityModal();

      await fetchData();
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Failed to save facility"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteFacility = async (id) => {
    if (!window.confirm("Delete this facility?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/how-to-apply/facilities/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete facility"
        );
      }

      showMessage(
        "success",
        "Facility deleted successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(error);

      showMessage(
        "error",
        error.message || "Failed to delete facility"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm text-slate-500">
            Loading How To Apply...
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

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              How To Apply
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage admission application steps and facilities
            </p>
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            ↻ Refresh
          </button>

        </div>

        {/* ALERT */}
        {message.text && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl border text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* SETTINGS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

          <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Section Settings
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Update the main How To Apply heading
              </p>
            </div>

          </div>

          <div className="p-5 md:p-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Badge Title
                </label>

                <input
                  type="text"
                  value={settings.badge_title}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      badge_title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="How to apply"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Main Heading
                </label>

                <input
                  type="text"
                  value={settings.heading}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      heading: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="Admissions Made Easy for Future Achievers"
                />
              </div>

            </div>

            {/* CENTER IMAGE */}
            <div className="mt-6 pt-6 border-t border-slate-100">

              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Center Image
              </label>

              <div className="flex flex-col md:flex-row gap-5 items-start">

                <div className="w-full md:w-64 h-44 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">

                  {centerPreview ? (
                    <img
                      src={centerPreview}
                      alt="Center Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          "Center image failed to load:",
                          centerPreview
                        );
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-400">

                      <div className="text-3xl mb-2">
                        🖼️
                      </div>

                      <p className="text-xs">
                        No image selected
                      </p>

                    </div>
                  )}

                </div>

                <div className="flex-1">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCenterImage}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    JPG, JPEG, PNG or WEBP. Recommended image size depends on your frontend design.
                  </p>

                  <button
                    onClick={uploadCenterImage}
                    disabled={!centerImage || saving}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {saving
                      ? "Uploading..."
                      : "Upload Image"}
                  </button>

                </div>

              </div>

            </div>

            <div className="mt-6 flex justify-end">

              <button
                onClick={saveSettings}
                disabled={saving}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
              >
                {saving
                  ? "Saving..."
                  : "Save Settings"}
              </button>

            </div>

          </div>
        </div>

        {/* =================================================
            STEPS
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

          <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Application Steps
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Manage the admission process steps
              </p>
            </div>

            <button
              onClick={openAddStep}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              + Add Step
            </button>

          </div>

          <div className="p-5 md:p-6">

            {steps.length === 0 ? (
              <div className="py-12 text-center text-slate-400">

                <div className="text-4xl mb-3">
                  📋
                </div>

                <p className="font-medium">
                  No application steps added
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {steps.map((step, index) => (

                  <div
                    key={step.id}
                    className="group border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition"
                  >

                    <div className="flex flex-col md:flex-row gap-4">

                      <div className="shrink-0">

                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          {step.step_number ||
                            String(index + 1).padStart(2, "0")}
                        </div>

                      </div>

                      <div className="flex-1 min-w-0">

                        <h3 className="font-bold text-slate-800 text-base">
                          {step.title}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1 leading-6">
                          {step.description}
                        </p>

                      </div>

                      <div className="flex items-start gap-2">

                        <button
                          onClick={() =>
                            openEditStep(step)
                          }
                          className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteStep(step.id)
                          }
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                        >
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

        {/* =================================================
            FACILITIES
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Facilities
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Manage facility slider items
              </p>
            </div>

            <button
              onClick={openAddFacility}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              + Add Facility
            </button>

          </div>

          <div className="p-5 md:p-6">

            {facilities.length === 0 ? (
              <div className="py-12 text-center text-slate-400">

                <div className="text-4xl mb-3">
                  🏫
                </div>

                <p className="font-medium">
                  No facilities added
                </p>

              </div>
            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {facilities.map((facility) => (

                  <div
                    key={facility.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition"
                  >

                    <div className="h-48 bg-slate-100 overflow-hidden">

                      {facility.image ? (
                        <img
                          src={getImageUrl(
                            facility.image
                          )}
                          alt={facility.title}
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          No Image
                        </div>
                      )}

                    </div>

                    <div className="p-4">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="font-bold text-slate-800 truncate">
                            {facility.title}
                          </h3>

                          {facility.link && (
                            <p className="text-xs text-slate-400 truncate mt-1">
                              {facility.link}
                            </p>
                          )}

                        </div>

                        <span
                          className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold ${
                            Number(
                              facility.status
                            ) === 1
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {Number(
                            facility.status
                          ) === 1
                            ? "Active"
                            : "Hidden"}
                        </span>

                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">

                        <span className="text-xs text-slate-400">
                          Order:{" "}
                          {facility.sort_order}
                        </span>

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditFacility(
                                facility
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteFacility(
                                facility.id
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* ===================================================
          STEP MODAL
      =================================================== */}

      {stepModal && (

        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingStepId
                    ? "Edit Step"
                    : "Add Step"}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Enter application step details
                </p>
              </div>

              <button
                onClick={closeStepModal}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>

            </div>

            <div className="p-6 space-y-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Step Number
                </label>

                <input
                  type="text"
                  value={stepForm.step_number}
                  onChange={(e) =>
                    setStepForm({
                      ...stepForm,
                      step_number:
                        e.target.value,
                    })
                  }
                  placeholder="01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title
                </label>

                <input
                  type="text"
                  value={stepForm.title}
                  onChange={(e) =>
                    setStepForm({
                      ...stepForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="Your Apply"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={stepForm.description}
                  onChange={(e) =>
                    setStepForm({
                      ...stepForm,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Enter step description"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">

              <button
                onClick={closeStepModal}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={saveStep}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {saving
                  ? "Saving..."
                  : editingStepId
                  ? "Update Step"
                  : "Add Step"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          FACILITY MODAL
      =================================================== */}

      {facilityModal && (

        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingFacilityId
                    ? "Edit Facility"
                    : "Add Facility"}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Add facility image and details
                </p>
              </div>

              <button
                onClick={closeFacilityModal}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>

            </div>

            <div className="p-6 space-y-5">

              {/* TITLE */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Facility Title
                </label>

                <input
                  type="text"
                  value={facilityForm.title}
                  onChange={(e) =>
                    setFacilityForm({
                      ...facilityForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="Transportation"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* LINK */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Link
                </label>

                <input
                  type="text"
                  value={facilityForm.link}
                  onChange={(e) =>
                    setFacilityForm({
                      ...facilityForm,
                      link: e.target.value,
                    })
                  }
                  placeholder="/index.php/transportation"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* ORDER + STATUS */}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    value={facilityForm.sort_order}
                    onChange={(e) =>
                      setFacilityForm({
                        ...facilityForm,
                        sort_order:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    value={facilityForm.status}
                    onChange={(e) =>
                      setFacilityForm({
                        ...facilityForm,
                        status: Number(
                          e.target.value
                        ),
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
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

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Facility Image
                </label>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4">

                  {facilityPreview && (
                    <div className="mb-4 h-48 rounded-xl overflow-hidden bg-slate-100">

                      <img
                        src={facilityPreview}
                        alt="Facility Preview"
                        className="w-full h-full object-cover"
                      />

                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFacilityImage}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                  />

                </div>

              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">

              <button
                onClick={closeFacilityModal}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={saveFacility}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {saving
                  ? "Saving..."
                  : editingFacilityId
                  ? "Update Facility"
                  : "Add Facility"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminHowToApply;

