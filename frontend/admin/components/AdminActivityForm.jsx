import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "";

const ActivityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit =
    Boolean(id);

  const [formData, setFormData] =
    useState({
      name: "",
      slug: "",
      description: "",
      status: 1,
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(false);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem(
      "adminToken"
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (
    imagePath
  ) => {
    if (!imagePath) {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const cleanPath =
      imagePath.startsWith("/")
        ? imagePath
        : `/${imagePath}`;

    return `${API_URL}${cleanPath}`;
  };

  // =====================================================
  // FETCH FOR EDIT
  // =====================================================

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const fetchActivity =
      async () => {
        try {
          setFetching(true);

          const token =
            getToken();

          if (!token) {
            navigate(
              "/admin/login"
            );
            return;
          }

          const response =
            await fetch(
              `${API_URL}/api/activities/admin/${id}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const responseText =
            await response.text();

          let result = {};

          try {
            result =
              responseText
                ? JSON.parse(
                    responseText
                  )
                : {};
          } catch {
            throw new Error(
              `Invalid server response (${response.status})`
            );
          }

          if (
            response.status === 401 ||
            response.status === 403
          ) {
            localStorage.removeItem(
              "adminToken"
            );

            localStorage.removeItem(
              "adminData"
            );

            navigate(
              "/admin/login"
            );

            return;
          }

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Failed to fetch activity"
            );
          }

          const activity =
            result.data;

          if (!activity) {
            throw new Error(
              "Activity data not found"
            );
          }

          setFormData({
            name:
              activity.name ||
              "",
            slug:
              activity.slug ||
              "",
            description:
              activity.description ||
              "",
            status:
              Number(
                activity.status ??
                  1
              ),
          });

          if (
            activity.image
          ) {
            setPreview(
              getImageUrl(
                activity.image
              )
            );
          }

        } catch (error) {
          console.error(
            "Fetch activity error:",
            error
          );

          alert(
            error.message ||
              "Failed to load activity"
          );

          navigate(
            "/admin/activities"
          );
        } finally {
          setFetching(false);
        }
      };

    fetchActivity();

  }, [
    id,
    isEdit,
    navigate,
  ]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]:
          name === "status"
            ? Number(value)
            : value,
      })
    );
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image file"
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image size must be less than 5MB"
      );

      e.target.value = "";
      return;
    }

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

    setImage(file);

    const imageUrl =
      URL.createObjectURL(
        file
      );

    setPreview(imageUrl);
  };

  // =====================================================
  // SLUG
  // =====================================================

  const generateSlug = () => {
    const slug =
      formData.name
        .toLowerCase()
        .trim()
        .replace(
          /&/g,
          "and"
        )
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        );

    setFormData(
      (previous) => ({
        ...previous,
        slug,
      })
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const name =
      formData.name.trim();

    const slug =
      formData.slug.trim();

    if (!name) {
      alert(
        "Activity name is required"
      );
      return;
    }

    if (!slug) {
      alert(
        "Slug is required"
      );
      return;
    }

    if (
      !isEdit &&
      !image
    ) {
      alert(
        "Please upload an activity image"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        getToken();

      if (!token) {
        navigate(
          "/admin/login"
        );
        return;
      }

      const data =
        new FormData();

      data.append(
        "name",
        name
      );

      data.append(
        "slug",
        slug.toLowerCase()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "status",
        String(
          Number(
            formData.status
          )
        )
      );

      if (image) {
        data.append(
          "image",
          image
        );
      }

      const url =
        isEdit
          ? `${API_URL}/api/activities/admin/${id}`
          : `${API_URL}/api/activities/admin`;

      const response =
        await fetch(
          url,
          {
            method:
              isEdit
                ? "PUT"
                : "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: data,
          }
        );

      const responseText =
        await response.text();

      let result = {};

      try {
        result =
          responseText
            ? JSON.parse(
                responseText
              )
            : {};
      } catch {
        throw new Error(
          `Invalid server response (${response.status})`
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminData"
        );

        navigate(
          "/admin/login"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to save activity (${response.status})`
        );
      }

      alert(
        isEdit
          ? "Activity updated successfully"
          : "Activity created successfully"
      );

      navigate(
        "/admin/activities"
      );

    } catch (error) {
      console.error(
        "Save activity error:",
        error
      );

      alert(
        error.message ||
          "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">

        <div className="mx-auto max-w-[900px]">

          <div className="rounded-xl bg-white p-10 text-center shadow">

            <p className="text-gray-500">
              Loading activity...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-[900px]">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit
                ? "Edit Activity"
                : "Add Activity"}
            </h1>

            <p className="mt-1 text-gray-500">
              {isEdit
                ? "Update club activity information"
                : "Create a new school club activity"}
            </p>

          </div>

          <Link
            to="/admin/activities"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </Link>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="rounded-xl bg-white p-6 shadow"
        >

          {/* NAME */}

          <div className="mb-5">

            <label className="mb-2 block font-semibold text-gray-700">
              Club / Activity Name
            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Example: Dance Club"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
            />

          </div>

          {/* SLUG */}

          <div className="mb-5">

            <label className="mb-2 block font-semibold text-gray-700">
              Slug
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                name="slug"
                value={
                  formData.slug
                }
                onChange={
                  handleChange
                }
                placeholder="dance-club"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
              />

              <button
                type="button"
                onClick={
                  generateSlug
                }
                className="whitespace-nowrap rounded-lg bg-gray-800 px-4 py-3 font-semibold text-white hover:bg-black"
              >
                Generate
              </button>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              URL: /activities/
              {formData.slug ||
                "your-slug"}
            </p>

          </div>

          {/* IMAGE */}

          <div className="mb-5">

            <label className="mb-2 block font-semibold text-gray-700">
              Activity Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Maximum file size: 5MB
            </p>

          </div>

          {/* PREVIEW */}

          {preview && (
            <div className="mb-5">

              <p className="mb-2 font-semibold text-gray-700">
                Image Preview
              </p>

              <div className="overflow-hidden rounded-xl bg-gray-100">

                <img
                  src={preview}
                  alt="Activity preview"
                  className="h-[300px] w-full object-cover"
                />

              </div>

            </div>
          )}

          {/* DESCRIPTION */}

          <div className="mb-5">

            <label className="mb-2 block font-semibold text-gray-700">
              Description / Paragraph
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows={8}
              placeholder="Enter the club activity description..."
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
            />

          </div>

          {/* STATUS */}

          <div className="mb-7">

            <label className="mb-2 block font-semibold text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#e71b93]"
            >

              <option value={1}>
                Active
              </option>

              <option value={0}>
                Inactive
              </option>

            </select>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#e71b93] px-5 py-4 font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading
              ? "Saving..."
              : isEdit
              ? "Update Activity"
              : "Create Activity"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default ActivityForm;
