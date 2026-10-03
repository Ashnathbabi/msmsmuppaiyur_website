import { API_URL, SERVER_URL } from "../../../config/api";
import React, {
    useEffect,
    useState
} from "react";

import { FiArrowRight } from "react-icons/fi";

import Check from "../../../assets/about/check1.png";
import Element9 from "../../../assets/about/elements9.png";
import Element10 from "../../../assets/about/elements10.png";
import sublogo from "../../../assets/sub-logo1.png";

import "./About.css";







const AboutHomeSchool = () => {

    const [about, setAbout] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const fetchAbout = async () => {

            try {

                // IMPORTANT:
                // Backend route is /api/about-home

                const response =
                    await fetch(
                        `${API_URL}/about-home`
                    );


                if (!response.ok) {

                    throw new Error(
                        `About API Error: ${response.status}`
                    );

                }


                const result =
                    await response.json();


                console.log(
                    "ABOUT API:",
                    result
                );


                if (
                    result.success &&
                    result.data
                ) {

                    setAbout(
                        result.data
                    );

                } else {

                    console.warn(
                        "About data not found"
                    );

                }


            } catch (error) {

                console.error(
                    "Failed to fetch About School:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchAbout();

    }, []);


    if (loading) {

        return null;

    }


    if (!about) {

        return null;

    }


    // =====================================================
    // IMAGE HELPER
    // =====================================================

    const getImage = (image) => {

        if (!image) {

            return "";

        }


        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {

            return image;

        }


        const cleanImage =
            image.replace(/^\/+/, "");


        // If DB already contains:
        // uploads/about/filename.jpg

        if (
            cleanImage.startsWith(
                "uploads/"
            )
        ) {

            return `${SERVER_URL}/${cleanImage}`;

        }


        // If DB contains only:
        // filename.jpg

        return (
            `${SERVER_URL}/uploads/about/${cleanImage}`
        );

    };


    return (

        <section
            className="
                about-section
                relative
                z-10
                overflow-hidden
                bg-white
                py-12
                sm:py-16
                md:py-20
                lg:py-[100px]
            "
        >

            {/* BACKGROUND */}

            <img
                src={Element9}
                alt=""
                className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0
                    -z-0
                    hidden
                    h-full
                    w-1/2
                    object-cover
                    lg:block
                "
            />


            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1320px]
                    px-4
                    sm:px-6
                    md:px-8
                    lg:px-8
                    xl:px-6
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        items-center
                        gap-12
                        md:gap-14
                        lg:grid-cols-12
                        lg:gap-8
                        xl:gap-10
                    "
                >


                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div
                        className="
                            relative
                            z-10
                            w-full
                            min-w-0
                            lg:col-span-6
                        "
                    >

                        <div className="relative w-full">


                            <img
                                src={Element10}
                                alt=""
                                className="
                                    pointer-events-none
                                    absolute
                                    -left-4
                                    -top-6
                                    -z-10
                                    hidden
                                    h-auto
                                    w-[100px]
                                    sm:block
                                    lg:-left-10
                                    lg:-top-12
                                    lg:w-auto
                                "
                            />


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    sm:grid-cols-2
                                    sm:gap-5
                                "
                            >


                                {/* MAIN IMAGE */}

                                <div className="w-full">

                                    <div
                                        className="
                                            image-reveal
                                            relative
                                            h-full
                                            overflow-hidden
                                            rounded-md
                                        "
                                        data-aos="fade-left"
                                        data-aos-duration="1000"
                                        data-aos-delay="200"
                                    >

                                        <img
                                            src={getImage(
                                                about.main_image
                                            )}
                                            alt={
                                                about.title
                                            }
                                            className="
                                                h-[300px]
                                                w-full
                                                object-cover
                                                sm:h-[400px]
                                                md:h-[450px]
                                                lg:h-[500px]
                                                xl:h-[540px]
                                            "
                                        />

                                    </div>

                                </div>


                                {/* RIGHT IMAGES */}

                                <div
                                    className="
                                        flex
                                        w-full
                                        flex-col
                                        gap-4
                                        sm:gap-5
                                    "
                                >

                                    <div
                                        className="
                                            image-reveal
                                            relative
                                            overflow-hidden
                                            rounded-md
                                        "
                                        data-aos="fade-right"
                                        data-aos-duration="1000"
                                        data-aos-delay="300"
                                    >

                                        <img
                                            src={getImage(
                                                about.right_image_1
                                            )}
                                            alt={
                                                about.title
                                            }
                                            className="
                                                h-[220px]
                                                w-full
                                                object-cover
                                                sm:h-[190px]
                                                md:h-[210px]
                                                lg:h-[240px]
                                                xl:h-[260px]
                                            "
                                        />

                                    </div>


                                    <div
                                        className="
                                            image-reveal
                                            relative
                                            overflow-hidden
                                            rounded-md
                                        "
                                        data-aos="fade-right"
                                        data-aos-duration="1000"
                                        data-aos-delay="400"
                                    >

                                        <img
                                            src={getImage(
                                                about.right_image_2
                                            )}
                                            alt={
                                                about.title
                                            }
                                            className="
                                                h-[220px]
                                                w-full
                                                object-cover
                                                sm:h-[190px]
                                                md:h-[210px]
                                                lg:h-[240px]
                                                xl:h-[260px]
                                            "
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* EXPERIENCE */}

                            <div
                                className="
                                    animate-floating
                                    absolute
                                    left-1/2
                                    top-1/2
                                    z-20
                                    flex
                                    w-[calc(100%-30px)]
                                    max-w-[320px]
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    items-center
                                    rounded-lg
                                    bg-white
                                    px-5
                                    py-5
                                    shadow-[0_4px_40px_rgba(0,0,0,0.10)]
                                    sm:max-w-[300px]
                                    sm:px-5
                                    sm:py-5
                                    md:max-w-[320px]
                                    lg:left-[78%]
                                    lg:top-[48%]
                                    lg:-translate-y-1/2
                                    lg:px-6
                                    lg:py-6
                                    xl:max-w-[340px]
                                    xl:px-7
                                    xl:py-7
                                "
                            >

                                <img
                                    src={Check}
                                    alt=""
                                    className="
                                        h-9
                                        w-9
                                        shrink-0
                                        rounded-full
                                        object-cover
                                        sm:h-10
                                        sm:w-10
                                    "
                                />

                                <p
                                    className="
                                        pl-3
                                        font-figtree
                                        text-[14px]
                                        font-semibold
                                        leading-5
                                        text-[#050734]
                                        sm:text-base
                                        sm:leading-6
                                        md:text-lg
                                    "
                                >

                                    {
                                        about.experience_text
                                    }

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT CONTENT
                    ================================================= */}

                    <div
                        className="
                            relative
                            z-10
                            w-full
                            min-w-0
                            lg:col-span-6
                            xl:col-span-5
                            xl:col-start-8
                        "
                    >


                        {/* BADGE */}

                        <div
                            className="
                                mb-7
                                w-full
                                sm:mb-8
                                md:mb-9
                                lg:mb-10
                            "
                        >

                            <h5
                                className="
                                    relative
                                    inline-flex
                                    max-w-full
                                    items-center
                                    rounded-lg
                                    bg-[#f6f4f1]
                                    px-2
                                    py-2
                                    font-figtree
                                    text-[13px]
                                    font-semibold
                                    uppercase
                                    leading-none
                                    text-[#f6ac27]
                                    sm:text-sm
                                    md:text-base
                                    lg:text-lg
                                "
                            >

                                <span
                                    className="
                                        mr-2
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
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


                                <span className="whitespace-nowrap pr-2">

                                    {
                                        about.badge_text
                                    }

                                </span>

                            </h5>

                        </div>


                        {/* TITLE */}

                        <h2
                            className="
                                max-w-full
                                font-figtree
                                text-[27px]
                                font-semibold
                                leading-[35px]
                                tracking-[-0.5px]
                                text-[#050734]
                                sm:text-[31px]
                                sm:leading-[40px]
                                md:text-[36px]
                                md:leading-[46px]
                                lg:text-[40px]
                                lg:leading-[48px]
                                xl:text-[44px]
                                xl:leading-[52px]
                            "
                            data-aos="fade-up"
                            data-aos-duration="800"
                        >

                            {about.title}

                        </h2>


                        <div className="h-7 sm:h-8 md:h-9 lg:h-10" />


                        {/* DESCRIPTION */}

                        <p
                            className="
                                max-w-[700px]
                                font-figtree
                                text-[15px]
                                font-medium
                                leading-[25px]
                                tracking-normal
                                text-[#37385C]
                                sm:text-base
                                sm:leading-[27px]
                                md:text-[17px]
                                md:leading-[28px]
                                lg:text-lg
                                lg:leading-[29px]
                            "
                            data-aos="fade-left"
                            data-aos-duration="800"
                        >

                            {about.description}

                        </p>


                        <div className="h-7 sm:h-8 md:h-9 lg:h-10" />


                        {/* PROGRESS */}

                        <div
                            className="
                                grid
                                w-full
                                grid-cols-1
                                gap-6
                                sm:grid-cols-2
                                sm:gap-5
                                lg:gap-4
                                xl:gap-6
                            "
                        >

                            <ProgressItem
                                percentage={
                                    about.futures_percentage
                                }
                                title={
                                    about.futures_title
                                }
                                description={
                                    about.futures_description
                                }
                            />


                            <ProgressItem
                                percentage={
                                    about.growth_percentage
                                }
                                title={
                                    about.growth_title
                                }
                                description={
                                    about.growth_description
                                }
                            />

                        </div>


                        <div className="h-7 sm:h-8 md:h-9 lg:h-10" />


                        {/* MISSION */}

                        <div
                            className="
                                relative
                                w-full
                                overflow-hidden
                                rounded-lg
                                bg-[#EFF1FF]
                                px-5
                                py-5
                                pl-7
                                sm:px-6
                                sm:py-6
                                sm:pl-8
                                md:px-7
                                md:py-6
                                md:pl-9
                                lg:px-7
                                lg:py-7
                            "
                        >

                            <span
                                className="
                                    absolute
                                    left-0
                                    top-0
                                    h-full
                                    w-1.5
                                    rounded-l-lg
                                    bg-gradient-to-b
                                    from-[#2E0797]
                                    to-[#726EFC]
                                    sm:w-2
                                "
                            />


                            <p
                                className="
                                    font-figtree
                                    text-[14px]
                                    font-medium
                                    leading-[24px]
                                    text-[#37385C]
                                    sm:text-[15px]
                                    sm:leading-[25px]
                                    md:text-base
                                    md:leading-[27px]
                                    lg:text-[16px]
                                    lg:leading-[28px]
                                "
                            >

                                {about.mission_text}

                            </p>

                        </div>


                        <div className="h-7 sm:h-8 md:h-9 lg:h-10" />


                        {/* BUTTON */}

                        <div className="w-full">

                            <a
                                href={
                                    about.button_link ||
                                    "/about"
                                }
                                className="
                                    group
                                    relative
                                    inline-flex
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-lg
                                    bg-gradient-to-r
                                    from-[#2E0797]
                                    to-[#726EFC]
                                    px-7
                                    py-3.5
                                    font-figtree
                                    text-[15px]
                                    font-bold
                                    leading-none
                                    text-white
                                    transition-all
                                    duration-500
                                    hover:-translate-y-1
                                    sm:px-8
                                    sm:py-4
                                    sm:text-base
                                    md:px-9
                                    md:py-4
                                    md:text-lg
                                    lg:px-10
                                    lg:py-[18px]
                                    lg:text-[18px]
                                "
                            >

                                <span
                                    className="
                                        relative
                                        z-10
                                        flex
                                        items-center
                                    "
                                >

                                    {
                                        about.button_text
                                    }

                                    <FiArrowRight
                                        className="
                                            ml-2
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                            sm:ml-3
                                        "
                                    />

                                </span>

                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};


// =========================================================
// PROGRESS ITEM
// =========================================================

const ProgressItem = ({
    percentage,
    title,
    description
}) => {

    return (

        <div
            className="
                flex
                w-full
                min-w-0
                items-center
                gap-3
                sm:gap-3
                md:gap-4
            "
        >

            <div
                className="
                    flex
                    h-[78px]
                    w-[78px]
                    min-h-[78px]
                    min-w-[78px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[4px]
                    border-[#2E0797]
                    sm:h-[85px]
                    sm:w-[85px]
                    sm:min-h-[85px]
                    sm:min-w-[85px]
                    md:h-[95px]
                    md:w-[95px]
                    md:min-h-[95px]
                    md:min-w-[95px]
                    lg:h-[105px]
                    lg:w-[105px]
                    lg:min-h-[105px]
                    lg:min-w-[105px]
                    xl:h-[115px]
                    xl:w-[115px]
                    xl:min-h-[115px]
                    xl:min-w-[115px]
                "
            >

                <span
                    className="
                        font-figtree
                        text-[15px]
                        font-semibold
                        text-[#050734]
                        sm:text-base
                        md:text-lg
                        lg:text-xl
                    "
                >

                    {percentage}%

                </span>

            </div>


            <div className="min-w-0 flex-1">

                <h4
                    className="
                        font-figtree
                        text-[15px]
                        font-bold
                        leading-5
                        text-[#050734]
                        sm:text-base
                        md:text-lg
                        lg:text-xl
                    "
                >

                    {title}

                </h4>


                <div className="h-1.5 sm:h-2" />


                <p
                    className="
                        break-words
                        font-figtree
                        text-[12px]
                        font-medium
                        leading-[18px]
                        text-[#37385C]
                        sm:text-[13px]
                        sm:leading-5
                        md:text-sm
                        lg:text-[15px]
                    "
                >

                    {description}

                </p>

            </div>

        </div>

    );

};


export default AboutHomeSchool;