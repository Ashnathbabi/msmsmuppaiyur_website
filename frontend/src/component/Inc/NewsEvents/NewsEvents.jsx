import React, { useEffect, useState } from "react";

import {
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import subLogo from "../../../assets/sub-logo1.png";

import {
    getNewsEvents
} from "../../../services/newsEventService";

import API_BASE_URL from "../../../config/api";


const NewsEvents = () => {

    const [newsItems, setNewsItems] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD NEWS
    // =====================================================

    useEffect(() => {

        loadNews();

    }, []);


    const loadNews = async () => {

        try {

            setLoading(true);

            const response = await getNewsEvents();

            setNewsItems(response.data || []);

        } catch (error) {

            console.error(
                "Failed to load news events:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SLIDES
    // =====================================================

    const totalSlides = Math.ceil(
        newsItems.length / 2
    );


    // =====================================================
    // NEXT
    // =====================================================

    const nextSlide = () => {

        if (totalSlides <= 1) return;

        setCurrentIndex((prev) =>
            prev + 1 >= totalSlides
                ? 0
                : prev + 1
        );

    };


    // =====================================================
    // PREVIOUS
    // =====================================================

    const prevSlide = () => {

        if (totalSlides <= 1) return;

        setCurrentIndex((prev) =>
            prev - 1 < 0
                ? totalSlides - 1
                : prev - 1
        );

    };


    // =====================================================
    // AUTO SLIDER
    // =====================================================

    useEffect(() => {

        if (!newsItems.length || totalSlides <= 1) {
            return;
        }

        const interval = setInterval(() => {

            setCurrentIndex((prev) =>
                prev + 1 >= totalSlides
                    ? 0
                    : prev + 1
            );

        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, [newsItems.length, totalSlides]);


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "/images/no-image.jpg";
        }

        return `${API_BASE_URL}/uploads/${image}`;

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <section className="w-full overflow-hidden py-16 md:py-20">

                <div className="mx-auto w-full max-w-[1320px] px-4">

                    <div className="flex justify-center">

                        <div className="w-full max-w-6xl text-center">

                            <div className="mx-auto h-8 w-48 animate-pulse rounded bg-gray-200" />

                            <div className="mx-auto mt-5 h-20 max-w-3xl animate-pulse rounded bg-gray-200" />

                        </div>

                    </div>

                </div>

            </section>
        );

    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (!newsItems.length) {

        return null;

    }


    return (

        <section className="w-full overflow-hidden py-16 md:py-20">

            <div className="desktop:max-w-[1320px] mx-auto w-full px-4">

                {/* ================= HEADER ================= */}

                <div className="flex justify-center">

                    <div className="w-full max-w-6xl text-center">

                        <h5
                            className="
                                mb-5
                                inline-flex
                                items-center
                                gap-3
                                rounded-lg
                                bg-[#f6ac27]/10
                                px-2
                                py-2
                                font-['Figtree',sans-serif]
                                text-lg
                                font-semibold
                                uppercase
                                leading-[18px]
                                tracking-[-0.18px]
                                text-[#f6ac27]
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#f6ac27]
                                "
                            >

                                <img
                                    src={subLogo}
                                    alt=""
                                    className="object-contain brightness-0 invert"
                                />

                            </span>

                            News & Events

                        </h5>


                        <h2
                            className="
                                font-figtree
                                text-3xl
                                font-bold
                                leading-tight
                                text-[#050734]
                                sm:text-4xl
                                lg:text-[42px]
                            "
                        >

                            Informing and Inspiring Through
                            <br />

                            School News and Events

                        </h2>

                    </div>

                </div>


                {/* ================= NEWS SLIDER ================= */}

                <div className="relative mt-14">


                    {/* PREVIOUS */}

                    {totalSlides > 1 && (

                        <button
                            type="button"
                            onClick={prevSlide}
                            className="
                                absolute
                                left-[-10px]
                                top-1/2
                                z-20
                                flex
                                h-11
                                w-11
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[#35169E]
                                shadow-lg
                                transition-all
                                duration-300
                                hover:bg-[#35169E]
                                hover:text-white
                                md:left-[-25px]
                            "
                            aria-label="Previous"
                        >

                            <ChevronLeft size={22} />

                        </button>

                    )}


                    {/* NEXT */}

                    {totalSlides > 1 && (

                        <button
                            type="button"
                            onClick={nextSlide}
                            className="
                                absolute
                                right-[-10px]
                                top-1/2
                                z-20
                                flex
                                h-11
                                w-11
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[#35169E]
                                shadow-lg
                                transition-all
                                duration-300
                                hover:bg-[#35169E]
                                hover:text-white
                                md:right-[-25px]
                            "
                            aria-label="Next"
                        >

                            <ChevronRight size={22} />

                        </button>

                    )}


                    {/* SLIDER */}

                    <div className="overflow-hidden">

                        <div
                            className="
                                flex
                                transition-transform
                                duration-500
                                ease-in-out
                            "
                            style={{
                                transform:
                                    `translateX(-${currentIndex * 100}%)`
                            }}
                        >

                            {Array.from({
                                length: totalSlides
                            }).map(
                                (_, slideIndex) => {

                                    const slideItems =
                                        newsItems.slice(
                                            slideIndex * 2,
                                            slideIndex * 2 + 2
                                        );

                                    return (

                                        <div
                                            key={slideIndex}
                                            className="
                                                grid
                                                min-w-full
                                                grid-cols-1
                                                gap-6
                                                md:grid-cols-2
                                            "
                                        >

                                            {slideItems.map(
                                                (item) => (

                                                    <NewsCard
                                                        key={item.id}
                                                        item={item}
                                                        imageUrl={getImageUrl(
                                                            item.image
                                                        )}
                                                    />

                                                )
                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </div>

                </div>


                {/* ================= DOTS ================= */}

                {totalSlides > 1 && (

                    <div className="mt-8 flex justify-center gap-2">

                        {Array.from({
                            length: totalSlides
                        }).map((_, index) => (

                            <button
                                key={index}
                                onClick={() =>
                                    setCurrentIndex(index)
                                }
                                className={`
                                    h-2.5
                                    rounded-full
                                    transition-all
                                    duration-300

                                    ${
                                        currentIndex === index
                                            ? "w-8 bg-[#35169E]"
                                            : "w-2.5 bg-gray-300"
                                    }
                                `}
                                aria-label={
                                    `Go to slide ${index + 1}`
                                }
                            />

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

};


// =====================================================
// NEWS CARD
// =====================================================

const NewsCard = ({
    item,
    imageUrl
}) => {

    return (

        <div
            className="
                group
                relative
                z-10
                mb-8
                overflow-hidden
                rounded-2xl
            "
        >

            {/* IMAGE */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                "
            >

                <div className="overflow-hidden">

                    <a href={item.link || "#"}>

                        <img
                            src={imageUrl}
                            alt={item.title}
                            title={item.title}
                            className="
                                h-[454px]
                                w-full
                                rounded-2xl
                                object-cover
                                transition-all
                                duration-500
                                group-hover:grayscale
                            "
                        />

                    </a>

                </div>

            </div>


            {/* CONTENT BOX */}

            <div
                className="
                    relative
                    z-20
                    mx-4
                    -mt-24
                    rounded-lg
                    border
                    border-[rgba(170,170,170,0.09)]
                    bg-white
                    p-6
                    shadow-sm
                "
            >

                {/* ARROW */}

                <div
                    className="
                        absolute
                        -right-5
                        -top-5
                    "
                >

                    <a
                        href={item.link || "#"}
                        title={item.title}
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-gradient-to-r
                            from-[#2E0797]
                            to-[#726EFC]
                            text-white
                            transition-all
                            duration-300
                            hover:scale-110
                        "
                    >

                        <ArrowRight
                            size={24}
                            className="-rotate-45"
                        />

                    </a>

                </div>


                {/* TITLE */}

                <a
                    href={item.link || "#"}
                    className="
                        inline-block
                        font-figtree
                        text-2xl
                        font-semibold
                        leading-[30px]
                        text-[#050734]
                        transition-all
                        duration-300
                        hover:text-[#35169E]
                    "
                >

                    {item.title}

                </a>


                {/* DESCRIPTION */}

                <p
                    className="
                        mt-3
                        font-figtree
                        text-base
                        leading-7
                        text-gray-600
                    "
                >

                    {item.description}

                </p>

            </div>

        </div>

    );

};


export default NewsEvents;