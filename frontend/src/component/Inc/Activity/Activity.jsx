
import { useEffect, useState } from "react";
import "./Activity.css";

import servicebg from "../../../assets/activity/service-bg1.png";
import sublogo from "../../../assets/sub-logo1.png";

const API_URL =
    import.meta.env.VITE_API_URL || "/api";

const IMAGE_URL =
    import.meta.env.VITE_IMAGE_URL || "";

const HomeActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH ACTIVITIES
    // ==========================================
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/activities-home`
                );

                const responseText = await response.text();

                if (!response.ok) {
                    throw new Error(
                        `Activity API Error: ${response.status} ${responseText}`
                    );
                }

                const result = JSON.parse(responseText);

                console.log(
                    "ACTIVITIES API RESPONSE:",
                    result
                );

                if (
                    result.success &&
                    Array.isArray(result.data)
                ) {
                    setActivities(result.data);
                } else {
                    setActivities([]);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch activities:",
                    error
                );

                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    // ==========================================
    // IMAGE URL
    // ==========================================
    const getImage = (image, updatedAt = "") => {
        if (!image) {
            return "";
        }

        // Already a full URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Remove leading slash
        const cleanImage = image.replace(/^\/+/, "");

        let imageUrl = "";

        // Database value:
        // uploads/activity/filename.png
        if (cleanImage.startsWith("uploads/")) {
            imageUrl = `${IMAGE_URL}/${cleanImage}`;
        } else {
            // Database value:
            // filename.png
            imageUrl = `${IMAGE_URL}/uploads/activity/${cleanImage}`;
        }

        // Prevent browser cache after image update
        if (updatedAt) {
            imageUrl += `?v=${encodeURIComponent(updatedAt)}`;
        }

        return imageUrl;
    };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return null;
    }

    return (
        <section
            className="
                Activity_wrapper
                relative z-[1]
                overflow-hidden
                bg-cover bg-center bg-no-repeat
                px-0
                py-[50px]
                pb-[70px]
            "
            style={{
                backgroundImage: `url(${servicebg})`,
            }}
        >
            <div className="desktop:max-w-[1320px] mx-auto w-full">

                {/* HEADING */}
                <div
                    className="
                        mx-auto
                        mb-[60px]
                        max-w-[700px]
                        text-center
                    "
                >
                    <h5
                        className="
                            heading_abt
                            relative
                            inline-flex
                            items-center
                            rounded-lg
                            !bg-[linear-gradient(0deg,rgb(246_172_39_/_10%)_0%,rgb(246_172_39_/_10%)_100%)]
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

                        Activity
                    </h5>

                    <h2
                        className="
                            mt-0
                            mb-[10px]
                            font-figtree
                            text-[36px]
                            font-bold
                            leading-[44px]
                            text-[#050734]
                        "
                    >
                        Where Every Activity Builds Skills and Smiles
                    </h2>
                </div>

                {/* ACTIVITY GRID */}
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-x-6
                        md:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            data-aos="zoom-in"
                            data-aos-duration={
                                activity.duration || "800"
                            }
                            className="
                                mb-[30px]
                                service1-boxarea
                            "
                        >
                            <div
                                className="
                                    group
                                    relative
                                    isolate
                                    overflow-hidden
                                    rounded-[16px]
                                    bg-white
                                    p-[28px]
                                    shadow-[0_0_40px_0_rgba(0,0,0,0.09)]
                                    transition-all
                                    duration-500
                                    before:absolute
                                    before:left-1/2
                                    before:top-0
                                    before:z-[-1]
                                    before:h-full
                                    before:w-[10px]
                                    before:rounded-[16px]
                                    before:bg-gradient-to-r
                                    before:from-[#2E0797]
                                    before:to-[#2d3381]
                                    before:opacity-0
                                    before:transition-all
                                    before:duration-500
                                    before:content-['']
                                    hover:before:left-0
                                    hover:before:w-full
                                    hover:before:opacity-100
                                "
                            >

                                {/* IMAGE */}
                                <div
                                    className="
                                        flex
                                        h-[90px]
                                        w-[90px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#F2F4FF]
                                        transition-transform
                                        duration-500
                                        [transform-style:preserve-3d]
                                        group-hover:[transform:rotateY(-180deg)]
                                    "
                                >
                                    {activity.image ? (
                                        <img
                                            src={getImage(
                                                activity.image,
                                                activity.updated_at
                                            )}
                                            alt={
                                                activity.title ||
                                                "Activity"
                                            }
                                            className="
                                                max-h-[65px]
                                                max-w-[65px]
                                                object-contain
                                            "
                                            onError={(e) => {
                                                console.error(
                                                    "Activity image failed:",
                                                    getImage(
                                                        activity.image,
                                                        activity.updated_at
                                                    )
                                                );
                                            }}
                                        />
                                    ) : (
                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-gray-400
                                            "
                                        >
                                            No Image
                                        </span>
                                    )}
                                </div>

                                <div className="h-6" />

                                {/* TITLE */}
                                <h3
                                    className="
                                        block
                                        font-figtree
                                        text-[22px]
                                        font-semibold
                                        leading-[22px]
                                        text-[#050734]
                                        transition-colors
                                        duration-500
                                        group-hover:text-white
                                    "
                                >
                                    {activity.title}
                                </h3>

                                <div className="h-8" />

                                {/* DESCRIPTION */}
                                <p
                                    className="
                                        font-figtree
                                        text-[17px]
                                        font-medium
                                        leading-[26px]
                                        text-[#37385c]
                                        transition-all
                                        duration-500
                                        group-hover:text-white
                                        group-hover:opacity-80
                                    "
                                >
                                    {activity.description}
                                </p>

                                <div className="h-8" />

                                {/* NUMBER */}
                                <h5
                                    className="
                                        relative
                                        z-[1]
                                        pl-[68px]
                                        font-figtree
                                        text-[16px]
                                        font-semibold
                                        leading-[16px]
                                        text-[#2E0797]
                                        transition-all
                                        duration-500
                                        after:absolute
                                        after:left-0
                                        after:top-[6px]
                                        after:z-[1]
                                        after:h-[2px]
                                        after:w-[60px]
                                        after:bg-gradient-to-r
                                        after:from-[#2E0797]
                                        after:to-[#2d3381]
                                        after:transition-all
                                        after:duration-500
                                        group-hover:pl-0
                                        group-hover:text-white
                                        group-hover:after:left-[26px]
                                        group-hover:after:bg-white
                                    "
                                >
                                    {activity.number}
                                </h5>
                            </div>
                        </div>
                    ))}
                </div>

                {/* NO DATA */}
                {activities.length === 0 && (
                    <div
                        className="
                            py-10
                            text-center
                            font-figtree
                            text-gray-500
                        "
                    >
                        No activities available.
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeActivity;
