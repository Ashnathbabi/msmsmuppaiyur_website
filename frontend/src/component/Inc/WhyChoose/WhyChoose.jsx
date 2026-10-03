import { API_URL, SERVER_URL } from "../../../config/api";
import React, { useEffect, useRef, useState } from "react";
import { CircleArrowRight } from "lucide-react";





// =====================================================
// COUNT UP
// =====================================================

const CountUp = ({ end, startAnimation }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startAnimation) return;

        let start = 0;
        const duration = 1800;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = end / totalSteps;

        const timer = setInterval(() => {
            start += increment;

            if (start >= end) {
                start = end;
                clearInterval(timer);
            }

            setCount(Math.floor(start));
        }, stepTime);

        return () => clearInterval(timer);
    }, [end, startAnimation]);

    return count;
};


// =====================================================
// MAIN COMPONENT
// =====================================================

const WhyChoose = () => {
    const [tabs, setTabs] = useState([]);
    const [counters, setCounters] = useState([]);

    const [activeTab, setActiveTab] = useState(0);
    const [startCounter, setStartCounter] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const counterRef = useRef(null);


    // =================================================
    // GET DATA
    // =================================================

    useEffect(() => {
        const fetchWhyChoose = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/why-choose`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch Why Choose data"
                    );
                }

                const data = await response.json();

                setTabs(data.tabs || []);
                setCounters(data.counters || []);

            } catch (error) {
                console.error(error);

                setError(
                    "Unable to load Why Choose section."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWhyChoose();
    }, []);


    // =================================================
    // COUNTER OBSERVER
    // =================================================

    useEffect(() => {
        const element = counterRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCounter(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.25,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [counters]);


    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <section className="py-[100px]">
                <div className="mx-auto max-w-[1320px] px-5 text-center">
                    <p className="font-figtree text-[18px] text-[#37385C]">
                        Loading...
                    </p>
                </div>
            </section>
        );
    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {
        return (
            <section className="py-[100px]">
                <div className="mx-auto max-w-[1320px] px-5 text-center">
                    <p className="font-figtree text-red-500">
                        {error}
                    </p>
                </div>
            </section>
        );
    }


    // =================================================
    // NO DATA
    // =================================================

    if (!tabs.length) {
        return null;
    }


    const activeContent = tabs[activeTab];


    // =================================================
    // MAIN
    // =================================================

    return (
        <section
            className="
                relative
                w-full
                overflow-hidden
                py-[55px]
                sm:py-[65px]
                md:py-[75px]
                lg:py-[90px]
                xl:py-[100px]
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1320px]
                    px-4
                    sm:px-6
                    md:px-8
                    lg:px-10
                    xl:px-5
                "
            >

                {/* =====================================
                    HEADER
                ===================================== */}

                <div
                    className="
                        mx-auto
                        mb-[40px]
                        w-full
                        max-w-[800px]
                        text-center
                        sm:mb-[50px]
                        md:mb-[60px]
                    "
                >

                    <div className="flex w-full justify-center">

                        <h5
                            className="
                                inline-flex
                                max-w-full
                                items-center
                                rounded-lg
                                bg-[rgb(246_172_39_/_10%)]
                                px-2
                                py-2
                                font-figtree
                                text-[13px]
                                font-semibold
                                uppercase
                                text-[#f6ac27]
                                sm:text-[14px]
                                md:text-[16px]
                                lg:text-[18px]
                            "
                        >

                            <span
                                className="
                                    mr-2
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#f6ac27]
                                    sm:h-8
                                    sm:w-8
                                    md:h-9
                                    md:w-9
                                "
                            >
                                <span className="text-white">
                                    +
                                </span>
                            </span>

                            <span>
                                Who We Are
                            </span>

                        </h5>

                    </div>


                    <h2
                        className="
                            mt-4
                            font-figtree
                            text-[28px]
                            font-semibold
                            leading-[36px]
                            text-[#050734]
                            sm:text-[32px]
                            sm:leading-[40px]
                            md:text-[36px]
                            md:leading-[44px]
                            lg:text-[40px]
                            lg:leading-[48px]
                        "
                    >
                        Why Choose Mount Senario
                    </h2>

                </div>


                {/* =====================================
                    TABS
                ===================================== */}

                <div
                    className="
                        mb-[35px]
                        grid
                        grid-cols-1
                        gap-2
                        sm:grid-cols-2
                        sm:gap-3
                        lg:grid-cols-4
                        lg:gap-0
                    "
                >

                    {tabs.map((tab, index) => (

                        <div
                            key={tab.id}
                            className="
                                relative
                                flex
                                w-full
                                justify-center
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setActiveTab(index)
                                }
                                className={`
                                    relative
                                    z-[3]
                                    min-h-[52px]
                                    w-full
                                    rounded-[6px]
                                    px-4
                                    py-3
                                    font-figtree
                                    text-[16px]
                                    font-semibold
                                    transition-all
                                    duration-300
                                    sm:min-h-[58px]
                                    sm:text-[17px]
                                    md:text-[18px]
                                    lg:mx-[3px]
                                    lg:w-[94%]
                                    lg:rounded-none
                                    lg:px-3
                                    lg:text-[19px]
                                    xl:text-[21px]

                                    ${
                                        activeTab === index
                                            ? "bg-[#f6ac27] text-white shadow-sm"
                                            : "bg-[#f4f6f9] text-[#131d3b] hover:bg-[#f6ac27] hover:text-white"
                                    }
                                `}
                            >
                                {tab.title}
                            </button>


                            {index !== tabs.length - 1 && (
                                <>
                                    <span
                                        className="
                                            absolute
                                            right-[-40%]
                                            top-[35%]
                                            z-[1]
                                            hidden
                                            h-[1px]
                                            w-[70%]
                                            bg-[#e7eaee]
                                            lg:block
                                        "
                                    />

                                    <span
                                        className="
                                            absolute
                                            right-[-40%]
                                            top-[65%]
                                            z-[1]
                                            hidden
                                            h-[1px]
                                            w-[70%]
                                            bg-[#e7eaee]
                                            lg:block
                                        "
                                    />
                                </>
                            )}

                        </div>

                    ))}

                </div>


                {/* =====================================
                    TAB CONTENT
                ===================================== */}

                {activeContent && (

                    <div
                        key={activeContent.id}
                        className="
                            animate-[fadeIn_0.4s_ease-in-out]
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                items-center
                                gap-8
                                md:gap-10
                                lg:grid-cols-2
                                lg:gap-[50px]
                                xl:gap-[70px]
                            "
                        >

                            {/* IMAGE */}

                            <div className="w-full">

                                <div
                                    className="
                                        w-full
                                        overflow-hidden
                                        rounded-[12px]
                                        sm:rounded-[14px]
                                        lg:rounded-[16px]
                                    "
                                >

                                    <img
                                        src={
                                            activeContent.image
                                                ? `${SERVER_URL}${activeContent.image}`
                                                : "/placeholder.jpg"
                                        }
                                        alt={
                                            activeContent.heading
                                        }
                                        className="
                                            block
                                            h-auto
                                            max-h-[550px]
                                            min-h-[250px]
                                            w-full
                                            object-cover
                                            object-center
                                            sm:min-h-[300px]
                                            md:min-h-[350px]
                                            lg:min-h-[450px]
                                        "
                                    />

                                </div>

                            </div>


                            {/* CONTENT */}

                            <div
                                className="
                                    w-full
                                    min-w-0
                                    lg:px-0
                                    xl:px-[10px]
                                "
                            >

                                <h4
                                    className="
                                        mb-4
                                        font-figtree
                                        text-[23px]
                                        font-bold
                                        leading-[30px]
                                        text-[#050734]
                                        sm:text-[25px]
                                        sm:leading-[33px]
                                        md:text-[27px]
                                        md:leading-[35px]
                                        lg:text-[28px]
                                        lg:leading-[36px]
                                    "
                                >
                                    {activeContent.heading}
                                </h4>


                                {activeContent.description && (

                                    <p
                                        className="
                                            mb-5
                                            font-figtree
                                            text-[15px]
                                            font-medium
                                            leading-[24px]
                                            text-[#37385C]
                                            sm:text-[16px]
                                            sm:leading-[25px]
                                            md:text-[17px]
                                            md:leading-[26px]
                                            lg:text-[18px]
                                        "
                                    >
                                        {activeContent.description}
                                    </p>

                                )}


                                {activeContent.points?.length > 0 && (

                                    <ul className="space-y-3 sm:space-y-4">

                                        {activeContent.points.map(
                                            (point) => (

                                                <li
                                                    key={point.id}
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-2.5
                                                        sm:gap-3
                                                    "
                                                >

                                                    <CircleArrowRight
                                                        size={19}
                                                        strokeWidth={2}
                                                        className="
                                                            mt-[3px]
                                                            shrink-0
                                                            text-[#f6ac27]
                                                            sm:h-5
                                                            sm:w-5
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            min-w-0
                                                            font-figtree
                                                            text-[15px]
                                                            font-medium
                                                            leading-[23px]
                                                            text-[#37385C]
                                                            sm:text-[16px]
                                                            sm:leading-[25px]
                                                            md:text-[17px]
                                                            md:leading-[26px]
                                                        "
                                                    >
                                                        {point.point}
                                                    </span>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                )}

                            </div>

                        </div>

                    </div>

                )}


                {/* =====================================
                    COUNTERS
                ===================================== */}

                {counters.length > 0 && (

                    <div
                        ref={counterRef}
                        className="
                            mt-[50px]
                            grid
                            grid-cols-2
                            gap-3
                            sm:mt-[60px]
                            sm:gap-4
                            md:mt-[70px]
                            md:gap-5
                            lg:grid-cols-4
                        "
                    >

                        {counters.map((counter) => (

                            <div
                                key={counter.id}
                                className="
                                    flex
                                    min-h-[145px]
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-[10px]
                                    bg-[#f4f6f9]
                                    px-2
                                    py-6
                                    text-center
                                    sm:min-h-[165px]
                                    sm:rounded-[12px]
                                    sm:px-3
                                    sm:py-7
                                    md:min-h-[190px]
                                    md:px-[15px]
                                    md:py-[38px]
                                "
                            >

                                <div
                                    className="
                                        font-figtree
                                        text-[34px]
                                        font-bold
                                        leading-[38px]
                                        text-[#f6ac27]
                                        sm:text-[42px]
                                        sm:leading-[44px]
                                        md:text-[52px]
                                        md:leading-[48px]
                                        lg:text-[58px]
                                        xl:text-[64px]
                                    "
                                >

                                    <CountUp
                                        end={Number(
                                            counter.number
                                        )}
                                        startAnimation={
                                            startCounter
                                        }
                                    />

                                    <span className="ml-[2px]">
                                        {counter.unit}
                                    </span>

                                </div>


                                <div
                                    className="
                                        mt-3
                                        font-figtree
                                        text-[14px]
                                        font-medium
                                        leading-[20px]
                                        text-[#031a3d]
                                        sm:text-[16px]
                                        sm:leading-[22px]
                                        md:mt-[14px]
                                        md:text-[19px]
                                        md:leading-[24px]
                                        lg:text-[20px]
                                        xl:text-[22px]
                                    "
                                >
                                    {counter.title}
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =====================================
                ANIMATION
            ===================================== */}

            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>

        </section>
    );
};

export default WhyChoose;