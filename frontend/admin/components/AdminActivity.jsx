
import { useEffect, useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL || "/api";

const IMAGE_URL =
    import.meta.env.VITE_IMAGE_URL || "";

const AdminActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        number: "",
        duration: "800",
        status: 1,
        sort_order: 0,
        image: null,
    });

    const [preview, setPreview] = useState("");

    // ==========================================
    // GET IMAGE URL
    // ==========================================
  
const getImage = (image, updatedAt = "") => {
    if (!image) return "";

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    const cleanImage = image.replace(/^\/+/, "");

    let imageUrl = "";

    if (cleanImage.startsWith("uploads/")) {
        imageUrl = `${IMAGE_URL}/${cleanImage}`;
    } else {
        imageUrl = `${IMAGE_URL}/uploads/activity/${cleanImage}`;
    }

    // Prevent browser cache after update
    if (updatedAt) {
        imageUrl += `?v=${encodeURIComponent(updatedAt)}`;
    }

    return imageUrl;
};



    // ==========================================
    // FETCH ADMIN ACTIVITIES
    // ==========================================
    const fetchActivities = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/activities-home/admin`
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    `API Error: ${response.status} ${responseText}`
                );
            }

            let result;

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error(
                    "Invalid JSON response from server"
                );
            }

            console.log("ADMIN ACTIVITIES:", result);

            if (
                result.success &&
                Array.isArray(result.data)
            ) {
                setActivities(result.data);
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error(
                "Fetch Activities Error:",
                error
            );

            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // ==========================================
    // FORM CHANGE
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // IMAGE CHANGE
    // ==========================================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        console.log("SELECTED IMAGE:", file);

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        const imagePreview =
            URL.createObjectURL(file);

        setPreview(imagePreview);
    };

    // ==========================================
    // RESET FORM
    // ==========================================
    const resetForm = () => {
        setEditingId(null);

        setForm({
            title: "",
            description: "",
            number: "",
            duration: "800",
            status: 1,
            sort_order: 0,
            image: null,
        });

        setPreview("");

        const fileInput =
            document.getElementById(
                "activity-image"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // ==========================================
    // EDIT
    // ==========================================
    const handleEdit = (activity) => {
        console.log(
            "EDIT ACTIVITY:",
            activity
        );

        setEditingId(activity.id);

        setForm({
            title: activity.title || "",
            description:
                activity.description || "",
            number: activity.number || "",
            duration:
                activity.duration || "800",
            status:
                activity.status ?? 1,
            sort_order:
                activity.sort_order ?? 0,
            image: null,
        });

        if (activity.image) {
            setPreview(
                getImage(activity.image)
            );
        } else {
            setPreview("");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // SAVE / UPDATE
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            alert(
                "Please enter activity title"
            );
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append(
                "title",
                form.title.trim()
            );

            formData.append(
                "description",
                form.description || ""
            );

            formData.append(
                "number",
                form.number || ""
            );

            formData.append(
                "duration",
                form.duration || "800"
            );

            formData.append(
                "status",
                String(form.status)
            );

            formData.append(
                "sort_order",
                String(form.sort_order)
            );

            // IMPORTANT:
            // Only append image when a new image
            // has actually been selected.
            if (form.image instanceof File) {
                formData.append(
                    "image",
                    form.image
                );
            }

            const url = editingId
                ? `${API_URL}/activities-home/${editingId}`
                : `${API_URL}/activities-home`;

            const method = editingId
                ? "PUT"
                : "POST";

            console.log(
                "ACTIVITY SAVE:",
                {
                    url,
                    method,
                    editingId,
                    image: form.image,
                }
            );

            const response = await fetch(
                url,
                {
                    method,
                    body: formData,
                }
            );

            const responseText =
                await response.text();

            let result;

            try {
                result =
                    JSON.parse(
                        responseText
                    );
            } catch {
                throw new Error(
                    `API Error: ${response.status} ${responseText}`
                );
            }

            console.log(
                "SAVE RESPONSE:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        `API Error: ${response.status}`
                );
            }

            if (result.success) {
                alert(
                    editingId
                        ? "Activity updated successfully"
                        : "Activity added successfully"
                );

                resetForm();

                // Reload latest data from DB
                await fetchActivities();
            } else {
                alert(
                    result.message ||
                        "Something went wrong"
                );
            }
        } catch (error) {
            console.error(
                "Save Activity Error:",
                error
            );

            alert(
                error.message ||
                    "Failed to save activity"
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // DELETE
    // ==========================================
    const handleDelete = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this activity?"
            );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_URL}/activities-home/${id}`,
                {
                    method: "DELETE",
                }
            );

            const responseText =
                await response.text();

            let result;

            try {
                result =
                    JSON.parse(
                        responseText
                    );
            } catch {
                throw new Error(
                    `API Error: ${response.status} ${responseText}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Delete failed"
                );
            }

            if (result.success) {
                alert(
                    "Activity deleted successfully"
                );

                await fetchActivities();
            } else {
                alert(
                    result.message ||
                        "Delete failed"
                );
            }
        } catch (error) {
            console.error(
                "Delete Activity Error:",
                error
            );

            alert(
                error.message ||
                    "Failed to delete activity"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-figtree text-2xl font-bold text-[#050734]">
                            Activity Management
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage activities displayed on
                            the home page.
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-7">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingId
                                    ? "Edit Activity"
                                    : "Add Activity"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add activity details and image.
                            </p>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-600
                                    hover:bg-gray-50
                                "
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* TITLE */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Activity Title
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Example: Karate"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[#2E0797]
                                    focus:ring-2
                                    focus:ring-[#2E0797]/10
                                "
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                rows="4"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter activity description..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[#2E0797]
                                    focus:ring-2
                                    focus:ring-[#2E0797]/10
                                "
                            />
                        </div>

                        {/* NUMBER / DURATION / ORDER */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Number
                                </label>

                                <input
                                    type="text"
                                    name="number"
                                    value={form.number}
                                    onChange={handleChange}
                                    placeholder="01"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-[#2E0797]
                                        focus:ring-2
                                        focus:ring-[#2E0797]/10
                                    "
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Animation Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="800"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-[#2E0797]
                                        focus:ring-2
                                        focus:ring-[#2E0797]/10
                                    "
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="sort_order"
                                    value={form.sort_order}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-[#2E0797]
                                        focus:ring-2
                                        focus:ring-[#2E0797]/10
                                    "
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-[#2E0797]
                                    focus:ring-2
                                    focus:ring-[#2E0797]/10
                                "
                            >
                                <option value={1}>
                                    Active
                                </option>

                                <option value={0}>
                                    Inactive
                                </option>
                            </select>
                        </div>

                        {/* IMAGE */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Activity Image
                            </label>

                            <input
                                id="activity-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="
                                    block
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    text-sm
                                    text-gray-600
                                    file:mr-4
                                    file:border-0
                                    file:bg-[#2E0797]
                                    file:px-4
                                    file:py-2.5
                                    file:text-sm
                                    file:font-medium
                                    file:text-white
                                    hover:file:bg-[#2d3381]
                                "
                            />

                            {preview && (
                                <div className="mt-4">
                                    <p className="mb-2 text-xs font-medium text-gray-500">
                                        Image Preview
                                    </p>

                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="
                                            h-32
                                            w-32
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            object-contain
                                            p-2
                                        "
                                        onError={(e) => {
                                            console.error(
                                                "Preview image failed:",
                                                preview
                                            );

                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* BUTTON */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="
                                    rounded-lg
                                    bg-gradient-to-r
                                    from-[#2E0797]
                                    to-[#2d3381]
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:opacity-90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Activity"
                                        : "Add Activity"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        hover:bg-gray-50
                                    "
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* ACTIVITY LIST */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">

                    <div className="border-b border-gray-100 px-5 py-5">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Activities
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            Loading activities...
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            No activities found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Image
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Activity
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Number
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Order
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {activities.map(
                                        (activity) => (
                                            <tr
                                                key={
                                                    activity.id
                                                }
                                                className="hover:bg-gray-50"
                                            >
                                                {/* IMAGE */}
                                                <td className="px-5 py-4">

                                                    {activity.image ? (
                                                        <img
                                                            src={getImage(
                                                                activity.image
                                                            )}
                                                            alt={
                                                                activity.title
                                                            }
                                                            className="
                                                                h-16
                                                                w-16
                                                                rounded-xl
                                                                bg-gray-50
                                                                object-contain
                                                                p-2
                                                            "
                                                            onError={(
                                                                e
                                                            ) => {
                                                                console.error(
                                                                    "Activity list image failed:",
                                                                    getImage(
                                                                        activity.image
                                                                    )
                                                                );

                                                                e.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="
                                                                flex
                                                                h-16
                                                                w-16
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                bg-gray-100
                                                                text-xs
                                                                text-gray-400
                                                            "
                                                        >
                                                            No image
                                                        </div>
                                                    )}
                                                </td>

                                                {/* ACTIVITY */}
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-gray-800">
                                                        {
                                                            activity.title
                                                        }
                                                    </div>

                                                    <div className="mt-1 max-w-md truncate text-sm text-gray-500">
                                                        {
                                                            activity.description
                                                        }
                                                    </div>
                                                </td>

                                                {/* NUMBER */}
                                                <td className="px-5 py-4 text-sm font-medium text-[#2E0797]">
                                                    {
                                                        activity.number
                                                    }
                                                </td>

                                                {/* ORDER */}
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {
                                                        activity.sort_order
                                                    }
                                                </td>

                                                {/* STATUS */}
                                                <td className="px-5 py-4">

                                                    {Number(
                                                        activity.status
                                                    ) === 1 ? (
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

                                                </td>

                                                {/* ACTION */}
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    activity
                                                                )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                bg-blue-50
                                                                px-4
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-blue-600
                                                                hover:bg-blue-100
                                                            "
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    activity.id
                                                                )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                bg-red-50
                                                                px-4
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-red-600
                                                                hover:bg-red-100
                                                            "
                                                        >
                                                            Delete
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
        </div>
    );
};

export default AdminActivity;