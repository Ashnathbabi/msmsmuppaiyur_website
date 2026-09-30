import React, {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getFacilityBySlug,
    getAllFacilities,
    updateFacility,
    addFacilityRule,
    updateFacilityRule,
    deleteFacilityRule,
} from "../../src/services/facilitiesService";

const API_SERVER =
    import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(
              "/api",
              ""
          )
        : "";

const EditFacility = () => {
    const navigate = useNavigate();

    const { id } = useParams();

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

    const [facilityId, setFacilityId] =
        useState(null);

    const [oldImage, setOldImage] =
        useState("");

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [rules, setRules] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [showRuleForm, setShowRuleForm] =
        useState(false);

    const [editingRuleId, setEditingRuleId] =
        useState(null);

    const [ruleText, setRuleText] =
        useState("");

    const [ruleOrder, setRuleOrder] =
        useState(0);

    const loadFacility = async () => {
        try {
            setLoading(true);

            // First find facility by ID
            const all =
                await getAllFacilities();

            const facility =
                all.data?.find(
                    (item) =>
                        Number(item.id) ===
                        Number(id)
                );

            if (!facility) {
                alert(
                    "Facility not found"
                );

                navigate(
                    "/admin/facilities"
                );

                return;
            }

            setFacilityId(
                facility.id
            );

            setForm({
                name:
                    facility.name ||
                    "",
                slug:
                    facility.slug ||
                    "",
                title:
                    facility.title ||
                    "",
                tag:
                    facility.tag ||
                    "",
                description:
                    facility.description ||
                    "",
                content:
                    facility.content ||
                    "",
                sort_order:
                    facility.sort_order ||
                    0,
                status:
                    Number(
                        facility.status
                    ),
            });

            setOldImage(
                facility.image ||
                    ""
            );

            // Get rules using slug
            const detail =
                await getFacilityBySlug(
                    facility.slug
                );

            setRules(
                detail.data?.rules ||
                    []
            );
        } catch (error) {
            console.error(error);

            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFacility();
    }, [id]);

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

    const removeNewImage = () => {
        setImage(null);
        setPreview("");
    };

    const getImageUrl = (image) => {
        if (!image) return "";

        if (
            image.startsWith("http")
        ) {
            return image;
        }

        return `${API_SERVER}${image}`;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        const formData = new FormData();

        formData.append("slug", form.slug);
        formData.append("title", form.title);
        formData.append("tag", form.tag);
        formData.append("description", form.description);
        formData.append("status", form.status);

        if (image) {
            formData.append("image", image);
        }

        console.log("Updating facility:", facilityId);

        const response = await updateFacility(
            facilityId,
            formData
        );

        console.log("Update response:", response);

        alert("Facility updated successfully.");

        // IMPORTANT
        window.location.href = "/admin/facilities";

    } catch (error) {
        console.error(
            "UPDATE FACILITY ERROR:",
            error
        );

        alert(
            error?.message ||
            "Failed to update facility."
        );
    } finally {
        setSaving(false);
    }
};
    // =================================================
    // ADD / UPDATE RULE
    // =================================================

    const handleRuleSubmit =
        async (e) => {
            e.preventDefault();

            if (!ruleText.trim()) {
                alert(
                    "Please enter rule."
                );

                return;
            }

            try {
                if (
                    editingRuleId
                ) {
                    await updateFacilityRule(
                        editingRuleId,
                        {
                            rule_text:
                                ruleText,
                            sort_order:
                                Number(
                                    ruleOrder
                                ),
                            status: 1,
                        }
                    );

                    alert(
                        "Rule updated successfully."
                    );
                } else {
                    await addFacilityRule(
                        facilityId,
                        {
                            rule_text:
                                ruleText,
                            sort_order:
                                Number(
                                    ruleOrder
                                ),
                            status: 1,
                        }
                    );

                    alert(
                        "Rule added successfully."
                    );
                }

                setRuleText("");
                setRuleOrder(0);
                setEditingRuleId(
                    null
                );
                setShowRuleForm(
                    false
                );

                loadFacility();
            } catch (error) {
                alert(error.message);
            }
        };

    // =================================================
    // EDIT RULE
    // =================================================

    const handleEditRule = (
        rule
    ) => {
        setEditingRuleId(
            rule.id
        );

        setRuleText(
            rule.rule_text
        );

        setRuleOrder(
            rule.sort_order
        );

        setShowRuleForm(
            true
        );
    };

    // =================================================
    // DELETE RULE
    // =================================================

    const handleDeleteRule = async (
        ruleId
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this rule?"
            );

        if (!confirmDelete)
            return;

        try {
            await deleteFacilityRule(
                ruleId
            );

            alert(
                "Rule deleted successfully."
            );

            loadFacility();
        } catch (error) {
            alert(error.message);
        }
    };

    const cancelRuleEdit =
        () => {
            setEditingRuleId(
                null
            );

            setRuleText("");

            setRuleOrder(0);

            setShowRuleForm(
                false
            );
        };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading facility...
            </div>
        );
    }

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
                        Edit Facility
                    </h1>

                    <p className="text-sm text-gray-500">
                        {
                            form.name
                        }
                    </p>
                </div>
            </div>

            {/* FACILITY FORM */}

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
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                form.name
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* SLUG */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Slug
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* TITLE */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Page Title
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                        />
                    </div>

                    {/* ORDER */}

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
                                        alt="New preview"
                                        className="h-52 w-80 rounded-xl object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeNewImage
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
                            ) : oldImage ? (
                                <div className="relative w-fit">
                                    <img
                                        src={getImageUrl(
                                            oldImage
                                        )}
                                        alt={
                                            form.name
                                        }
                                        className="h-52 w-80 rounded-xl object-cover"
                                    />

                                    <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium shadow">
                                        <Upload
                                            size={
                                                15
                                            }
                                        />

                                        Change

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={
                                                handleImageChange
                                            }
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center py-8">
                                    <Upload
                                        size={
                                            35
                                        }
                                        className="mb-3 text-gray-400"
                                    />

                                    <span className="text-sm text-gray-600">
                                        Upload
                                        Image
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

                {/* SAVE */}

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/facilities"
                            )
                        }
                        className="rounded-lg border border-gray-300 px-6 py-3"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[#700515] px-6 py-3 text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Updating..."
                            : "Update Facility"}
                    </button>
                </div>
            </form>

            {/* ========================================
                RULES
            ======================================== */}

            <div className="mt-6 rounded-xl bg-white p-6 shadow">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Rules & Regulations
                        </h2>

                        <p className="text-sm text-gray-500">
                            Manage rules for this
                            facility
                        </p>
                    </div>

                    {!showRuleForm && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingRuleId(
                                    null
                                );

                                setRuleText(
                                    ""
                                );

                                setRuleOrder(
                                    rules.length
                                );

                                setShowRuleForm(
                                    true
                                );
                            }}
                            className="flex items-center gap-2 rounded-lg bg-[#700515] px-4 py-2.5 text-sm text-white"
                        >
                            <Plus
                                size={17}
                            />

                            Add Rule
                        </button>
                    )}
                </div>

                {/* RULE FORM */}

                {showRuleForm && (
                    <form
                        onSubmit={
                            handleRuleSubmit
                        }
                        className="mb-6 rounded-xl border bg-gray-50 p-5"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_150px]">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Rule
                                </label>

                                <textarea
                                    value={
                                        ruleText
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setRuleText(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    rows={
                                        3
                                    }
                                    placeholder="Enter rule..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#700515]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    value={
                                        ruleOrder
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setRuleOrder(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={
                                    cancelRuleEdit
                                }
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-[#700515] px-5 py-2.5 text-sm text-white"
                            >
                                {editingRuleId
                                    ? "Update Rule"
                                    : "Add Rule"}
                            </button>
                        </div>
                    </form>
                )}

                {/* RULE LIST */}

                {rules.length ===
                0 ? (
                    <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
                        No rules added.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rules.map(
                            (
                                rule,
                                index
                            ) => (
                                <div
                                    key={
                                        rule.id
                                    }
                                    className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-gray-50"
                                >
                                    <div className="flex gap-3">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#700515] text-xs font-semibold text-white">
                                            {index +
                                                1}
                                        </span>

                                        <p className="text-sm leading-6 text-gray-700">
                                            {
                                                rule.rule_text
                                            }
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditRule(
                                                    rule
                                                )
                                            }
                                            className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                                        >
                                            <Pencil
                                                size={
                                                    17
                                                }
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteRule(
                                                    rule.id
                                                )
                                            }
                                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2
                                                size={
                                                    17
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditFacility;