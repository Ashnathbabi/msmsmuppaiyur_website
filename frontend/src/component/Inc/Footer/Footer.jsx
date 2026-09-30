import React, {
  useEffect,
  useState
} from "react";

import {
  FiFacebook,
  FiInstagram,
  FiYoutube
} from "react-icons/fi";

import phoneIcon
  from "../../../assets/footer/phn1.png";

import locationIcon
  from "../../../assets/footer/location1.png";

import emailIcon
  from "../../../assets/footer/email1.png";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

const SERVER_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "";


/*
|--------------------------------------------------------------------------
| Image URL
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

  return `${SERVER_URL}${
    image.startsWith("/")
      ? image
      : `/${image}`
  }`;
};


/*
|--------------------------------------------------------------------------
| Footer Component
|--------------------------------------------------------------------------
*/

export default function Footer() {

  const [settings, setSettings] =
    useState(null);

  const [quickLinks, setQuickLinks] =
    useState([]);

  const [academicLinks, setAcademicLinks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /*
  |--------------------------------------------------------------------------
  | Get Footer Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchFooter = async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/footer`,
            {
              cache: "no-store"
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load footer"
          );
        }

        setSettings(
          data.settings || null
        );

        setQuickLinks(
          (data.quickLinks || [])
            .filter(
              item =>
                Number(
                  item.status
                ) === 1
            )
            .sort(
              (a, b) =>
                Number(a.sort_order) -
                Number(b.sort_order)
            )
        );

        setAcademicLinks(
          (data.academicLinks || [])
            .filter(
              item =>
                Number(
                  item.status
                ) === 1
            )
            .sort(
              (a, b) =>
                Number(a.sort_order) -
                Number(b.sort_order)
            )
        );

      } catch (error) {

        console.error(
          "Footer error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


    fetchFooter();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return null;

  }


  /*
  |--------------------------------------------------------------------------
  | Fallback
  |--------------------------------------------------------------------------
  */

  if (!settings) {

    return null;

  }


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (

    <footer className="bg-[#f5f5f5]">

      <div className="mx-auto max-w-[1200px] px-5 py-12">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">


          {/* ========================================================= */}
          {/* LOGO / DESCRIPTION */}
          {/* ========================================================= */}

          <div>

            {settings.logo && (

              <img
                src={
                  getImageUrl(
                    settings.logo
                  )
                }
                alt="School Logo"
                className="mb-5 max-h-24 max-w-[220px] object-contain"
              />

            )}


            <p className="text-sm leading-7 text-gray-600">

              {settings.description}

            </p>


            {/* SOCIAL MEDIA */}

            <div className="mt-5 flex items-center gap-3">

              {settings.facebook_url && (

                <a
                  href={
                    settings.facebook_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-800 hover:text-white"
                >

                  <FiFacebook
                    size={17}
                  />

                </a>

              )}


              {settings.instagram_url && (

                <a
                  href={
                    settings.instagram_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-800 hover:text-white"
                >

                  <FiInstagram
                    size={17}
                  />

                </a>

              )}


              {settings.youtube_url && (

                <a
                  href={
                    settings.youtube_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-800 hover:text-white"
                >

                  <FiYoutube
                    size={17}
                  />

                </a>

              )}

            </div>

          </div>


          {/* ========================================================= */}
          {/* QUICK LINKS */}
          {/* ========================================================= */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-gray-800">

              Quick Links

            </h3>


            <ul className="space-y-3">

              {quickLinks.map(
                item => (

                  <li
                    key={item.id}
                  >

                    <a
                      href={
                        item.href
                      }
                      className="text-sm text-gray-600 transition hover:text-black"
                    >

                      {item.name}

                    </a>

                  </li>

                )
              )}

            </ul>

          </div>


          {/* ========================================================= */}
          {/* ACADEMICS */}
          {/* ========================================================= */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-gray-800">

              Our Academics

            </h3>


            <ul className="space-y-3">

              {academicLinks.map(
                item => (

                  <li
                    key={item.id}
                  >

                    <a
                      href={
                        item.href
                      }
                      className="text-sm text-gray-600 transition hover:text-black"
                    >

                      {item.name}

                    </a>

                  </li>

                )
              )}

            </ul>

          </div>


          {/* ========================================================= */}
          {/* CONTACT */}
          {/* ========================================================= */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-gray-800">

              Contact Us

            </h3>


            <div className="space-y-5">


              {/* PHONE */}

              {settings.phone && (

                <a
                  href={`tel:${settings.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`}
                  className="flex items-start gap-3"
                >

                  <img
                    src={phoneIcon}
                    alt=""
                    className="mt-1 h-5 w-5 object-contain"
                  />

                  <span className="text-sm leading-6 text-gray-600">

                    {settings.phone}

                  </span>

                </a>

              )}


              {/* ADDRESS */}

              {settings.address && (

                <div className="flex items-start gap-3">

                  <img
                    src={locationIcon}
                    alt=""
                    className="mt-1 h-5 w-5 object-contain"
                  />

                  <span className="text-sm leading-6 text-gray-600">

                    {settings.address}

                  </span>

                </div>

              )}


              {/* EMAIL */}

              {settings.email && (

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-3"
                >

                  <img
                    src={emailIcon}
                    alt=""
                    className="mt-1 h-5 w-5 object-contain"
                  />

                  <span className="break-all text-sm leading-6 text-gray-600">

                    {settings.email}

                  </span>

                </a>

              )}

            </div>

          </div>

        </div>


        {/* ========================================================= */}
        {/* BOTTOM FOOTER */}
        {/* ========================================================= */}

        <div className="mt-10 border-t border-gray-300 pt-5">
  <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-gray-500 md:flex-row">

    {/* COPYRIGHT + PRIVACY + POWERED BY */}
    <div className="flex flex-wrap items-center justify-center gap-2">

      <span>
        © {settings.copyright_year}
      </span>

      <span>||</span>

      <a
        href={settings.privacy_url || "#"}
        className="transition hover:text-black"
      >
        {settings.privacy_text}
      </a>

      <span>||</span>

      <span>
        Powered By{" "}
        <a
          href={settings.powered_by_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-700 hover:text-black"
        >
          {settings.powered_by_text}
        </a>
      </span>

    </div>

  </div>
</div>
      </div>

    </footer>

  );
}