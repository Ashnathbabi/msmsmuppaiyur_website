import React, { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Upload,
    PlusCircle,
    MinusCircle
} from "lucide-react";

const API =
    import.meta.env.VITE_API_URL ||
    "/api";

const IMAGE_URL =
    import.meta.env.VITE_IMAGE_URL ||
    "";


const emptyTab = {
    title: "",
    heading: "",
    description: "",
    extra: "",
    sort_order: 0,
    points: [""],
    image: null,
    existingImage: ""
};


const emptyCounter = {
    number_value: "",
    unit: "+",
    title: "",
    sort_order: 0
};


export default function WhyChooseAdmin() {

    const [tabs, setTabs] = useState([]);
    const [counters, setCounters] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showTabModal, setShowTabModal] =
        useState(false);

    const [showCounterModal, setShowCounterModal] =
        useState(false);

    const [editingTabId, setEditingTabId] =
        useState(null);

    const [editingCounterId, setEditingCounterId] =
        useState(null);

    const [tabForm, setTabForm] =
        useState(emptyTab);

    const [counterForm, setCounterForm] =
        useState(emptyCounter);

    const [preview, setPreview] =
        useState("");

    // =====================================================
    // FETCH DATA
    // =====================================================

    const fetchData = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API}/why-choose`
            );

            const data = await response.json();

            if (data.success) {

                setTabs(data.tabs || []);
                setCounters(data.counters || []);

            }

        } catch (error) {

            console.error(
                "Fetch Why Choose Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchData();

    }, []);


    // =====================================================
    // IMAGE PREVIEW
    // =====================================================

    useEffect(() => {

        if (tabForm.image instanceof File) {

            const url =
                URL.createObjectURL(
                    tabForm.image
                );

            setPreview(url);

            return () => {
                URL.revokeObjectURL(url);
            };

        }

        if (tabForm.existingImage) {

            setPreview(
                `${IMAGE_URL}${tabForm.existingImage}`
            );

        } else {

            setPreview("");

        }

    }, [
        tabForm.image,
        tabForm.existingImage
    ]);


    // =====================================================
    // ADD TAB
    // =====================================================

    const openAddTab = () => {

        setEditingTabId(null);

        setTabForm({
            ...emptyTab,
            points: [""]
        });

        setShowTabModal(true);

    };


    // =====================================================
    // EDIT TAB
    // =====================================================

    const openEditTab = (tab) => {

        setEditingTabId(tab.id);

        setTabForm({

            title: tab.title || "",

            heading: tab.heading || "",

            description:
                tab.description || "",

            extra:
                tab.extra || "",

            sort_order:
                tab.sort_order || 0,

            points:
                tab.points?.length
                    ? tab.points.map(
                        point =>
                            point.point_text
                    )
                    : [""],

            image: null,

            existingImage:
                tab.image || ""

        });

        setShowTabModal(true);

    };


    // =====================================================
    // IMAGE SELECT
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        setTabForm(prev => ({
            ...prev,
            image: file
        }));

    };


    // =====================================================
    // POINT FUNCTIONS
    // =====================================================

    const addPoint = () => {

        setTabForm(prev => ({
            ...prev,
            points: [
                ...prev.points,
                ""
            ]
        }));

    };


    const removePoint = (index) => {

        setTabForm(prev => {

            const points =
                [...prev.points];

            points.splice(index, 1);

            return {
                ...prev,
                points:
                    points.length
                        ? points
                        : [""]
            };

        });

    };


    const updatePoint = (
        index,
        value
    ) => {

        setTabForm(prev => {

            const points =
                [...prev.points];

            points[index] = value;

            return {
                ...prev,
                points
            };

        });

    };


    // =====================================================
    // SAVE TAB
    // =====================================================

    const saveTab = async (e) => {

        e.preventDefault();

        try {

            const formData =
                new FormData();

            formData.append(
                "title",
                tabForm.title
            );

            formData.append(
                "heading",
                tabForm.heading
            );

            formData.append(
                "description",
                tabForm.description
            );

            formData.append(
                "extra",
                tabForm.extra
            );

            formData.append(
                "sort_order",
                tabForm.sort_order
            );

            formData.append(
                "points",
                JSON.stringify(
                    tabForm.points.filter(
                        point =>
                            point.trim() !== ""
                    )
                )
            );

            if (tabForm.image) {

                formData.append(
                    "image",
                    tabForm.image
                );

            }


            const url = editingTabId
                ? `${API}/why-choose/tabs/${editingTabId}`
                : `${API}/why-choose/tabs`;

            const method =
                editingTabId
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(url, {
                    method,
                    body: formData
                });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save tab"
                );

            }


            setShowTabModal(false);

            setTabForm(emptyTab);

            setEditingTabId(null);

            await fetchData();

        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    };


    // =====================================================
    // DELETE TAB
    // =====================================================

    const deleteTab = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this tab?"
            );

        if (!confirmDelete) return;


        try {

            const response =
                await fetch(
                    `${API}/why-choose/tabs/${id}`,
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


            await fetchData();

        } catch (error) {

            alert(error.message);

        }

    };


    // =====================================================
    // ADD COUNTER
    // =====================================================

    const openAddCounter = () => {

        setEditingCounterId(null);

        setCounterForm({
            ...emptyCounter
        });

        setShowCounterModal(true);

    };


    // =====================================================
    // EDIT COUNTER
    // =====================================================

    const openEditCounter = (
        counter
    ) => {

        setEditingCounterId(
            counter.id
        );

        setCounterForm({

            number_value:
                counter.number_value,

            unit:
                counter.unit || "+",

            title:
                counter.title || "",

            sort_order:
                counter.sort_order || 0

        });

        setShowCounterModal(true);

    };


    // =====================================================
    // SAVE COUNTER
    // =====================================================

    const saveCounter = async (e) => {

        e.preventDefault();

        try {

            const url =
                editingCounterId
                    ? `${API}/why-choose/counters/${editingCounterId}`
                    : `${API}/why-choose/counters`;

            const method =
                editingCounterId
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(url, {

                    method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            counterForm
                        )

                });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Counter save failed"
                );

            }


            setShowCounterModal(false);

            setEditingCounterId(null);

            setCounterForm(
                emptyCounter
            );

            await fetchData();

        } catch (error) {

            alert(error.message);

        }

    };


    // =====================================================
    // DELETE COUNTER
    // =====================================================

    const deleteCounter = async (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this counter?"
            );

        if (!confirmDelete) return;


        try {

            await fetch(
                `${API}/why-choose/counters/${id}`,
                {
                    method: "DELETE"
                }
            );

            await fetchData();

        } catch (error) {

            console.error(error);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="p-5 text-center">
                Loading Why Choose...
            </div>
        );

    }


    return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Why Choose
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage Why Choose tabs, content, points and counters.
                </p>
            </div>

            <button
                onClick={openAddTab}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#700515] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#590411]"
            >
                <Plus size={18} />
                Add Tab
            </button>

        </div>


        {/* ================= TABS CARD ================= */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-5">

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Why Choose Tabs
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your Why Choose sections.
                        </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {tabs.length} Tabs
                    </span>

                </div>

            </div>


            <div className="p-5">

                {tabs.length === 0 ? (

                    <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">

                        <p className="text-sm text-slate-500">
                            No Why Choose tabs added yet.
                        </p>

                        <button
                            onClick={openAddTab}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#700515] px-4 py-2 text-sm font-medium text-white"
                        >
                            <Plus size={16} />
                            Add First Tab
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                        {tabs.map((tab, index) => (

                            <div
                                key={tab.id}
                                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* IMAGE */}

                                <div className="relative h-44 overflow-hidden bg-slate-100">

                                    {tab.image ? (

                                        <img
                                            src={`${IMAGE_URL}${tab.image}`}
                                            alt={tab.title}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                            No Image
                                        </div>

                                    )}

                                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                                        #{index + 1}
                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="p-4">

                                    <div className="mb-2 flex items-start justify-between gap-2">

                                        <h3 className="font-bold text-slate-800">
                                            {tab.title}
                                        </h3>

                                    </div>

                                    <p className="line-clamp-2 min-h-[40px] text-sm text-slate-500">
                                        {tab.heading}
                                    </p>

                                    <div className="mt-3">

                                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                            {tab.points?.length || 0} Points
                                        </span>

                                    </div>


                                    <div className="mt-4 flex gap-2">

                                        <button
                                            onClick={() =>
                                                openEditTab(tab)
                                            }
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteTab(tab.id)
                                            }
                                            className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>


        {/* ================= COUNTERS ================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-5">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Counters
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage student, teacher and other statistics.
                        </p>
                    </div>

                    <button
                        onClick={openAddCounter}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Plus size={16} />
                        Add Counter
                    </button>

                </div>

            </div>


            <div className="p-5">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {counters.map(counter => (

                        <div
                            key={counter.id}
                            className="rounded-xl border border-slate-200 p-4 transition hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <div className="text-3xl font-bold text-[#f6ac27]">
                                        {counter.number_value}
                                        {counter.unit}
                                    </div>

                                    <div className="mt-1 text-sm font-medium text-slate-500">
                                        {counter.title}
                                    </div>

                                </div>


                                <div className="flex gap-1">

                                    <button
                                        onClick={() =>
                                            openEditCounter(counter)
                                        }
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Pencil size={15} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteCounter(counter.id)
                                        }
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={15} />
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>


        {/* ================= TAB MODAL ================= */}

        {showTabModal && (

            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">

                <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                    {/* HEADER */}

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {editingTabId
                                    ? "Edit Tab"
                                    : "Add Tab"}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Manage content, image and points.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowTabModal(false)
                            }
                            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                            <X size={19} />
                        </button>

                    </div>


                    <form
                        onSubmit={saveTab}
                        className="overflow-y-auto"
                    >

                        <div className="p-6">

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

                                {/* IMAGE */}

                                <div className="lg:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Image
                                    </label>

                                    <div className="mb-3 h-60 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                                        {preview ? (

                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full flex-col items-center justify-center text-slate-400">

                                                <Upload size={32} />

                                                <span className="mt-2 text-sm">
                                                    No image selected
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-[#700515] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#590411]"
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        JPG, PNG or WEBP. Maximum 5MB.
                                    </p>

                                </div>


                                {/* FORM */}

                                <div className="lg:col-span-3">

                                    <div className="mb-4">

                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                            Tab Title
                                        </label>

                                        <input
                                            type="text"
                                            value={tabForm.title}
                                            onChange={e =>
                                                setTabForm(prev => ({
                                                    ...prev,
                                                    title: e.target.value
                                                }))
                                            }
                                            placeholder="Who We Are"
                                            required
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                        />

                                    </div>


                                    <div className="mb-4">

                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                            Heading
                                        </label>

                                        <input
                                            type="text"
                                            value={tabForm.heading}
                                            onChange={e =>
                                                setTabForm(prev => ({
                                                    ...prev,
                                                    heading: e.target.value
                                                }))
                                            }
                                            placeholder="Who We Are"
                                            required
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                        />

                                    </div>


                                    <div className="mb-4">

                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                            Description
                                        </label>

                                        <textarea
                                            rows={4}
                                            value={tabForm.description}
                                            onChange={e =>
                                                setTabForm(prev => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))
                                            }
                                            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                            Extra Content
                                        </label>

                                        <textarea
                                            rows={3}
                                            value={tabForm.extra}
                                            onChange={e =>
                                                setTabForm(prev => ({
                                                    ...prev,
                                                    extra: e.target.value
                                                }))
                                            }
                                            placeholder="Optional additional paragraph..."
                                            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* POINTS */}

                            <div className="mt-7">

                                <div className="mb-3 flex items-center justify-between">

                                    <label className="text-sm font-semibold text-slate-700">
                                        Points
                                    </label>

                                    <button
                                        type="button"
                                        onClick={addPoint}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                        <PlusCircle size={15} />
                                        Add Point
                                    </button>

                                </div>


                                <div className="space-y-2">

                                    {tabForm.points.map(
                                        (point, index) => (

                                            <div
                                                key={index}
                                                className="flex items-center gap-2"
                                            >

                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f6ac27] text-xs font-bold text-white">
                                                    {index + 1}
                                                </div>

                                                <input
                                                    type="text"
                                                    value={point}
                                                    onChange={e =>
                                                        updatePoint(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Point ${index + 1}`}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePoint(index)
                                                    }
                                                    className="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                                                >
                                                    <MinusCircle size={17} />
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* SORT */}

                            <div className="mt-5">

                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    value={tabForm.sort_order}
                                    onChange={e =>
                                        setTabForm(prev => ({
                                            ...prev,
                                            sort_order: e.target.value
                                        }))
                                    }
                                    className="w-40 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                />

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowTabModal(false)
                                }
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#700515] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#590411]"
                            >
                                <Save size={17} />

                                {editingTabId
                                    ? "Update Tab"
                                    : "Save Tab"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        )}


        {/* ================= COUNTER MODAL ================= */}

        {showCounterModal && (

            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">

                <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                        <h2 className="text-lg font-bold text-slate-800">
                            {editingCounterId
                                ? "Edit Counter"
                                : "Add Counter"}
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setShowCounterModal(false)
                            }
                            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                        >
                            <X size={19} />
                        </button>

                    </div>


                    <form onSubmit={saveCounter}>

                        <div className="p-6">

                            <div className="grid grid-cols-5 gap-4">

                                <div className="col-span-3">

                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Number
                                    </label>

                                    <input
                                        type="number"
                                        value={counterForm.number_value}
                                        onChange={e =>
                                            setCounterForm(prev => ({
                                                ...prev,
                                                number_value: e.target.value
                                            }))
                                        }
                                        placeholder="100"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                    />

                                </div>


                                <div className="col-span-2">

                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Unit
                                    </label>

                                    <input
                                        type="text"
                                        value={counterForm.unit}
                                        onChange={e =>
                                            setCounterForm(prev => ({
                                                ...prev,
                                                unit: e.target.value
                                            }))
                                        }
                                        placeholder="+"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                    />

                                </div>


                                <div className="col-span-5">

                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Counter Title
                                    </label>

                                    <input
                                        type="text"
                                        value={counterForm.title}
                                        onChange={e =>
                                            setCounterForm(prev => ({
                                                ...prev,
                                                title: e.target.value
                                            }))
                                        }
                                        placeholder="Students"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                    />

                                </div>


                                <div className="col-span-5">

                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        Display Order
                                    </label>

                                    <input
                                        type="number"
                                        value={counterForm.sort_order}
                                        onChange={e =>
                                            setCounterForm(prev => ({
                                                ...prev,
                                                sort_order: e.target.value
                                            }))
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#700515] focus:ring-2 focus:ring-[#700515]/10"
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCounterModal(false)
                                }
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#700515] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#590411]"
                            >
                                <Save size={16} />
                                {editingCounterId
                                    ? "Update Counter"
                                    : "Save Counter"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        )}

    </div>
);

}