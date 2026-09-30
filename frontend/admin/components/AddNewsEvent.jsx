import React, { useState } from "react";

import {
    ArrowLeft,
    Upload,
    X
} from "lucide-react";

import {
    createNewsEvent
} from "../../src/services/newsEventService";

import { useNavigate } from "react-router-dom";


const AddNewsEvent = () => {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        title: "",

        description: "",

        slug: "",

        link: "",

        status: 1,

        display_order: 0

    });


    const [image, setImage] =
        useState(null);


    const [preview, setPreview] =
        useState("");


    const [saving, setSaving] =
        useState(false);


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
                "Please select an image file"
            );

            return;

        }


        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {

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


            await createNewsEvent(data);


            alert(
                "News Event created successfully"
            );


            navigate(
                "/admin/news-events"
            );


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to create News Event"
            );

        } finally {

            setSaving(false);

        }

    };


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
                        Add News Event
                    </h1>

                    <p className="text-sm text-gray-500">
                        Create a new website News/Event
                    </p>

                </div>

            </div>


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="
                    mx-auto
                    max-w-5xl
                "
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
                            placeholder="Enter News/Event title"
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
                            placeholder="Enter description"
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
                                transition
                                focus:border-[#35169E]
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        />

                    </div>


                    {/* TWO COLUMNS */}

                    <div
                        className="
                            mb-6
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {/* SLUG */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Slug
                            </label>

                            <input
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                placeholder="childrens-day"
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


                        {/* DISPLAY ORDER */}

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
                            placeholder="/index.php/news-events/children-day"
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


                        {!preview ? (

                            <label
                                className="
                                    flex
                                    h-56
                                    cursor-pointer
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border-2
                                    border-dashed
                                    border-gray-300
                                    bg-gray-50
                                    transition
                                    hover:border-[#35169E]
                                    hover:bg-purple-50
                                "
                            >

                                <Upload
                                    size={32}
                                    className="text-gray-400"
                                />

                                <p className="mt-3 text-sm font-medium text-gray-600">
                                    Click to upload image
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    JPG, PNG or WEBP
                                </p>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImage}
                                    className="hidden"
                                />

                            </label>

                        ) : (

                            <div className="relative max-w-xl">

                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="
                                        h-72
                                        w-full
                                        rounded-xl
                                        object-cover
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
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
                                        shadow
                                        hover:bg-red-600
                                    "
                                >

                                    <X size={18} />

                                </button>

                            </div>

                        )}

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
                                hover:bg-gray-50
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
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {saving
                                ? "Saving..."
                                : "Save News Event"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </div>

    );

};


export default AddNewsEvent;