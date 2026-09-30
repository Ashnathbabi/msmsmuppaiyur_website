import React, {
    useState,
} from "react";

import {
    ArrowLeft,
    Upload,
    X,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    createFacility,
} from "../../src/services/facilitiesService";

const AddFacility = () => {
    const navigate = useNavigate();

    const [form, setForm] =
        useState({
            name: "",
            slug: "",
            title: "",
            tag: "",
            description: "",
            content: "",
            sort_order: 0,
            status: 1,
        });

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );
    };

    const handleNameChange = (
        e
    ) => {
        const value =
            e.target.value;

        setForm((prev) => ({
            ...prev,

            name: value,

            slug:
                prev.slug === "" ||
                prev.slug ===
                    generateSlug(
                        prev.name
                    )
                    ? generateSlug(
                          value
                      )
                    : prev.slug,

            title:
                prev.title === "" ||
                prev.title ===
                    prev.name
                    ? value
                    : prev.title,
        }));
    };

    const handleImageChange = (
        e
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        if (
            ![
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ].includes(
                file.type
            )
        ) {
            alert(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "Image size must be less than 5MB."
            );

            return;
        }

        setImage(file);

        setPreview(
            URL.createObjectURL(
                file
            )
        );
    };

    const removeImage = () => {
        setImage(null);
        setPreview("");
    };

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert(
                "Please enter facility name."
            );

            return;
        }

        if (!form.slug.trim()) {
            alert(
                "Please enter slug."
            );

            return;
        }

        if (!form.title.trim()) {
            alert(
                "Please enter title."
            );

            return;
        }

        try {
            setSaving(true);

            const formData =
                new FormData();

            formData.append(
                "name",
                form.name
            );

            formData.append(
                "slug",
                form.slug
            );

            formData.append(
                "title",
                form.title
            );

            formData.append(
                "tag",
                form.tag
            );

            formData.append(
                "description",
                form.description
            );

            formData.append(
                "content",
                form.content
            );

            formData.append(
                "sort_order",
                form.sort_order
            );

            formData.append(
                "status",
                form.status
            );

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            await createFacility(
                formData
            );

            alert(
                "Facility created successfully."
            );

            navigate(
                "/admin/facilities"
            );
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            {/* HEADER */}

            <div className="mb-6 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/facilities"
                        )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100"
                >
                    <ArrowLeft
                        size={20}
                    />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Facility
                    </h1>

                    <p className="text-sm text-gray-500">
                        Create a new facility
                    </p>
                </div>
            </div>

            <form
                onSubmit={
                    handleSubmit
                }
                className="rounded-xl bg-white p-6 shadow"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* NAME */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Facility Name
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                form.name
                            }
                            onChange={
                                handleNameChange
                            }
                            placeholder="Transportation"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* SLUG */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Slug
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={
                                form.slug
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="transport"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            Example:
                            transport,
                            computer-lab
                        </p>
                    </div>

                    {/* TITLE */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Page Title
                            <span className="text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={
                                form.title
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Rules and Regulations"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* TAG */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Tag
                        </label>

                        <input
                            type="text"
                            name="tag"
                            value={
                                form.tag
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Transportation"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* SORT ORDER */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Sort Order
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* STATUS */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        >
                            <option value={1}>
                                Active
                            </option>

                            <option value={0}>
                                Inactive
                            </option>
                        </select>
                    </div>

                    {/* DESCRIPTION */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            rows={5}
                            placeholder="Enter facility description..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* CONTENT */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Content
                        </label>

                        <textarea
                            name="content"
                            value={
                                form.content
                            }
                            onChange={
                                handleChange
                            }
                            rows={8}
                            placeholder="Enter additional facility content..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* IMAGE */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Facility Image
                        </label>

                        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6">
                            {preview ? (
                                <div className="relative w-fit">
                                    <img
                                        src={
                                            preview
                                        }
                                        alt="Preview"
                                        className="h-52 w-80 rounded-xl object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeImage
                                        }
                                        className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
                                    >
                                        <X
                                            size={
                                                16
                                            }
                                        />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center py-8">
                                    <Upload
                                        size={
                                            35
                                        }
                                        className="mb-3 text-gray-400"
                                    />

                                    <span className="text-sm font-medium text-gray-600">
                                        Click to
                                        upload
                                        image
                                    </span>

                                    <span className="mt-1 text-xs text-gray-400">
                                        JPG,
                                        JPEG,
                                        PNG or
                                        WEBP
                                        • Max
                                        5MB
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/facilities"
                            )
                        }
                        className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[#700515] px-6 py-3 text-sm font-medium text-white hover:bg-[#570410] disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Facility"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFacility;