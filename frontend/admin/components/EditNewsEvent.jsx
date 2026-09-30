import React, { useEffect, useState } from "react";

import {
    ArrowLeft,
    Upload,
    X
} from "lucide-react";

import {
    getNewsEvent,
    updateNewsEvent
} from "../../src/services/newsEventService";

import API_BASE_URL from "../../src/config/api";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const EditNewsEvent = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [form, setForm] = useState({

        title: "",

        description: "",

        slug: "",

        link: "",

        status: 1,

        display_order: 0

    });


    const [oldImage, setOldImage] =
        useState("");


    const [image, setImage] =
        useState(null);


    const [preview, setPreview] =
        useState("");


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {

        loadNews();

    }, [id]);


    const loadNews = async () => {

        try {

            setLoading(true);

            const response =
                await getNewsEvent(id);

            const data = response.data;


            setForm({

                title: data.title || "",

                description:
                    data.description || "",

                slug: data.slug || "",

                link: data.link || "",

                status:
                    Number(data.status ?? 1),

                display_order:
                    Number(data.display_order ?? 0)

            });


            setOldImage(
                data.image || ""
            );


        } catch (error) {

            console.error(error);

            alert(
                "Failed to load News Event"
            );

            navigate(
                "/admin/news-events"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // =====================================================
    // IMAGE
    // =====================================================

    const handleImage = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image"
            );

            return;

        }


        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };


    // =====================================================
    // REMOVE NEW IMAGE
    // =====================================================

    const removeNewImage = () => {

        setImage(null);

        setPreview("");

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.title.trim()) {

            alert("Title is required");

            return;

        }


        try {

            setSaving(true);


            const data =
                new FormData();


            data.append(
                "title",
                form.title
            );

            data.append(
                "description",
                form.description
            );

            data.append(
                "slug",
                form.slug
            );

            data.append(
                "link",
                form.link
            );

            data.append(
                "status",
                form.status
            );

            data.append(
                "display_order",
                form.display_order
            );


            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            await updateNewsEvent(
                id,
                data
            );


            alert(
                "News Event updated successfully"
            );


            navigate(
                "/admin/news-events"
            );


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update News Event"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <p className="text-gray-500">
                    Loading...
                </p>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-50 p-6">

            {/* HEADER */}

            <div className="mb-6 flex items-center gap-4">

                <button
                    onClick={() =>
                        navigate(
                            "/admin/news-events"
                        )
                    }
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-white
                        text-gray-600
                        shadow-sm
                        hover:bg-gray-100
                    "
                >

                    <ArrowLeft size={20} />

                </button>


                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-[#050734]
                        "
                    >
                        Edit News Event
                    </h1>

                    <p className="text-sm text-gray-500">
                        Update website News/Event
                    </p>

                </div>

            </div>


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-5xl"
            >

                <div
                    className="
                        rounded-xl
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    {/* TITLE */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">

                            Title
                            <span className="text-red-500">
                                *
                            </span>

                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-[#35169E]
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            value={form.description}
                            onChange={handleChange}
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-gray-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-[#35169E]
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        />

                    </div>


                    {/* SLUG + ORDER */}

                    <div
                        className="
                            mb-6
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Slug
                            </label>

                            <input
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-200
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-[#35169E]
                                    focus:ring-2
                                    focus:ring-purple-100
                                "
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Display Order
                            </label>

                            <input
                                type="number"
                                name="display_order"
                                value={form.display_order}
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
                                    focus:border-[#35169E]
                                    focus:ring-2
                                    focus:ring-purple-100
                                "
                            />

                        </div>

                    </div>


                    {/* LINK */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Link
                        </label>

                        <input
                            type="text"
                            name="link"
                            value={form.link}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-[#35169E]
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        />

                    </div>


                    {/* STATUS */}

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                                border-gray-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-[#35169E]
                                focus:ring-2
                                focus:ring-purple-100
                                md:w-1/2
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

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Event Image
                        </label>


                        {/* NEW PREVIEW */}

                        {preview ? (

                            <div className="relative max-w-xl">

                                <img
                                    src={preview}
                                    alt="New Preview"
                                    className="
                                        h-72
                                        w-full
                                        rounded-xl
                                        object-cover
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={removeNewImage}
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
                                        bg-red-500
                                        text-white
                                    "
                                >

                                    <X size={18} />

                                </button>

                            </div>

                        ) : oldImage ? (

                            <div className="relative max-w-xl">

                                <img
                                    src={`${API_BASE_URL}/uploads/${oldImage}`}
                                    alt={form.title}
                                    className="
                                        h-72
                                        w-full
                                        rounded-xl
                                        object-cover
                                    "
                                />

                            </div>

                        ) : (

                            <div
                                className="
                                    flex
                                    h-56
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border-2
                                    border-dashed
                                    border-gray-300
                                    bg-gray-50
                                "
                            >

                                <p className="text-sm text-gray-400">
                                    No image uploaded
                                </p>

                            </div>

                        )}


                        {/* UPLOAD */}

                        <label
                            className="
                                mt-4
                                inline-flex
                                cursor-pointer
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-gray-700
                                hover:bg-gray-50
                            "
                        >

                            <Upload size={17} />

                            Change Image

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImage}
                                className="hidden"
                            />

                        </label>

                    </div>


                    {/* BUTTONS */}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            pt-6
                            sm:flex-row
                            sm:justify-end
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/news-events"
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-gray-600
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                rounded-lg
                                bg-[#35169E]
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-[#2E0797]
                                disabled:opacity-50
                            "
                        >

                            {saving
                                ? "Updating..."
                                : "Update News Event"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </div>

    );

};


export default EditNewsEvent;