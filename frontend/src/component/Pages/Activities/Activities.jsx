import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import logoSidebar from "../../../assets/academics/logo_sidebar.png";
import ratingShadow from "../../../assets/academics/rating-shadow.png";

// =====================================================
// CLUB ACTIVITIES - SEPARATE IMAGE
// =====================================================


import clubActivitiesImage from "../../../assets/activities/club_activities_i.png";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "";

const Activities = () => {
  const { slug } = useParams();

  const [activities, setActivities] =
    useState([]);

  const [activity, setActivity] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activityLoading, setActivityLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | IMAGE URL
  |--------------------------------------------------------------------------
  */

  const getImageUrl = (image) => {
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
      image.startsWith("/")
        ? image
        : `/${image}`;

    return `${API_URL}${cleanImage}`;
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH ALL ACTIVITIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/activities`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch activities"
          );
        }

        const list =
          Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];

        setActivities(list);
      } catch (error) {
        console.error(
          "Activities error:",
          error
        );

        setActivities([]);

        setError(
          error.message ||
            "Failed to load activities"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FETCH SELECTED ACTIVITY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!slug) {
      setActivity(null);
      setActivityLoading(false);
      setError("");
      return;
    }

    const fetchActivity = async () => {
      try {
        setActivityLoading(true);
        setError("");
        setActivity(null);

        const response = await fetch(
          `${API_URL}/api/activities/${slug}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Activity not found"
          );
        }

        setActivity(
          result.data || null
        );
      } catch (error) {
        console.error(
          "Activity error:",
          error
        );

        setActivity(null);

        setError(
          error.message ||
            "Activity not found"
        );
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivity();
  }, [slug]);

  /*
  |--------------------------------------------------------------------------
  | CLUB ACTIVITIES INTRO IMAGE
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | இங்கே API activity image எதுவும் பயன்படுத்தவில்லை.
  |
  | Tamil Club / Dance Club / Sports Club போன்ற activity-களில்
  | upload செய்யும் image இங்கே வராது.
  |
  | Club Activities-க்கு தனி image மட்டும் வரும்.
  |
  */

  const introImage =
    clubActivitiesImage;

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section className="flex min-h-[600px] items-center justify-center bg-white">
        <p className="text-lg text-gray-500">
          Loading activities...
        </p>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (
    error &&
    !activity &&
    slug
  ) {
    return (
      <section className="flex min-h-[600px] items-center justify-center bg-white px-4">
        <div className="text-center">

          <h1 className="text-3xl font-semibold text-black">
            Activity Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <Link
            to="/activities"
            className="
              mt-6
              inline-flex
              rounded-full
              bg-[#e71b93]
              px-7
              py-3
              font-semibold
              text-white
              hover:bg-black
            "
          >
            Back to Activities
          </Link>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN
  |--------------------------------------------------------------------------
  */

  return (
    <section className="w-full bg-white py-[70px] md:py-[90px] lg:py-[110px]">

      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-5 lg:px-6">

        <div className="grid grid-cols-1 gap-[35px] lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-[45px]">

          {/* =====================================================
              LEFT SIDE
          ===================================================== */}

          <div>

            {/* =================================================
                ACTIVITIES LIST
            ================================================= */}

            <div className="overflow-hidden rounded-[8px] bg-[#f5f5f6]">

              <div className="bg-[#e71b93] px-[30px] py-[18px]">

                <h3 className="text-[23px] font-bold text-white">
                  Activities
                </h3>

              </div>

              <div className="p-[20px]">

                {activities.length === 0 ? (
                  <p className="p-5 text-center text-gray-500">
                    No activities available.
                  </p>
                ) : (
                  <ul className="m-0 list-none p-0">

                    {activities.map(
                      (item) => {

                        const isActive =
                          item.slug ===
                          slug;

                        return (
                          <li
                            key={
                              item.id
                            }
                            className="mb-[12px] last:mb-0"
                          >

                            <Link
                              to={`/activities/${item.slug}`}
                              className={`
                                group
                                relative
                                flex
                                min-h-[62px]
                                items-center
                                rounded-full
                                border
                                px-[25px]
                                py-[12px]
                                pr-[70px]
                                font-semibold
                                transition-all
                                duration-300
                                ${
                                  isActive
                                    ? "border-[#e71b93] bg-[#e71b93] text-white"
                                    : "border-black/40 bg-white text-black hover:border-[#e71b93] hover:bg-[#e71b93] hover:text-white"
                                }
                              `}
                            >

                              <span>
                                {item.name}
                              </span>

                              <span
                                className={`
                                  absolute
                                  right-[5px]
                                  top-1/2
                                  flex
                                  h-[50px]
                                  w-[50px]
                                  -translate-y-1/2
                                  items-center
                                  justify-center
                                  rounded-full
                                  transition-all
                                  duration-300
                                  ${
                                    isActive
                                      ? "bg-white text-black"
                                      : "bg-black text-white group-hover:bg-white group-hover:text-black"
                                  }
                                `}
                              >

                                <ArrowRight
                                  size={19}
                                  strokeWidth={2.5}
                                />

                              </span>

                            </Link>

                          </li>
                        );
                      }
                    )}

                  </ul>
                )}

              </div>

            </div>

            {/* =================================================
                CONTACT CARD
            ================================================= */}

            <div className="relative mt-[35px] overflow-hidden rounded-[45px] bg-black">

              <div
                className="px-[30px] pb-[45px] pt-[35px] sm:px-[40px]"
                style={{
                  backgroundImage:
                    `url(${ratingShadow})`,
                  backgroundPosition:
                    "center top",
                  backgroundRepeat:
                    "no-repeat",
                  backgroundSize:
                    "100% auto",
                }}
              >

                <div className="mt-[15px] flex justify-center">

                  <img
                    src={logoSidebar}
                    alt="School Logo"
                    className="
                      max-h-[85px]
                      w-auto
                      object-contain
                    "
                  />

                </div>

                <div className="mt-[25px] text-center text-white">

                  <p className="text-[16px]">
                    Any Questions? Let’s talk
                  </p>

                  <a
                    href="tel:+919655407774"
                    className="
                      mt-1
                      block
                      text-[24px]
                      font-bold
                      hover:text-[#e71b93]
                    "
                  >
                    (+91) 9655407774
                  </a>

                </div>

                <div className="mt-[25px] flex justify-center">

                  <Link
                    to="/contact"
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-[#e71b93]
                      py-[8px]
                      pl-[25px]
                      pr-[8px]
                      font-bold
                      uppercase
                      text-white
                      hover:bg-white
                      hover:text-black
                    "
                  >

                    Get a Call Back

                    <span
                      className="
                        ml-[12px]
                        flex
                        h-[48px]
                        w-[48px]
                        items-center
                        justify-center
                        rounded-full
                        bg-black
                      "
                    >

                      <ArrowRight
                        size={19}
                      />

                    </span>

                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <div>

            {/* =================================================
                NO ACTIVITY SELECTED
            ================================================= */}

            {!slug ? (

              <div
                className="
                  overflow-hidden
                  rounded-[20px]
                  bg-[#f5f5f5]
                  p-[20px]
                  sm:p-[30px]
                "
              >

                {/* =================================================
                    CLUB ACTIVITIES SEPARATE IMAGE
                ================================================= */}

                {introImage ? (

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[25px]
                      bg-gray-200
                    "
                  >

                    <img
                      src={introImage}
                      alt="Club Activities"
                      className="
                        block
                        h-[300px]
                        w-full
                        object-cover
                        sm:h-[400px]
                        lg:h-[500px]
                      "
                    />

                    {/* IMAGE LABEL */}

                    <div
                      className="
                        absolute
                        bottom-[25px]
                        right-0
                        rounded-l-full
                        bg-white
                        px-[25px]
                        py-[13px]
                        font-semibold
                        text-[#e71b93]
                        sm:bottom-[40px]
                        sm:px-[30px]
                        sm:py-[16px]
                      "
                    >
                      Club Activities
                    </div>

                  </div>

                ) : (

                  <div
                    className="
                      flex
                      min-h-[400px]
                      items-center
                      justify-center
                      rounded-[25px]
                      bg-[#e5e5e5]
                    "
                  >

                    <div className="text-center">

                      <div
                        className="
                          mx-auto
                          mb-[20px]
                          flex
                          h-[80px]
                          w-[80px]
                          items-center
                          justify-center
                          rounded-full
                          bg-[#e71b93]
                          text-white
                        "
                      >

                        <ArrowRight
                          size={32}
                        />

                      </div>

                      <h1
                        className="
                          text-[32px]
                          font-semibold
                          text-[#111]
                        "
                      >
                        Select an Activity
                      </h1>

                      <p
                        className="
                          mx-auto
                          mt-[10px]
                          max-w-[500px]
                          text-[17px]
                          leading-[28px]
                          text-[#666]
                        "
                      >
                        Select an activity from
                        the left side to view
                        its image and description.
                      </p>

                    </div>

                  </div>

                )}

                {/* =================================================
                    INTRO TITLE
                ================================================= */}

                <h1
                  className="
                    mt-[28px]
                    text-[36px]
                    font-semibold
                    leading-[46px]
                    text-[#111]
                    sm:text-[48px]
                    sm:leading-[58px]
                    lg:text-[55px]
                    lg:leading-[65px]
                  "
                >
                  Club Activities
                </h1>

                <p
                  className="
                    mt-[15px]
                    text-[16px]
                    leading-[28px]
                    text-[#666]
                    sm:text-[18px]
                    sm:leading-[30px]
                  "
                >
                  Explore our school activities
                  and clubs. Select an activity
                  from the left side to view
                  complete details.
                </p>

              </div>

            ) : activityLoading ? (

              /* =================================================
                 ACTIVITY LOADING
              ================================================= */

              <div
                className="
                  flex
                  min-h-[600px]
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-[#f5f5f5]
                "
              >

                <p className="text-lg text-gray-500">
                  Loading...
                </p>

              </div>

            ) : activity ? (

              /* =================================================
                 SELECTED ACTIVITY
              ================================================= */

              <div
                className="
                  rounded-[20px]
                  bg-[#f5f5f5]
                  p-[20px]
                  sm:p-[30px]
                "
              >

                {/* =================================================
                    ACTIVITY IMAGE
                ================================================= */}

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[25px]
                    bg-gray-200
                  "
                >

                  {activity.image ? (

                    <img
                      src={getImageUrl(
                        activity.image
                      )}
                      alt={activity.name}
                      className="
                        block
                        h-auto
                        max-h-[600px]
                        min-h-[300px]
                        w-full
                        object-cover
                        sm:min-h-[400px]
                      "
                      onLoad={() => {
                        console.log(
                          "ACTIVITY IMAGE LOADED:",
                          getImageUrl(
                            activity.image
                          )
                        );
                      }}
                      onError={(e) => {
                        console.error(
                          "ACTIVITY IMAGE NOT FOUND:",
                          e.currentTarget.src
                        );

                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div
                      className="
                        flex
                        min-h-[400px]
                        items-center
                        justify-center
                        bg-[#e5e5e5]
                      "
                    >

                      <span className="text-gray-500">
                        No Image Uploaded
                      </span>

                    </div>

                  )}

                  {/* =================================================
                      IMAGE NAME
                  ================================================= */}

                  <div
                    className="
                      absolute
                      bottom-[25px]
                      right-0
                      rounded-l-full
                      bg-white
                      px-[25px]
                      py-[13px]
                      font-semibold
                      text-[#e71b93]
                      sm:bottom-[40px]
                      sm:px-[30px]
                      sm:py-[16px]
                    "
                  >
                    {activity.name}
                  </div>

                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <h1
                  className="
                    mt-[28px]
                    text-[36px]
                    font-semibold
                    leading-[46px]
                    text-[#111]
                    sm:text-[48px]
                    sm:leading-[58px]
                    lg:text-[55px]
                    lg:leading-[65px]
                  "
                >
                  {activity.name}
                </h1>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div
                  className="
                    mt-[15px]
                    text-[16px]
                    leading-[28px]
                    text-[#666]
                    sm:text-[18px]
                    sm:leading-[30px]
                  "
                >

                  {activity.description ? (

                    <p className="whitespace-pre-line">
                      {activity.description}
                    </p>

                  ) : (

                    <p>
                      No description available
                      for this activity.
                    </p>

                  )}

                </div>

              </div>

            ) : null}

          </div>

        </div>

      </div>

    </section>
  );
};

export default Activities;
