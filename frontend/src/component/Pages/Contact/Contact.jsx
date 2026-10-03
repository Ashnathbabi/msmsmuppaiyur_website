import { API_URL } from "../../../config/api";
import React, { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";



const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: "+91 9655407774",
    email: "msmsmuppaiyur@gmail.com",
    address: [
      "Madurai-Thondi Highway,",
      "Muppaiyur-Post,",
      "Sivagangai Dt.623402",
    ],
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // GET CONTACT DETAILS
  // =====================================================

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setInfoLoading(true);

        const response = await fetch(`${API_URL}/contact/info`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          setContactInfo({
            phone: data.data.phone || "+91 9655407774",
            email:
              data.data.email || "msmsmuppaiyur@gmail.com",
            address: data.data.address || [
              "Madurai-Thondi Highway,",
              "Muppaiyur-Post,",
              "Sivagangai Dt.623402",
            ],
          });
        }
      } catch (err) {
        console.error("Contact info error:", err);
      } finally {
        setInfoLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      // Response JSON இல்லாமலும் server error வரலாம்
      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {
          message: text || "Invalid server response",
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Server error (${response.status})`
        );
      }

      setSuccess(
        data.message ||
          "Your message has been sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);

      if (err.name === "TypeError") {
        setError(
          "Unable to connect to server. Please check whether the backend server is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to send message. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-[70px] sm:py-[80px] md:py-[90px] lg:py-[100px]">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-[50px] lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-[45px]">

          {/* =====================================================
              LEFT - FORM
          ===================================================== */}

          <div className="w-full">

            {/* Heading */}

            <div className="mb-[30px] text-left sm:mb-[35px]">

              <div className="relative ml-[20px] inline-block">

                <h5
                  className="
                    relative
                    font-['Figtree',sans-serif]
                    text-[15px]
                    font-medium
                    uppercase
                    tracking-[0.5px]
                    text-[#2d2588]
                    sm:text-[17px]
                  "
                >
                  Our Contact Us

                  <span
                    className="
                      absolute
                      -left-[20px]
                      top-1/2
                      h-[8px]
                      w-[8px]
                      -translate-y-1/2
                      rounded-full
                      bg-[#2d2588]
                    "
                  />

                  <span
                    className="
                      absolute
                      -right-[18px]
                      top-1/2
                      h-[8px]
                      w-[8px]
                      -translate-y-1/2
                      rounded-full
                      bg-[#2d2588]
                    "
                  />
                </h5>

              </div>

              <h2
                className="
                  mt-[12px]
                  font-['Figtree',sans-serif]
                  text-[32px]
                  font-bold
                  capitalize
                  leading-[42px]
                  text-[#0f2239]
                  sm:text-[38px]
                  sm:leading-[48px]
                  md:text-[42px]
                  md:leading-[52px]
                "
              >
                Get Our Contact Now.
              </h2>

            </div>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-4
                  py-3
                  text-emerald-700
                "
              >
                <CheckCircle
                  size={20}
                  className="shrink-0"
                />

                <p className="text-sm font-medium">
                  {success}
                </p>
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-red-700
                "
              >
                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <p className="text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="w-full"
            >

              {/* Name + Email */}

              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  disabled={loading}
                  className="
                    h-[52px]
                    w-full
                    rounded-[3px]
                    border
                    border-[#ddd]
                    bg-white
                    px-[20px]
                    text-[16px]
                    text-[#333]
                    outline-none
                    transition-all
                    placeholder:text-[#999]
                    focus:border-[#2d2588]
                    focus:ring-1
                    focus:ring-[#2d2588]
                    disabled:bg-gray-50
                  "
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  disabled={loading}
                  className="
                    h-[52px]
                    w-full
                    rounded-[3px]
                    border
                    border-[#ddd]
                    bg-white
                    px-[20px]
                    text-[16px]
                    text-[#333]
                    outline-none
                    transition-all
                    placeholder:text-[#999]
                    focus:border-[#2d2588]
                    focus:ring-1
                    focus:ring-[#2d2588]
                    disabled:bg-gray-50
                  "
                />

              </div>

              {/* Phone + Subject */}

              <div className="mt-[20px] grid grid-cols-1 gap-[20px] md:grid-cols-2">

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                  disabled={loading}
                  className="
                    h-[52px]
                    w-full
                    rounded-[3px]
                    border
                    border-[#ddd]
                    bg-white
                    px-[20px]
                    text-[16px]
                    text-[#333]
                    outline-none
                    transition-all
                    placeholder:text-[#999]
                    focus:border-[#2d2588]
                    focus:ring-1
                    focus:ring-[#2d2588]
                    disabled:bg-gray-50
                  "
                />

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  disabled={loading}
                  className="
                    h-[52px]
                    w-full
                    rounded-[3px]
                    border
                    border-[#ddd]
                    bg-white
                    px-[20px]
                    text-[16px]
                    text-[#333]
                    outline-none
                    transition-all
                    placeholder:text-[#999]
                    focus:border-[#2d2588]
                    focus:ring-1
                    focus:ring-[#2d2588]
                    disabled:bg-gray-50
                  "
                />

              </div>

              {/* Message */}

              <div className="mt-[20px]">

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Please include as much detail as possible."
                  required
                  disabled={loading}
                  className="
                    min-h-[220px]
                    w-full
                    resize-none
                    rounded-[3px]
                    border
                    border-[#ddd]
                    bg-white
                    px-[20px]
                    py-[15px]
                    text-[16px]
                    leading-[26px]
                    text-[#333]
                    outline-none
                    transition-all
                    placeholder:text-[#999]
                    focus:border-[#2d2588]
                    focus:ring-1
                    focus:ring-[#2d2588]
                    disabled:bg-gray-50
                  "
                />

              </div>

              {/* Button */}

              <div className="mt-[20px]">

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-[10px]
                    rounded-full
                    bg-[#2d2588]
                    px-[30px]
                    py-[15px]
                    font-['Figtree',sans-serif]
                    text-[15px]
                    font-semibold
                    uppercase
                    tracking-[0.3px]
                    text-white
                    transition-all
                    hover:bg-[#e71b93]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:text-[17px]
                  "
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message!

                      <Send
                        size={18}
                        className="transition-transform group-hover:translate-x-[4px]"
                      />
                    </>
                  )}

                </button>

              </div>

            </form>
          </div>

          {/* =====================================================
              RIGHT - CONTACT INFO
          ===================================================== */}

          <div className="w-full">

            <div
              className="
                relative
                overflow-hidden
                rounded-[20px]
                border
                border-[#ddd]
                bg-white
                px-[20px]
                pb-[10px]
                pt-[45px]
                shadow-[0_10px_35px_rgba(15,34,57,0.05)]
                sm:px-[30px]
                md:px-[35px]
                lg:px-[40px]
                xl:px-[45px]
              "
            >

              <span
                className="
                  absolute
                  left-1/2
                  top-[-3px]
                  h-[6px]
                  w-[88%]
                  -translate-x-1/2
                  rounded-full
                  bg-[#f8df26]
                "
              />

              <div className="flex flex-col">

                {/* CALL */}

                <div
                  className="
                    grid
                    grid-cols-[65px_minmax(0,1fr)]
                    items-center
                    gap-x-[18px]
                    border-b
                    border-[#eeeeee]
                    py-[25px]
                    sm:grid-cols-[75px_minmax(0,1fr)]
                    sm:gap-x-[20px]
                  "
                >

                  <div
                    className="
                      flex
                      h-[65px]
                      w-[65px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#4582ff]
                      text-white
                      sm:h-[75px]
                      sm:w-[75px]
                    "
                  >
                    <Phone size={25} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="mb-[5px] text-[21px] font-bold text-[#0f2239] sm:text-[25px]">
                      Call
                    </h3>

                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                      className="block text-[16px] text-[#636363] hover:text-[#2d2588] sm:text-[19px]"
                    >
                      {infoLoading
                        ? "Loading..."
                        : contactInfo.phone}
                    </a>

                  </div>
                </div>

                {/* MAIL */}

                <div
                  className="
                    grid
                    grid-cols-[65px_minmax(0,1fr)]
                    items-center
                    gap-x-[18px]
                    border-b
                    border-[#eeeeee]
                    py-[25px]
                    sm:grid-cols-[75px_minmax(0,1fr)]
                    sm:gap-x-[20px]
                  "
                >

                  <div
                    className="
                      flex
                      h-[65px]
                      w-[65px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#e35aa6]
                      text-white
                      sm:h-[75px]
                      sm:w-[75px]
                    "
                  >
                    <Mail size={25} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="mb-[5px] text-[21px] font-bold text-[#0f2239] sm:text-[25px]">
                      Mail
                    </h3>

                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="
                        block
                        break-all
                        text-[15px]
                        text-[#636363]
                        hover:text-[#2d2588]
                        sm:text-[17px]
                      "
                    >
                      {infoLoading
                        ? "Loading..."
                        : contactInfo.email}
                    </a>

                  </div>
                </div>

                {/* ADDRESS */}

                <div
                  className="
                    grid
                    grid-cols-[65px_minmax(0,1fr)]
                    items-start
                    gap-x-[18px]
                    py-[25px]
                    sm:grid-cols-[75px_minmax(0,1fr)]
                    sm:gap-x-[20px]
                  "
                >

                  <div
                    className="
                      flex
                      h-[65px]
                      w-[65px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f2921f]
                      text-white
                      sm:h-[75px]
                      sm:w-[75px]
                    "
                  >
                    <MapPin size={25} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="mb-[5px] text-[21px] font-bold text-[#0f2239] sm:text-[25px]">
                      Address
                    </h3>

                    <p className="text-[15px] leading-[25px] text-[#636363] sm:text-[17px] sm:leading-[28px]">
                      {contactInfo.address.map(
                        (line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            {index <
                              contactInfo.address.length -
                                1 && <br />}
                          </React.Fragment>
                        )
                      )}
                    </p>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAP
        ===================================================== */}

        <div className="mt-[50px] w-full">

          <div className="h-[350px] w-full overflow-hidden rounded-[10px] sm:h-[400px] md:h-[500px]">

            <iframe
              title="Muppaiyur School Location"
              src="https://www.google.com/maps?q=9.812068622507095%2C+78.82157881553634&z=14&t=m&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
            />

          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;
