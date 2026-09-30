import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "";

const AdminActivities = () => {
  const navigate = useNavigate();

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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

    const cleanImage =
      image.startsWith("/")
        ? image
        : `/${image}`;

    return `${API_URL}${cleanImage}`;
  };

  // =====================================================
  // FETCH ACTIVITIES
  // =====================================================

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const token =
        getToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/activities/admin/all`,
          {
            method: "GET",
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

        navigate("/admin/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch activities"
        );
      }

      const list =
        Array.isArray(
          result.data
        )
          ? result.data
          : [];

      setActivities(list);

    } catch (error) {
      console.error(
        "Fetch activities error:",
        error
      );

      setActivities([]);

      alert(
        error.message ||
          "Failed to load activities"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchActivities();
  }, []);

  // =====================================================
  // DELETE
  // =====================================================

  const deleteActivity = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this activity?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        getToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/activities/admin/${id}`,
          {
            method: "DELETE",
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

        navigate("/admin/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Delete failed"
        );
      }

      alert(
        result.message ||
          "Activity deleted successfully"
      );

      await fetchActivities();

    } catch (error) {
      console.error(
        "Delete activity error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-gray-500">
          Loading activities...
        </p>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="min-h-screen bg-white px-4 py-[50px] sm:px-6 lg:px-8">

      <div className="mx-auto w-full max-w-[1320px]">

        {/* HEADER */}

        <div className="mb-[40px] flex flex-col gap-[25px] sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="mb-[8px] text-[14px] font-semibold uppercase tracking-[2px] text-[#e71b93]">
              Admin Panel
            </p>

            <h1 className="text-[40px] font-semibold leading-[50px] text-[#111] sm:text-[50px]">
              Activities
            </h1>

            <p className="mt-[8px] text-[16px] leading-[26px] text-[#666]">
              Manage school club activities
            </p>

          </div>

          <Link
            to="/admin/new"
            className="group inline-flex w-fit items-center rounded-full bg-[#e71b93] py-[8px] pl-[25px] pr-[8px] text-[14px] font-bold uppercase tracking-[0.5px] text-white transition hover:bg-black"
          >

            <span>
              Add Activity
            </span>

            <span className="ml-[15px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-black transition group-hover:bg-[#e71b93]">

              <Plus
                size={20}
                strokeWidth={2.5}
              />

            </span>

          </Link>

        </div>

        {/* EMPTY */}

        {activities.length === 0 ? (

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[25px] bg-[#f5f5f5] px-[20px] text-center">

            <div className="mb-[20px] flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#e71b93] text-white">

              <Plus size={32} />

            </div>

            <h2 className="text-[28px] font-semibold text-[#111]">
              No Activities Found
            </h2>

            <p className="mt-[10px] text-[16px] text-[#666]">
              Add your first school club activity.
            </p>

            <Link
              to="/admin/new"
              className="mt-[25px] rounded-full bg-[#e71b93] px-[30px] py-[14px] text-[14px] font-bold uppercase text-white transition hover:bg-black"
            >
              Add Activity
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 xl:grid-cols-3">

            {activities.map(
              (activity) => {

                const imageUrl =
                  getImageUrl(
                    activity.image
                  );

                return (
                  <div
                    key={activity.id}
                    className="group overflow-hidden rounded-[22px] bg-[#f5f5f5] p-[20px] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.10)]"
                  >

                    {/* IMAGE */}

                    <div className="relative overflow-hidden rounded-[18px] bg-[#e5e5e5]">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={activity.name}
                          className="block aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex aspect-[16/10] items-center justify-center">
                          <span className="text-[14px] text-[#777]">
                            No Image
                          </span>
                        </div>

                      )}

                      <div className="absolute bottom-[15px] right-0 rounded-l-full bg-white px-[20px] py-[10px] text-[13px] font-semibold text-[#e71b93]">
                        Club Activity
                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="pt-[20px]">

                      <div className="flex items-start justify-between gap-[15px]">

                        <div className="min-w-0">

                          <h2 className="text-[24px] font-semibold leading-[31px] text-[#111]">
                            {activity.name}
                          </h2>

                          <p className="mt-[6px] truncate text-[14px] text-[#888]">
                            /{activity.slug}
                          </p>

                        </div>

                        <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-[#e71b93]">

                          <ArrowRight
                            size={19}
                            strokeWidth={2.5}
                          />

                        </span>

                      </div>

                      {activity.description && (
                        <p className="mt-[12px] line-clamp-3 text-[15px] leading-[25px] text-[#666]">
                          {activity.description}
                        </p>
                      )}

                      {/* STATUS */}

                      <div className="mt-[18px]">

                        {Number(
                          activity.status
                        ) === 1 ? (

                          <span className="inline-flex items-center rounded-full bg-green-100 px-[15px] py-[7px] text-[13px] font-semibold text-green-700">

                            <span className="mr-[7px] h-[7px] w-[7px] rounded-full bg-green-500" />

                            Active

                          </span>

                        ) : (

                          <span className="inline-flex items-center rounded-full bg-red-100 px-[15px] py-[7px] text-[13px] font-semibold text-red-700">

                            <span className="mr-[7px] h-[7px] w-[7px] rounded-full bg-red-500" />

                            Inactive

                          </span>

                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-[20px] flex gap-[10px] border-t border-black/10 pt-[20px]">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/edit/${activity.id}`
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-[8px] rounded-full border border-black/20 bg-white px-[15px] py-[12px] text-[13px] font-bold uppercase text-black transition hover:border-[#e71b93] hover:bg-[#e71b93] hover:text-white"
                        >

                          <Pencil
                            size={15}
                            strokeWidth={2.5}
                          />

                          Edit

                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteActivity(
                              activity.id
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-[8px] rounded-full bg-black px-[15px] py-[12px] text-[13px] font-bold uppercase text-white transition hover:bg-red-600"
                        >

                          <Trash2
                            size={15}
                            strokeWidth={2.5}
                          />

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </section>
  );
};

export default AdminActivities;
