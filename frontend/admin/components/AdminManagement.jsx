import React, { useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "";

const emptyForm = {
  name: "",
  role: "",
  facebook: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  sort_order: 0,
  status: 1,
};


const AdminManagement = () => {

  const [management, setManagement] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  const fileInputRef = useRef(null);


  // =====================================================
  // IMAGE URL
  // =====================================================

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

    return `${IMAGE_URL}${image}`;
  };


  // =====================================================
  // FETCH MANAGEMENT
  // =====================================================

  const fetchManagement = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/management?_=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log(
        "ADMIN MANAGEMENT RESPONSE:",
        data
      );

      if (data.success) {
        setManagement(data.management || []);
      } else {
        setManagement([]);
      }

    } catch (error) {

      console.error(
        "FETCH MANAGEMENT ERROR:",
        error
      );

      alert("Failed to load management");

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchManagement();
  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));

  };


  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAddModal = () => {

    setEditingId(null);

    setForm(emptyForm);

    setSelectedImage(null);

    setPreviewImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowModal(true);
  };


  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditModal = (person) => {

    setEditingId(person.id);

    setForm({
      name: person.name || "",
      role: person.role || "",
      facebook: person.facebook || "",
      instagram: person.instagram || "",
      youtube: person.youtube || "",
      linkedin: person.linkedin || "",
      sort_order: person.sort_order ?? 0,
      status: person.status ?? 1,
    });

    setSelectedImage(null);

    setPreviewImage(
      getImageUrl(person.image)
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowModal(true);
  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingId(null);

    setForm(emptyForm);

    setSelectedImage(null);

    setPreviewImage("");

  };


  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // 5MB check

    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Image size must be less than 5MB"
      );

      e.target.value = "";

      return;
    }

    setSelectedImage(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name.trim()) {

      alert("Please enter name");

      return;
    }

    if (!form.role.trim()) {

      alert("Please enter role");

      return;
    }

    // Image mandatory only for ADD

    if (!editingId && !selectedImage) {

      alert(
        "Please select management image"
      );

      return;
    }


    try {

      setSaving(true);


      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "role",
        form.role.trim()
      );

      formData.append(
        "facebook",
        form.facebook.trim()
      );

      formData.append(
        "instagram",
        form.instagram.trim()
      );

      formData.append(
        "youtube",
        form.youtube.trim()
      );

      formData.append(
        "linkedin",
        form.linkedin.trim()
      );

      formData.append(
        "sort_order",
        form.sort_order
      );

      formData.append(
        "status",
        form.status
      );


      if (selectedImage) {

        formData.append(
          "image",
          selectedImage
        );

      }


      let response;


      // =================================================
      // ADD
      // =================================================

      if (!editingId) {

        response = await fetch(
          `${API_URL}/management`,
          {
            method: "POST",
            body: formData,
          }
        );

      }

      // =================================================
      // UPDATE
      // =================================================

      else {

        response = await fetch(
          `${API_URL}/management/${editingId}`,
          {
            method: "PUT",
            body: formData,
          }
        );

      }


      const data = await response.json();

      console.log(
        "SAVE MANAGEMENT RESPONSE:",
        data
      );


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Failed to save management"
        );

      }


      alert(
        editingId
          ? "Management updated successfully"
          : "Management added successfully"
      );


      closeModal();

      fetchManagement();


    } catch (error) {

      console.error(
        "SAVE MANAGEMENT ERROR:",
        error
      );

      alert(
        error.message ||
        "Something went wrong"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this management member?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/management/${id}`,
        {
          method: "DELETE",
        }
      );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Failed to delete management"
        );

      }


      alert(
        "Management deleted successfully"
      );

      fetchManagement();


    } catch (error) {

      console.error(
        "DELETE MANAGEMENT ERROR:",
        error
      );

      alert(
        error.message ||
        "Failed to delete management"
      );

    }

  };


  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const toggleStatus = async (person) => {

    try {

      const formData = new FormData();

      formData.append(
        "name",
        person.name
      );

      formData.append(
        "role",
        person.role
      );

      formData.append(
        "facebook",
        person.facebook || ""
      );

      formData.append(
        "instagram",
        person.instagram || ""
      );

      formData.append(
        "youtube",
        person.youtube || ""
      );

      formData.append(
        "linkedin",
        person.linkedin || ""
      );

      formData.append(
        "sort_order",
        person.sort_order || 0
      );

      formData.append(
        "status",
        Number(person.status) === 1
          ? 0
          : 1
      );


      const response = await fetch(
        `${API_URL}/management/${person.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Failed to update status"
        );

      }


      fetchManagement();


    } catch (error) {

      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        error.message ||
        "Failed to update status"
      );

    }

  };


  return (
    <div className="min-h-screen bg-[#f7f7fb] p-4 md:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

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

          <h1
            className="
              text-2xl
              font-bold
              text-[#050734]
              md:text-3xl
            "
          >
            Management
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage school management members
          </p>

        </div>


        <button
          type="button"
          onClick={openAddModal}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#2E0797]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#240477]
          "
        >
          <FiPlus size={18} />

          Add Management
        </button>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
          md:p-6
        "
      >

        {loading ? (

          <div
            className="
              flex
              min-h-[250px]
              items-center
              justify-center
              text-gray-500
            "
          >
            Loading management...
          </div>

        ) : management.length === 0 ? (

          <div
            className="
              flex
              min-h-[250px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div
              className="
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#EFF1FF]
                text-[#2E0797]
              "
            >
              <FiPlus size={26} />
            </div>

            <h3
              className="
                text-lg
                font-semibold
                text-[#050734]
              "
            >
              No Management Members
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Add your first management member.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {management.map((person) => (

              <div
                key={person.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >

                {/* IMAGE */}

                <div
                  className="
                    relative
                    h-[280px]
                    overflow-hidden
                    bg-gray-100
                  "
                >

                  {person.image ? (

                    <img
                      src={getImageUrl(
                        person.image
                      )}
                      alt={person.name}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  ) : (

                    <div
                      className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-gray-400
                      "
                    >
                      No Image
                    </div>

                  )}


                  {/* STATUS */}

                  <div
                    className="
                      absolute
                      left-3
                      top-3
                    "
                  >

                    {Number(person.status) === 1 ? (

                      <span
                        className="
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-green-700
                        "
                      >
                        Active
                      </span>

                    ) : (

                      <span
                        className="
                          rounded-full
                          bg-red-100
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-red-600
                        "
                      >
                        Inactive
                      </span>

                    )}

                  </div>

                </div>


                {/* CONTENT */}

                <div className="p-5">

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div className="min-w-0">

                      <h3
                        className="
                          break-words
                          text-lg
                          font-bold
                          text-[#050734]
                        "
                      >
                        {person.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-medium
                          text-[#2E0797]
                        "
                      >
                        {person.role}
                      </p>

                    </div>


                    <span
                      className="
                        shrink-0
                        rounded-lg
                        bg-gray-100
                        px-2
                        py-1
                        text-xs
                        text-gray-500
                      "
                    >
                      #{person.sort_order}
                    </span>

                  </div>


                  {/* SOCIAL LINKS */}

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {person.facebook && (
                      <a
                        href={person.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFF1FF]
                          text-[#2E0797]
                        "
                      >
                        <FiFacebook size={16} />
                      </a>
                    )}


                    {person.instagram && (
                      <a
                        href={person.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFF1FF]
                          text-[#2E0797]
                        "
                      >
                        <FiInstagram size={16} />
                      </a>
                    )}


                    {person.youtube && (
                      <a
                        href={person.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFF1FF]
                          text-[#2E0797]
                        "
                      >
                        <FiYoutube size={16} />
                      </a>
                    )}


                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFF1FF]
                          text-[#2E0797]
                        "
                      >
                        <FiLinkedin size={16} />
                      </a>
                    )}

                  </div>


                  {/* ACTIONS */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      border-t
                      border-gray-100
                      pt-4
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(person)
                      }
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-gray-100
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        text-gray-700
                        transition
                        hover:bg-gray-200
                      "
                    >

                      {Number(person.status) === 1 ? (
                        <>
                          <FiEyeOff size={15} />
                          Hide
                        </>
                      ) : (
                        <>
                          <FiEye size={15} />
                          Show
                        </>
                      )}

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(person)
                      }
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#EFF1FF]
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        text-[#2E0797]
                        transition
                        hover:bg-[#e3e5ff]
                      "
                    >
                      <FiEdit2 size={15} />
                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(person.id)
                      }
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-50
                        text-red-600
                        transition
                        hover:bg-red-100
                      "
                    >
                      <FiTrash2 size={16} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >

          <div
            className="
              flex
              max-h-[95vh]
              w-full
              max-w-[850px]
              flex-col
              overflow-hidden
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
                px-5
                py-4
                md:px-6
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-[#050734]
                  "
                >
                  {editingId
                    ? "Edit Management"
                    : "Add Management"}
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Add management member details
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
                  rounded-full
                  bg-gray-100
                  text-gray-600
                  transition
                  hover:bg-gray-200
                "
              >
                <FiX size={18} />
              </button>

            </div>


            {/* MODAL BODY */}

            <form
              onSubmit={handleSubmit}
              className="
                overflow-y-auto
                p-5
                md:p-6
              "
            >

              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-[260px_1fr]
                "
              >

                {/* IMAGE */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-[#050734]
                    "
                  >
                    Management Image
                  </label>


                  <div
                    className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-dashed
                      border-gray-300
                      bg-gray-50
                    "
                  >

                    {previewImage ? (

                      <div className="relative">

                        <img
                          src={previewImage}
                          alt="Preview"
                          className="
                            h-[280px]
                            w-full
                            object-cover
                          "
                        />

                        <button
                          type="button"
                          onClick={() => {

                            setSelectedImage(null);

                            setPreviewImage(
                              editingId
                                ? previewImage
                                : ""
                            );

                            if (
                              fileInputRef.current
                            ) {
                              fileInputRef.current.value =
                                "";
                            }

                          }}
                          className="
                            absolute
                            right-3
                            top-3
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-black/60
                            text-white
                          "
                        >
                          <FiX size={17} />
                        </button>

                      </div>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="
                          flex
                          h-[280px]
                          w-full
                          flex-col
                          items-center
                          justify-center
                          text-gray-400
                          transition
                          hover:bg-gray-100
                        "
                      >

                        <FiUpload
                          size={30}
                          className="mb-3"
                        />

                        <span
                          className="
                            text-sm
                            font-medium
                          "
                        >
                          Upload Image
                        </span>

                        <span
                          className="
                            mt-1
                            text-xs
                          "
                        >
                          PNG, JPG up to 5MB
                        </span>

                      </button>

                    )}

                  </div>


                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      mt-3
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-gray-200
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-gray-700
                      hover:bg-gray-50
                    "
                  >
                    <FiUpload size={16} />

                    {previewImage
                      ? "Change Image"
                      : "Choose Image"}
                  </button>

                </div>


                {/* DETAILS */}

                <div className="space-y-4">

                  {/* NAME */}

                  <div>

                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-[#050734]
                      "
                    >
                      Name
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter management name"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#2E0797]
                        focus:ring-2
                        focus:ring-[#2E0797]/10
                      "
                    />

                  </div>


                  {/* ROLE */}

                  <div>

                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-[#050734]
                      "
                    >
                      Role
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="Example: Correspondent"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#2E0797]
                        focus:ring-2
                        focus:ring-[#2E0797]/10
                      "
                    />

                  </div>


                  {/* SORT + STATUS */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                    "
                  >

                    <div>

                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-[#050734]
                        "
                      >
                        Sort Order
                      </label>

                      <input
                        type="number"
                        name="sort_order"
                        value={form.sort_order}
                        onChange={handleChange}
                        min="0"
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-200
                          px-4
                          py-3
                          text-sm
                          outline-none
                          focus:border-[#2E0797]
                        "
                      />

                    </div>


                    <div>

                      <label
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-[#050734]
                        "
                      >
                        Status
                      </label>

                      <label
                        className="
                          flex
                          h-[46px]
                          cursor-pointer
                          items-center
                          gap-3
                          rounded-lg
                          border
                          border-gray-200
                          px-4
                        "
                      >

                        <input
                          type="checkbox"
                          name="status"
                          checked={
                            Number(form.status) === 1
                          }
                          onChange={handleChange}
                          className="
                            h-4
                            w-4
                            accent-[#2E0797]
                          "
                        />

                        <span
                          className="
                            text-sm
                            font-medium
                            text-gray-700
                          "
                        >
                          Active
                        </span>

                      </label>

                    </div>

                  </div>


                  {/* SOCIAL TITLE */}

                  <div
                    className="
                      border-t
                      border-gray-100
                      pt-4
                    "
                  >

                    <h3
                      className="
                        mb-3
                        text-sm
                        font-bold
                        text-[#050734]
                      "
                    >
                      Social Media Links
                    </h3>


                    <div className="space-y-3">

                      {/* FACEBOOK */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#EFF1FF]
                            text-[#2E0797]
                          "
                        >
                          <FiFacebook />
                        </div>

                        <input
                          type="url"
                          name="facebook"
                          value={form.facebook}
                          onChange={handleChange}
                          placeholder="Facebook URL"
                          className="
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-[#2E0797]
                          "
                        />

                      </div>


                      {/* INSTAGRAM */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#EFF1FF]
                            text-[#2E0797]
                          "
                        >
                          <FiInstagram />
                        </div>

                        <input
                          type="url"
                          name="instagram"
                          value={form.instagram}
                          onChange={handleChange}
                          placeholder="Instagram URL"
                          className="
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-[#2E0797]
                          "
                        />

                      </div>


                      {/* YOUTUBE */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#EFF1FF]
                            text-[#2E0797]
                          "
                        >
                          <FiYoutube />
                        </div>

                        <input
                          type="url"
                          name="youtube"
                          value={form.youtube}
                          onChange={handleChange}
                          placeholder="YouTube URL"
                          className="
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-[#2E0797]
                          "
                        />

                      </div>


                      {/* LINKEDIN */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#EFF1FF]
                            text-[#2E0797]
                          "
                        >
                          <FiLinkedin />
                        </div>

                        <input
                          type="url"
                          name="linkedin"
                          value={form.linkedin}
                          onChange={handleChange}
                          placeholder="LinkedIn URL"
                          className="
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-[#2E0797]
                          "
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  FOOTER BUTTONS
              ================================================= */}

              <div
                className="
                  mt-6
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-gray-100
                  pt-5
                  sm:flex-row
                  sm:justify-end
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
                    py-3
                    text-sm
                    font-semibold
                    text-gray-700
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
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#2E0797]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#240477]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Management"
                    : "Add Management"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminManagement;