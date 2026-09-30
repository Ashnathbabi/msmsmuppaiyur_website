import React, {
    useEffect,
    useState,
} from "react";

import {
    Pencil,
    Trash2,
    Plus,
    Eye,
} from "lucide-react";

import {
    getAllFacilities,
    deleteFacility,
} from "../../src/services/facilitiesService";

import {
    useNavigate,
} from "react-router-dom";

const API_SERVER =
    import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(
              "/api",
              ""
          )
        : "";

const FacilityList = () => {
    const navigate = useNavigate();

    const [facilities, setFacilities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const loadFacilities = async () => {
        try {
            setLoading(true);

            const result =
                await getAllFacilities();

            setFacilities(
                result.data || []
            );
        } catch (error) {
            console.error(error);

            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFacilities();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this facility?"
            );

        if (!confirmDelete) return;

        try {
            await deleteFacility(id);

            alert(
                "Facility deleted successfully"
            );

            loadFacilities();
        } catch (error) {
            alert(error.message);
        }
    };

    const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_SERVER}${image}`;
  }

  return `${API_SERVER}/${image}`;
};

    return (
        <div className="p-6">
            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Facilities
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage school facilities
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/facilities/add"
                        )
                    }
                    className="flex items-center gap-2 rounded-lg bg-[#700515] px-5 py-3 text-sm font-medium text-white hover:bg-[#570410]"
                >
                    <Plus size={18} />

                    Add Facility
                </button>
            </div>

            {/* TABLE */}

            <div className="overflow-hidden rounded-xl bg-white shadow">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading facilities...
                    </div>
                ) : facilities.length ===
                  0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No facilities found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50 text-left">
                                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        #
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        Image
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        Name
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        Slug
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        Order
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {facilities.map(
                                    (
                                        facility,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                facility.id
                                            }
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-sm">
                                                {index +
                                                    1}
                                            </td>

                                            <td className="px-5 py-4">
                                                {facility.image ? (
                                                    <img
                                                        src={getImageUrl(facility.image)}
                                                        alt={facility.title || "Facility"}
                                                        className="h-14 w-20 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                        />
                                                ) : (
                                                    <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="font-medium text-gray-800">
                                                    {
                                                        facility.name
                                                    }
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {
                                                        facility.title
                                                    }
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    facility.slug
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    facility.sort_order
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {Number(
                                                    facility.status
                                                ) ===
                                                1 ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        title="View"
                                                        onClick={() =>
                                                            window.open(
                                                                `/facilities/${facility.slug}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/facilities/edit/${facility.id}`
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                                                    >
                                                        <Pencil
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                facility.id
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacilityList;