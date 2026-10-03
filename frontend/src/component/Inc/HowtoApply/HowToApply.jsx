import { API_URL, SERVER_URL } from "../../../config/api";
import React, { useEffect, useState } from "react";

import "./HowToApply.css";

import Elementss1
    from "../../../assets/howtoapply/elements1.png";

import Elementss12
    from "../../../assets/howtoapply/elements12.png";

import Elementss13
    from "../../../assets/howtoapply/elements13.png";

import Elementss14
    from "../../../assets/howtoapply/elements14.png";

import Elementss15
    from "../../../assets/howtoapply/elements15.png";

import Elementss16
    from "../../../assets/howtoapply/elements16.png";

import Herobg1
    from "../../../assets/howtoapply/hero-bg1.png";

import Applynew
    from "../../../assets/howtoapply/apply_new.png";

import sublogo
    from "../../../assets/sub-logo1.png";







const HowToApply = () => {

    const [settings, setSettings] = useState(null);

    const [steps, setSteps] = useState([]);

    const [facilities, setFacilities] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // FETCH DATA
    // =====================================================

    useEffect(() => {

        fetchHowToApply();

    }, []);


    const fetchHowToApply = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/how-to-apply`
            );

            const data = await response.json();

            if (data.success) {

                setSettings(
                    data.settings || null
                );

                setSteps(
                    data.steps || []
                );

                setFacilities(
                    data.facilities || []
                );
            }

        } catch (error) {

            console.error(
                "HOW TO APPLY ERROR:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // SLIDER
    // =====================================================

    const nextSlide = () => {

        if (!facilities.length) {
            return;
        }

        setCurrentIndex((prev) =>
            prev >= facilities.length - 1
                ? 0
                : prev + 1
        );
    };


    const prevSlide = () => {

        if (!facilities.length) {
            return;
        }

        setCurrentIndex((prev) =>
            prev <= 0
                ? facilities.length - 1
                : prev - 1
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                className="
                    flex
                    min-h-[400px]
                    items-center
                    justify-center
                    bg-[#EFF1FF]
                "
            >
                <div className="text-lg font-semibold">
                    Loading...
                </div>
            </div>
        );
    }


    return (
        <>

            {/* =====================================================
                HOW TO APPLY
            ===================================================== */}

            <section
                className="
                    relative
                    z-[1]
                    overflow-hidden
                    bg-[#EFF1FF]
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        Howtoapply_wrapper
                        relative
                        z-[1]
                        overflow-hidden
                        bg-cover
                        bg-center
                        bg-no-repeat
                        px-0
                        pb-[280px]
                        pt-[100px]
                    "
                    style={{
                        backgroundImage:
                            `url(${Herobg1})`
                    }}
                >

                    <img
                        src={Elementss16}
                        alt=""
                        className="
                            pointer-events-none
                            absolute
                            right-[-70px]
                            top-0
                        "
                    />

                    <img
                        src={Elementss1}
                        alt=""
                        className="
                            keyframe5
                            pointer-events-none
                            absolute
                            right-[180px]
                            top-[20px]
                            z-[-1]
                        "
                    />


                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1140px]
                            px-4
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-4
                            "
                        >

                            <div />

                            <div
                                className="
                                    md:col-span-2
                                "
                            >

                                <div
                                    className="
                                        mb-[60px]
                                        text-center
                                    "
                                >

                                    <h5
                                        className="
                                            relative
                                            mx-auto
                                            inline-block
                                            rounded-lg
                                            bg-white/10
                                            px-4
                                            py-[13px]
                                            pl-[46px]
                                            font-['Figtree',sans-serif]
                                            text-[18px]
                                            font-semibold
                                            uppercase
                                            leading-[18px]
                                            text-white
                                            backdrop-blur-[5px]
                                        "
                                    >

                                        <span
                                            className="
                                                absolute
                                                left-[6px]
                                                top-[6px]
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                rounded-full
                                                bg-white
                                            "
                                        >

                                            <img
                                                src={sublogo}
                                                alt=""
                                                className="object-contain"
                                            />

                                        </span>

                                        {settings?.badge_title ||
                                            "How to apply"}

                                    </h5>


                                    <h2
                                        className="
                                            mt-4
                                            font-['Figtree',sans-serif]
                                            text-[44px]
                                            font-semibold
                                            leading-[48px]
                                            tracking-[-0.54px]
                                            text-white
                                        "
                                    >

                                        {settings?.heading ||
                                            "Admissions Made Easy for Future Achievers"}

                                    </h2>

                                </div>

                            </div>

                            <div />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CARDS
                ================================================= */}

                <div
                    className="
                        relative
                        z-[1]
                        mx-auto
                        w-full
                        max-w-[1290px]
                        px-3
                        sm:px-4
                    "
                >

                    <div
                        className="
                            relative
                            mt-[-40px]
                            rounded-[16px]
                            bg-white
                            px-4
                            py-10
                            sm:mt-[-70px]
                            sm:px-5
                            sm:py-12
                            md:mt-[-110px]
                            md:px-7
                            md:py-14
                            lg:mt-[-150px]
                            lg:px-8
                            lg:py-16
                            xl:mt-[-280px]
                            xl:px-[50px]
                            xl:py-[93px]
                        "
                    >

                        <div
                            className="
                                relative
                                grid
                                grid-cols-1
                                items-center
                                gap-14
                                sm:gap-16
                                md:gap-20
                                lg:grid-cols-[1fr_280px_1fr]
                                lg:gap-5
                                xl:grid-cols-[1fr_380px_1fr]
                                xl:gap-8
                            "
                        >

                            {/* =================================================
                                LEFT STEPS
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-14
                                    sm:gap-16
                                    md:gap-20
                                    lg:gap-[70px]
                                    xl:gap-[90px]
                                "
                            >

                                {steps
                                    .slice(0, 2)
                                    .map((step, index) => (

                                        <div
                                            key={step.id}
                                            className="relative w-full"
                                            data-aos="zoom-in"
                                            data-aos-duration={
                                                800 + index * 100
                                            }
                                        >

                                            {index === 0 && (
                                                <img
                                                    src={Elementss12}
                                                    alt=""
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        z-[1]
                                                        hidden
                                                        md:block
                                                        md:right-[-70px]
                                                        md:top-[-45px]
                                                        md:w-[105px]
                                                        lg:right-[-75px]
                                                        lg:top-[-50px]
                                                        lg:w-[120px]
                                                        xl:right-[-110px]
                                                        xl:top-[-65px]
                                                        xl:w-[150px]
                                                    "
                                                />
                                            )}

                                            {index === 1 && (
                                                <img
                                                    src={Elementss13}
                                                    alt=""
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        z-[1]
                                                        hidden
                                                        md:block
                                                        md:right-[-70px]
                                                        md:bottom-[-50px]
                                                        md:w-[105px]
                                                        lg:right-[-75px]
                                                        lg:bottom-[-55px]
                                                        lg:w-[120px]
                                                        xl:right-[-110px]
                                                        xl:bottom-[-65px]
                                                        xl:w-[150px]
                                                    "
                                                />
                                            )}


                                            <div
                                                className={`
                                                    absolute
                                                    right-3
                                                    z-[5]
                                                    sm:right-4
                                                    md:right-4
                                                    lg:right-4
                                                    xl:right-[18px]

                                                    ${
                                                        index === 0
                                                            ? `
                                                                top-[-25px]
                                                                sm:top-[-30px]
                                                                md:top-[-40px]
                                                                lg:top-[-55px]
                                                                xl:top-[-80px]
                                                            `
                                                            : `
                                                                bottom-[-35px]
                                                                sm:bottom-[-40px]
                                                                md:bottom-[-45px]
                                                                lg:bottom-[-60px]
                                                                xl:bottom-[-75px]
                                                            `
                                                    }
                                                `}
                                            >

                                                <div className="apply-number">
                                                    {step.step_number}
                                                </div>

                                            </div>


                                            <div
                                                className="
                                                    apply-card
                                                    relative
                                                    z-[2]
                                                    w-full
                                                    px-4
                                                    py-5
                                                    pt-7
                                                    sm:px-5
                                                    sm:py-6
                                                    md:px-6
                                                    md:py-6
                                                    lg:pt-[35px]
                                                    xl:px-6
                                                "
                                            >

                                                <h3>
                                                    {step.title}
                                                </h3>

                                                <p>
                                                    {step.description}
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                            </div>


                            {/* =================================================
                                CENTER IMAGE
                            ================================================= */}

                            <div
                                className="
                                    order-first
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    lg:order-none
                                "
                            >

                                <div
                                    className="
                                        relative
                                        h-[180px]
                                        w-[180px]
                                        rounded-full
                                        bg-[#F1F0FE]
                                        p-2
                                        sm:h-[210px]
                                        sm:w-[210px]
                                        sm:p-3
                                        md:h-[240px]
                                        md:w-[240px]
                                        lg:h-[280px]
                                        lg:w-[280px]
                                        xl:h-[370px]
                                        xl:w-[370px]
                                        xl:p-[15px]
                                    "
                                >

                                    <img
                                        src={
                                            settings?.center_image
                                                ? `${SERVER_URL}${settings.center_image}`
                                                : Applynew
                                        }
                                        alt="How to Apply"
                                        className="
                                            h-full
                                            w-full
                                            rounded-full
                                            object-cover
                                        "
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                RIGHT STEPS
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-14
                                    sm:gap-16
                                    md:gap-20
                                    lg:gap-[70px]
                                    xl:gap-[90px]
                                "
                            >

                                {steps
                                    .slice(2, 4)
                                    .map((step, index) => (

                                        <div
                                            key={step.id}
                                            className="relative w-full"
                                            data-aos="zoom-in"
                                            data-aos-duration={
                                                800 + index * 100
                                            }
                                        >

                                            {index === 0 && (
                                                <img
                                                    src={Elementss14}
                                                    alt=""
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        z-[1]
                                                        hidden
                                                        md:block
                                                        md:left-[-70px]
                                                        md:top-[-45px]
                                                        md:w-[105px]
                                                        lg:left-[-75px]
                                                        lg:top-[-50px]
                                                        lg:w-[120px]
                                                        xl:left-[-110px]
                                                        xl:top-[-65px]
                                                        xl:w-[150px]
                                                    "
                                                />
                                            )}

                                            {index === 1 && (
                                                <img
                                                    src={Elementss15}
                                                    alt=""
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        z-[1]
                                                        hidden
                                                        md:block
                                                        md:left-[-70px]
                                                        md:bottom-[-50px]
                                                        md:w-[105px]
                                                        lg:left-[-75px]
                                                        lg:bottom-[-55px]
                                                        lg:w-[120px]
                                                        xl:left-[-110px]
                                                        xl:bottom-[-65px]
                                                        xl:w-[150px]
                                                    "
                                                />
                                            )}


                                            <div
                                                className={`
                                                    absolute
                                                    left-3
                                                    z-[5]
                                                    sm:left-4
                                                    md:left-4
                                                    lg:left-4
                                                    xl:left-[18px]

                                                    ${
                                                        index === 0
                                                            ? `
                                                                top-[-25px]
                                                                sm:top-[-30px]
                                                                md:top-[-40px]
                                                                lg:top-[-55px]
                                                                xl:top-[-80px]
                                                            `
                                                            : `
                                                                bottom-[-35px]
                                                                sm:bottom-[-40px]
                                                                md:bottom-[-45px]
                                                                lg:bottom-[-60px]
                                                                xl:bottom-[-75px]
                                                            `
                                                    }
                                                `}
                                            >

                                                <div className="apply-number">
                                                    {step.step_number}
                                                </div>

                                            </div>


                                            <div
                                                className="
                                                    apply-card
                                                    relative
                                                    z-[2]
                                                    w-full
                                                    px-4
                                                    py-5
                                                    pt-7
                                                    sm:px-5
                                                    sm:py-6
                                                    md:px-6
                                                    md:py-6
                                                    lg:pt-[35px]
                                                    xl:px-6
                                                "
                                            >

                                                <h3>
                                                    {step.title}
                                                </h3>

                                                <p>
                                                    {step.description}
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FACILITIES
            ===================================================== */}

            <section
                className="
                    case1-section-area
                    relative
                    z-[1]
                    bg-[#EFF1FF]
                    py-[100px]
                "
            >

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1140px]
                        px-4
                    "
                >

                    <div
                        className="
                            mb-[60px]
                            grid
                            grid-cols-1
                            items-end
                            gap-6
                            md:grid-cols-2
                        "
                    >

                        <div>

                            <div
                                className="
                                    text-center
                                    md:text-left
                                "
                            >

                                <h5
                                    className="
                                        heading_abt
                                        relative
                                        inline-flex
                                        items-center
                                        rounded-lg
                                        bg-[#f6ac27]/10
                                        px-2
                                        py-2
                                        font-figtree
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
                                            mr-2
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
                                            src={sublogo}
                                            alt=""
                                            className="
                                                object-contain
                                                brightness-0
                                                invert
                                            "
                                        />

                                    </span>

                                    Facilities

                                </h5>


                                <div className="h-6" />


                                <h2
                                    className="
                                        font-['Figtree',sans-serif]
                                        text-[44px]
                                        font-semibold
                                        leading-[48px]
                                        tracking-[-0.54px]
                                        text-[#050734]
                                    "
                                >
                                    School Facilities
                                </h2>

                            </div>

                        </div>


                        {/* Navigation */}

                        <div
                            className="
                                flex
                                justify-center
                                md:justify-end
                            "
                        >

                            <div className="flex gap-4">

                                <button
                                    type="button"
                                    onClick={prevSlide}
                                    aria-label="Previous facility"
                                    className="
                                        flex
                                        h-[60px]
                                        w-[60px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-0
                                        bg-white
                                        text-[24px]
                                        text-[#2E0797]
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:bg-[#2E0797]
                                        hover:text-white
                                    "
                                >
                                    ←
                                </button>


                                <button
                                    type="button"
                                    onClick={nextSlide}
                                    aria-label="Next facility"
                                    className="
                                        flex
                                        h-[60px]
                                        w-[60px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-0
                                        bg-white
                                        text-[24px]
                                        text-[#2E0797]
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:bg-[#2E0797]
                                        hover:text-white
                                    "
                                >
                                    →
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FACILITY SLIDER
                ================================================= */}

                <div className="w-full overflow-hidden">

                    <div
                        className="
                            flex
                            transition-transform
                            duration-[600ms]
                            ease-in-out
                        "
                        style={{
                            transform:
                                `translateX(-${currentIndex * 33.333}%)`
                        }}
                    >

                        {facilities.map(
                            (facility) => (

                                <div
                                    key={facility.id}
                                    className="
                                        w-full
                                        shrink-0
                                        px-3
                                        sm:w-1/2
                                        lg:w-1/3
                                    "
                                >

                                    <div
                                        className="
                                            group
                                            relative
                                        "
                                    >

                                        {/* IMAGE */}

                                        <div
                                            className="
                                                image-anime
                                                relative
                                                h-[396px]
                                                overflow-hidden
                                                rounded-[16px]
                                            "
                                        >

                                            <img
                                                src={
                                                    facility.image
                                                        ? `${SERVER_URL}${facility.image}`
                                                        : "/placeholder.jpg"
                                                }
                                                alt={
                                                    facility.title
                                                }
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-all
                                                    duration-500
                                                    group-hover:scale-110
                                                    group-hover:-rotate-1
                                                "
                                            />

                                        </div>


                                        {/* CONTENT */}

                                        <div
                                            className="
                                                relative
                                                z-[2]
                                                ml-3
                                                mt-[-30px]
                                                w-[calc(100%-24px)]
                                                rounded-lg
                                                bg-white
                                                px-4
                                                py-4
                                                pr-6
                                                shadow-sm
                                                transition-all
                                                duration-500
                                                group-hover:bg-[#2E0797]
                                                sm:ml-4
                                                sm:mt-[-35px]
                                                sm:w-[calc(100%-32px)]
                                                sm:px-5
                                                sm:py-4
                                                md:ml-5
                                                md:mt-[-40px]
                                                md:w-[calc(100%-40px)]
                                                md:px-6
                                                md:py-5
                                                lg:ml-6
                                                lg:mt-[-45px]
                                                lg:w-[calc(100%-48px)]
                                                lg:px-6
                                                lg:py-5
                                                lg:pr-8
                                                xl:ml-7
                                                xl:mt-[-45px]
                                                xl:w-[calc(100%-56px)]
                                                xl:px-6
                                                xl:py-5
                                                xl:pr-10
                                            "
                                        >

                                            <p
                                                className="
                                                    inline-block
                                                    rounded-md
                                                    bg-[#6F69F7]/10
                                                    px-[10px]
                                                    py-2
                                                    font-['Figtree',sans-serif]
                                                    text-[16px]
                                                    font-semibold
                                                    leading-[16px]
                                                    text-[#6F69F7]
                                                    transition-all
                                                    duration-500
                                                    group-hover:bg-white/10
                                                    group-hover:text-white
                                                "
                                            >
                                                #Facilities
                                            </p>


                                            <div className="h-4" />


                                            <a
                                                href={
                                                    facility.link || "#"
                                                }
                                                className="
                                                    block
                                                    font-['Figtree',sans-serif]
                                                    text-[20px]
                                                    font-semibold
                                                    leading-[20px]
                                                    text-[#050734]
                                                    transition-colors
                                                    duration-500
                                                    group-hover:text-white
                                                "
                                            >
                                                {facility.title}
                                            </a>


                                            <div
                                                className="
                                                    absolute
                                                    right-[-15px]
                                                    top-[-15px]
                                                "
                                            >

                                                <a
                                                    href={
                                                        facility.link || "#"
                                                    }
                                                    aria-label={
                                                        `View ${facility.title}`
                                                    }
                                                    className="
                                                        flex
                                                        h-[50px]
                                                        w-[50px]
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-gradient-to-r
                                                        from-[#2E0797]
                                                        to-[#726EFC]
                                                        text-[20px]
                                                        text-white
                                                        transition-all
                                                        duration-300
                                                    "
                                                >
                                                    ↗
                                                </a>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </section>

        </>
    );
};


export default HowToApply;