import React, { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff
} from "lucide-react";

import {
    getAllNewsEvents,
    deleteNewsEvent
} from "../../src/services/newsEventService";

import API_BASE_URL from "../../src/config/api";

import { useNavigate } from "react-router-dom";


const NewsEventList = () => {

    const navigate = useNavigate();

    const [news, setNews] = useState([]);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD
    // =====================================================

    const loadNews = async () => {

        try {

            setLoading(true);

            const response =
                await getAllNewsEvents();

            setNews(response.data || []);

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load News & Events"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadNews();

    }, []);


    // =====================================================
    // IMAGE
    // =====================================================

    const getImage = (image) => {

        if (!image) {
            return null;
        }

        return `${API_BASE_URL}/uploads/${image}`;

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this News/Event?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteNewsEvent(id);

            alert(
                "News/Event deleted successfully"
            );

            loadNews();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete News/Event"
            );

        }

    };


    return (

        <div className="min-h-screen bg-gray-50 p-6">

            {/* HEADER */}

            <div
                className="
                    mb-6
                    flex
                    flex-col
                    justify-between
                    gap-4
                    md:flex-row
                    md:items-center
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-[#050734]
                        "
                    >
                        News & Events
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage website News & Events
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/admin/news-events/add"
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#35169E]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#2E0797]
                    "
                >

                    <Plus size={18} />

                    Add News Event

                </button>

            </div>


            {/* TABLE CARD */}

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    bg-white
                    shadow-sm
                "
            >

                {loading ? (

                    <div className="p-10 text-center text-gray-500">

                        Loading...

                    </div>

                ) : news.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            No News & Events found.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/news-events/add"
                                )
                            }
                            className="
                                mt-4
                                rounded-lg
                                bg-[#35169E]
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Add First Event
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        bg-gray-50
                                    "
                                >

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                        Order
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                        Image
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                        Title
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {news.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="
                                            border-b
                                            last:border-0
                                            hover:bg-gray-50
                                        "
                                    >

                                        {/* ORDER */}

                                        <td className="px-5 py-4">

                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    rounded
                                                    bg-purple-50
                                                    text-sm
                                                    font-semibold
                                                    text-[#35169E]
                                                "
                                            >
                                                {item.display_order}
                                            </span>

                                        </td>


                                        {/* IMAGE */}

                                        <td className="px-5 py-4">

                                            {item.image ? (

                                                <img
                                                    src={getImage(item.image)}
                                                    alt={item.title}
                                                    className="
                                                        h-16
                                                        w-24
                                                        rounded-lg
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <div
                                                    className="
                                                        flex
                                                        h-16
                                                        w-24
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-gray-100
                                                        text-xs
                                                        text-gray-400
                                                    "
                                                >
                                                    No Image
                                                </div>

                                            )}

                                        </td>


                                        {/* TITLE */}

                                        <td className="px-5 py-4">

                                            <div>

                                                <p
                                                    className="
                                                        font-semibold
                                                        text-[#050734]
                                                    "
                                                >
                                                    {item.title}
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        max-w-md
                                                        truncate
                                                        text-sm
                                                        text-gray-500
                                                    "
                                                >
                                                    {item.description}
                                                </p>

                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-5 py-4">

                                            {Number(item.status) === 1 ? (

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-green-50
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-green-600
                                                    "
                                                >

                                                    <Eye size={14} />

                                                    Active

                                                </span>

                                            ) : (

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-red-50
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-red-600
                                                    "
                                                >

                                                    <EyeOff size={14} />

                                                    Inactive

                                                </span>

                                            )}

                                        </td>


                                        {/* ACTIONS */}

                                        <td className="px-5 py-4">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/news-events/edit/${item.id}`
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-purple-50
                                                        text-[#35169E]
                                                        transition
                                                        hover:bg-[#35169E]
                                                        hover:text-white
                                                    "
                                                    title="Edit"
                                                >

                                                    <Pencil size={16} />

                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-red-50
                                                        text-red-500
                                                        transition
                                                        hover:bg-red-500
                                                        hover:text-white
                                                    "
                                                    title="Delete"
                                                >

                                                    <Trash2 size={16} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};


export default NewsEventList;