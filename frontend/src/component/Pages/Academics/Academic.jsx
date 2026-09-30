import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import academicsImage from "../../../assets/academics/academics.png";
import logoSidebar from "../../../assets/academics/logo_sidebar.png";
import ratingShadow from "../../../assets/academics/rating-shadow.png";

/* =========================================================
   API URL
========================================================= */

const API_ROOT =
  import.meta.env.VITE_API_URL || "";

const API_URL = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;

/* =========================================================
   DEFAULT CONTENT
   Used only when API content is unavailable.
========================================================= */

const defaultData = {
  academics: {
    title: "Academics",
    description:
      "To ignite academic excellence in the mind and heart of the students to build up personality and responsibility.",
  },

  examination: {
    title: "Examination",
    description:
      "The school follows a systematic examination and evaluation process to monitor the academic progress of students.",
  },

  curriculum: {
    title: "Curriculum",
    description:
      "Our curriculum is designed to provide academic excellence along with personality development and overall growth.",
  },

  tc: {
    title: "Transfer Certificate",
    description:
      "Transfer Certificate related information will be displayed here.",
  },

  admission: {
    title: "Admission Procedure",

    intro: [
      "We take all students from the surrounding villages and give special attention to the poor and less-privileged. We fix the school fee reasonably and try to be charitable toward deserving students.",

      "Office hours : Morning 9.00 am to Noon 13.00 pm.",

      "For receiving application, paying fees, Obtaining Certificates & Application, Submitting forms and Copies and for any other enquiry.",
    ],

    sections: [
      {
        title: "For LKG: available seats 120",
        items: [
          "Application is available from March.",
          "Application fee: Rs. 200",
          "Admission is from April (first 2 weeks of April).",
          "To those who pay full fee on admission.",
          "To those who's siblings are studying already at MSMHSS",
          "For LKG: books, notes, stitched uniforms, shoe - socks will be given at the first day of the school.",
          "Parents have to take responsibility to find the vehicle to send their children to the school.",
        ],
      },

      {
        title: "For other Classes (I to IX) from May",
        items: [
          'Student must have completed age 5 for 1" STD.',
          "Students should provide: Birth certificate, TC, EMIS number.",
          "Aadhar number and 2 passport size photos.",
          'For 6" and 9" there will be an interview or test on admission by the principal or a class teacher.',
        ],
      },

      {
        title: "For other Classes (XI and XII) from June",
        items: [
          "Students should bring previous year marks sheet, TC, 2 passport size photos, Emis no. and parents' letter for joining this school and taking what subject.",
          "There will be an interview on admission by the principal or a class teacher.",
          "Full fee has to be paid on admission.",
          "Minimum 300 marks have to be obtained.",
          "Concession will be given to those who have scored above 470 at SSLC.",
        ],
      },
    ],
  },

  parents: {
    title: "Rules of Parents",

    rules: [
      "We expect that all parents ensure to pay all fee in due time and during office hours (9.00 to 13.00).",
      "You make sure that your students come regularly to school in full / neat uniform with required books and writing materials.",
      "Parents should regularly check whether your children do their home works and sign the dairies.",
      "Parents are to participate parents' meet regularly, sign the rank card, collect proper information about their children from the class teachers and make suggestions if they have.",
      "Continuous absence of the parents for the parent's meet may cause the dismissal of the students.",
      "Boys are to come to the school with their hair properly dressed, shirt ducked and shoes are tied properly and girls with their hair dressed of two plaits.",
      "Do not send the students to school when they are suffering from fever, contagious and infectious disease like viral, dengue, vomiting and chicken and small pox.",
      "Parents are to come in proper dress to school. No Bermudas and lunghis.",
      "Parents are not allowed to meet their children during class hours. When an emergency occurs they have to seek the permission of the principal or correspondent.",
      "Parents have to avoid direct involvement with the teachers and other students. No giving gifts and asking them to have special attention.",
      "Do not allow the students to bring mobile phones, electronic, play items, and costly things like watch, ring and jewels. The management will not take responsibility if they lose anything of that kind.",
      "We encourage parents to give leave letters before taking leave. When an emergency takes place send the leave letter when next they come to school.",
      "Long leave without information or medical certificate may cause removal or dismissal from the school.",
      "Late comers will not be allowed to enter into the campus. Frequent late arrivals will be fined or dismissed.",
      "Any student who causes annoyances and disturbs other students for unnecessary reason will be also dismissed.",
      "Students who tease the staff, office workers, ayyas and other students will be dismissed from the school.",
      "Students who damage school materials, engage in immoral and filthy languages and activities will be dismissed immediately.",
      "We encourage students to be disciplined, courteous and well mannered to study well and pursue good marks to set their future goal.",
      "Encourage your students to make use of all the facilities and enjoy all chances given by the school especially those extra-curricular activities.",
      "Legitimate complaints and proposals should reach the principal or correspondent in due time.",
      "Parents are to be mindful of making unhealthy comments about the teachers and management. They are not to engage in arguments with anyone else about the school matters.",
      "Any irregularity and abnormality found in the behaviour of the children, parents should immediately bring to the knowledge of the management.",
      "Parents should encourage and fulfill all necessary things when their children are selected for sports and other academic events or competition. You are to send them in time and receive them with due attention.",
      "Parents are requested not to react impulsively to any complaints and matters arising on their children, before clarifying the truth.",
      "Only parents are allowed to sign the rank card of their children on that day, not allowed on any other days.",
    ],
  },

  students: {
    title: "Rules of Students",

    rules: [
      "Come in time, remain in your class and no wandering around the campus.",
      'Come with proper uniform, neat and tidy, do not walk scratching your shoe on the floor, lift your foot and walk gently and wish "Hello and Good Morning" who you meet.',
      "Maintain silence, no touching and fighting, no shouting and pushing, no pulling and playing around the corridor.",
      "From the moment you enter the school campus till you leave you have to speak only in English.",
      "Keep the class room and campus clean; do not throw paper, pencil & pen and other unwanted materials here and there but put them in the dustbin.",
      "Bring healthy food in eatable quantity and do not waste them. Do not bring to school plastic materials.",
      "Do not steal or break other students' belongings and do not damage school properties while going around and steal fruits and coconuts. You will receive fine.",
      "Students are not allowed to meet parents and relatives inside the school campus without the permission of the principal or correspondent.",
      "The management is not entitled to take responsibility for the accidents that occurs outside the school premises, and when students pickup fights between them, fall or damage themselves carelessly inside the campus.",
      "Parents have to avoid direct involvement with the teachers and other students. No giving gifts and asking them to have special attention.",
      "Students who have not paid the full fee will not be permitted to appear for final exams.",
    ],

    classroomTitle: "Class Room Discipline:",

    classroomDescription:
      "For the Class Teacher and Class Leaders",

    classroomRules: [
      "Class teachers are expected to come early and leave the school when everything is kept in order.",
      "There will be a class Teacher for each section for the whole year. If anyone leaves the school there will be changes.",
      "There will be class leaders from the students for the whole year appointed by the management with the consultation of class teacher.",
      "Class leaders should realize that being leader is a special privilege to prove the quality of leadership and animation. It recommends trust and simplicity, truthfulness and honesty, courage and confidence.",
      "Class leaders have to be exemplary and role model to others in all aspects.",
      "All students have to respect the class leaders and be subjects to the guidance of the class leaders.",
      "One of the class leaders will maintain the black board every day with date and number of the students present as per the indication of the class teacher.",
      "Leaders should clean the black board after each class.",
      "Class leaders have to be responsible for any happening in the absence of the class teacher.",
      "There will be an assistant class leader who will look after the neatness of the students and class room, black board and book shelf, the order of the benches and desk.",
      "Class teacher along with the class leader take care of every aspect of the class room, teaching and when other information or circular is passed on.",
      "Students should not play in the class rooms and corridors and jump over the benches.",
      "Opening the doors, windows and arranging the desks and benches in the class room: As well as closing the windows, switching off the lights and fans, collecting the dust and put them in the dustbin when the school is over.",
      "When the students come without proper uniform the teacher will keep record and if they found more than 3 times in a month they will be fined.",
      "While moving from the class room for any other purpose, the class leader should lead the line at the left side of the corridor.",
    ],
  },

  courses: {
    title: "Courses Offered",

    courses: [
      "A1 : Tamil, English, Maths, Physics, Chemistry, Computer Science",
      "A2 : Tamil, English, Maths, Physics, Chemistry, Biology",
      "A3 : Tamil, English, Maths, Physics, Chemistry, Statistics",
      "C1 : Tamil, English, Accountancy, Commerce, Economics, Computer Application",
      "C2 : Tamil, English, Accountancy, Commerce, Economics, Business Maths & Statistics",
      "C3 : Tamil, English, Accountancy, Commerce, Economics, History",
    ],
  },
};

/* =========================================================
   FRONTEND SLUG -> DB SLUG
========================================================= */

const getDbSlug = (frontendSlug) => {
  const slugMap = {
    "rules-of-parents": "parents",
    "admission-procedure": "admission",
    "rules-of-students": "students",
    "courses-offered": "courses",
  };

  return slugMap[frontendSlug] || frontendSlug;
};

/* =========================================================
   DB SLUG -> FRONTEND SLUG
========================================================= */

const getFrontendSlug = (dbSlug) => {
  const slugMap = {
    academics: "academics",
    examination: "examination",
    curriculum: "curriculum",

    parents: "rules-of-parents",
    admission: "admission-procedure",
    students: "rules-of-students",

    tc: "tc",
    courses: "courses-offered",

    "rules-of-parents": "rules-of-parents",
    "admission-procedure": "admission-procedure",
    "rules-of-students": "rules-of-students",
    "courses-offered": "courses-offered",
  };

  return slugMap[dbSlug] || dbSlug;
};

/* =========================================================
   RULE LIST
========================================================= */

const RuleList = ({ items }) => {
  if (!items?.length) return null;

  return (
    <ul className="relative m-0 list-none space-y-[25px] p-0">
      {items.map((item, index) => (
        <li
          key={index}
          className="
            relative
            flex
            items-start
            pl-[35px]
            font-['Figtree',sans-serif]
            text-[16px]
            font-normal
            leading-[27px]
            text-[#666666]
            sm:text-[17px]
            sm:leading-[28px]
            md:text-[18px]
            md:leading-[30px]
          "
        >
          <span
            className="
              absolute
              left-0
              top-[3px]
              flex
              h-[24px]
              w-[24px]
              items-center
              justify-center
            "
          >
            <FaArrowUpRightFromSquare
              size={14}
              className="text-[#e71b93]"
            />
          </span>

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

/* =========================================================
   SIDEBAR
========================================================= */

const AcademicSidebar = () => {
  const location = useLocation();

  const [sidebarItems, setSidebarItems] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        setSidebarLoading(true);

        const response = await fetch(
          `${API_URL}/academics/sidebar`
        );

        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await response.text();

          console.error(
            "SIDEBAR NON JSON RESPONSE:",
            text
          );

          throw new Error(
            "Invalid sidebar API response."
          );
        }

        const result = await response.json();

        console.log(
          "ACADEMICS SIDEBAR RESPONSE:",
          result
        );

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load academic sidebar."
          );
        }

        if (Array.isArray(result.data)) {
          const menuItems = result.data
            .filter(
              (item) =>
                item.page_slug !== "academics" &&
                item.page_slug !== "academics-home"
            )
            .map((item) => ({
              ...item,
              frontendSlug:
                getFrontendSlug(item.page_slug),
            }));

          setSidebarItems(menuItems);
        } else {
          setSidebarItems([]);
        }
      } catch (error) {
        console.error(
          "ACADEMICS SIDEBAR ERROR:",
          error
        );

        setSidebarItems([]);
      } finally {
        setSidebarLoading(false);
      }
    };

    fetchSidebar();
  }, []);

  return (
    <div className="w-full">
      <aside className="sticky z-[10]">

        {/* =================================================
            SIDEBAR MENU
        ================================================= */}

        <div
          className="
            relative
            mb-[40px]
            overflow-hidden
            rounded-[5px]
            bg-[#f5f5f6]
            p-[30px]
          "
        >
          <h3
            className="
              relative
              -mx-[30px]
              -mt-[30px]
              mb-[40px]
              bg-[#e71b93]
              px-[30px]
              py-[13px]
              font-['Figtree',sans-serif]
              text-[23px]
              font-bold
              leading-[32px]
              text-white
            "
          >
            Academics
          </h3>

          {sidebarLoading ? (
            <div className="flex justify-center py-5">
              <div
                className="
                  h-[25px]
                  w-[25px]
                  animate-spin
                  rounded-full
                  border-[3px]
                  border-[#e71b93]
                  border-t-transparent
                "
              />
            </div>
          ) : sidebarItems.length === 0 ? (
            <div
              className="
                py-3
                text-center
                font-['Figtree',sans-serif]
                text-[14px]
                text-[#777]
              "
            >
              No pages available.
            </div>
          ) : (
            <ul className="m-0 list-none p-0">
              {sidebarItems.map((item) => {
                const frontendSlug =
                  item.frontendSlug ||
                  getFrontendSlug(item.page_slug);

                const itemUrl =
                  `/academics/${frontendSlug}`;

                const isActive =
                  location.pathname === itemUrl;

                return (
                  <li
                    key={item.id}
                    className="
                      group
                      relative
                      mb-[15px]
                      last:mb-0
                    "
                  >
                    <Link
                      to={itemUrl}
                      className={`
                        relative
                        block
                        overflow-hidden
                        rounded-full
                        border
                        border-black/50
                        px-[30px]
                        py-[18px]
                        pr-[75px]
                        font-['Figtree',sans-serif]
                        text-[16px]
                        font-semibold
                        leading-[26px]
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "rotate-[2deg] text-white"
                            : "text-black hover:rotate-[2deg] hover:text-white"
                        }
                      `}
                    >
                      <span
                        className={`
                          absolute
                          inset-0
                          z-0
                          rounded-full
                          bg-gradient-to-r
                          from-[#e71b93]
                          via-[#e71b93]
                          to-[#040201]
                          transition-transform
                          duration-500
                          ${
                            isActive
                              ? "translate-y-0"
                              : "translate-y-[-105%] group-hover:translate-y-0"
                          }
                        `}
                      />

                      <span className="relative z-[2]">
                        {item.page_title ||
                          item.title ||
                          "Untitled Page"}
                      </span>

                      <span
                        className={`
                          absolute
                          right-[6px]
                          top-1/2
                          z-[3]
                          flex
                          h-[55px]
                          w-[55px]
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
                          size={20}
                          strokeWidth={2.5}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* =================================================
            CONTACT WIDGET
        ================================================= */}

        <div
          className="
            relative
            mb-[40px]
            overflow-hidden
            rounded-[45px]
            bg-black
          "
        >
          <div
            className="
              relative
              px-[30px]
              pb-[45px]
              pt-[35px]
              sm:px-[40px]
              sm:pb-[50px]
            "
            style={{
              backgroundImage: `url(${ratingShadow})`,
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% auto",
            }}
          >
            <div
              className="
                relative
                mt-[25px]
                flex
                justify-center
                sm:mt-[40px]
              "
            >
              <img
                src={logoSidebar}
                alt="School Logo"
                className="
                  max-h-[90px]
                  w-auto
                  object-contain
                "
              />
            </div>

            <h4
              className="
                relative
                mt-[25px]
                text-center
                font-['Figtree',sans-serif]
                text-[16px]
                font-normal
                leading-[30px]
                text-white
                sm:mt-[30px]
                sm:leading-[40px]
              "
            >
              Any Questions? Let’s talk

              <a
                href="tel:+919655407774"
                className="
                  block
                  font-['Figtree',sans-serif]
                  text-[24px]
                  font-bold
                  leading-[35px]
                  text-white
                  transition-colors
                  duration-300
                  hover:text-[#e71b93]
                  sm:text-[29px]
                  sm:leading-[40px]
                "
              >
                (+91) 9655407774
              </a>
            </h4>

            <div
              className="
                relative
                mt-[30px]
                flex
                justify-center
                sm:mt-[35px]
              "
            >
              <Link
                to="/contact"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  overflow-hidden
                  rounded-full
                  bg-[#e71b93]
                  py-[8px]
                  pl-[30px]
                  pr-[8px]
                  font-['Figtree',sans-serif]
                  text-[14px]
                  font-bold
                  uppercase
                  text-white
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-black
                "
              >
                <span className="relative z-[2]">
                  Get a Call Back
                </span>

                <span
                  className="
                    relative
                    z-[2]
                    ml-[15px]
                    flex
                    h-[50px]
                    w-[50px]
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    transition-all
                    duration-300
                    group-hover:bg-[#e71b93]
                  "
                >
                  <ArrowRight
                    size={20}
                    className="text-white"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Academics = () => {
  const location = useLocation();
  const { slug } = useParams();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     CURRENT SLUG
  ======================================================= */

  const currentSlug = slug || "academics";

  /*
   * Convert frontend URL slug to DB slug.
   *
   * Example:
   *
   * /academics/rules-of-parents
   *          ↓
   * parents
   *
   * /academics/school-activities
   *          ↓
   * school-activities
   */

  const dbSlug = getDbSlug(currentSlug);

  /* =======================================================
     LOAD CONTENT
  ======================================================= */

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setPageData(null);

        const response = await fetch(
          `${API_URL}/academics/${dbSlug}`
        );

        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await response.text();

          console.error(
            "ACADEMICS NON JSON RESPONSE:",
            text
          );

          throw new Error(
            "Invalid academics API response."
          );
        }

        const result = await response.json();

        console.log(
          "ACADEMICS PAGE RESPONSE:",
          result
        );

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              `Page not found (${response.status})`
          );
        }

        if (result.data) {
          setPageData(result.data);
        } else {
          setPageData(null);
        }
      } catch (error) {
        console.error(
          "ACADEMICS CONTENT ERROR:",
          error
        );

        /*
         * Fallback to old hardcoded content
         * if API content is unavailable.
         */

        setPageData(
          defaultData[currentSlug] ||
            defaultData[dbSlug] ||
            defaultData.academics
        );
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [dbSlug, currentSlug]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          bg-white
        "
      >
        <div
          className="
            h-[45px]
            w-[45px]
            animate-spin
            rounded-full
            border-[4px]
            border-[#e71b93]
            border-t-transparent
          "
        />
      </section>
    );
  }

  /* =======================================================
     NORMALIZE DATA
  ======================================================= */

  const data =
    pageData ||
    defaultData[currentSlug] ||
    defaultData[dbSlug] ||
    defaultData.academics;

  /*
   * If page is from DB, page_title is used.
   */

  const title =
    data.page_title ||
    data.title ||
    "Academics";

  const description =
    data.description || "";

  /* =======================================================
     DETECT OLD SPECIAL PAGES
  ======================================================= */

  const isAcademics =
    currentSlug === "academics";

  const isAdmission =
    currentSlug === "admission-procedure" ||
    dbSlug === "admission";

  const isParents =
    currentSlug === "rules-of-parents" ||
    dbSlug === "parents";

  const isStudents =
    currentSlug === "rules-of-students" ||
    dbSlug === "students";

  const isCourses =
    currentSlug === "courses-offered" ||
    dbSlug === "courses";

  const isExamination =
    currentSlug === "examination";

  const isCurriculum =
    currentSlug === "curriculum";

  const isTC =
    currentSlug === "tc";

  /*
   * A newly created sidebar page will reach here.
   *
   * Example:
   * school-activities
   * school-rules
   * facilities
   * achievements
   *
   * These do NOT have hardcoded rendering.
   */

  const isDynamicCustomPage =
    !isAcademics &&
    !isAdmission &&
    !isParents &&
    !isStudents &&
    !isCourses &&
    !isExamination &&
    !isCurriculum &&
    !isTC;

  /* =======================================================
     RENDER CONTENT
  ======================================================= */

  const renderContent = () => {

    /* =====================================================
       ACADEMICS HOME
    ===================================================== */

    if (isAcademics) {
      return (
        <>
          <div
            className="
              relative
              overflow-hidden
              rounded-[25px]
            "
          >
            <img
              src={academicsImage}
              alt="Academics"
              className="
                block
                h-auto
                w-full
                object-cover
              "
            />

            <div
              className="
                absolute
                bottom-[40px]
                right-0
                rounded-l-[50px]
                bg-white
                px-[25px]
                py-[15px]
                font-['Figtree',sans-serif]
                text-[17px]
                font-semibold
                text-[#e71b93]
                sm:bottom-[60px]
                sm:px-[30px]
                sm:py-[18px]
                sm:text-[18px]
              "
            >
              {title}
            </div>
          </div>

          <h1
            className="
              relative
              mb-[15px]
              mt-[25px]
              font-['Figtree',sans-serif]
              text-[38px]
              font-semibold
              capitalize
              leading-[48px]
              text-[#111]
              sm:text-[48px]
              sm:leading-[58px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h1>

          <p
            className="
              relative
              mb-[10px]
              font-['Figtree',sans-serif]
              text-[16px]
              font-normal
              leading-[27px]
              text-[#666]
              sm:text-[18px]
              sm:leading-[28px]
            "
          >
            {description}
          </p>
        </>
      );
    }

    /* =====================================================
       DYNAMIC CUSTOM PAGE
       
       This is the important part.
       
       Any page created from Admin > Add Sidebar
       will automatically display here.
    ===================================================== */

    if (isDynamicCustomPage) {
      return (
        <>
          <h2
            className="
              relative
              mb-[25px]
              mt-0
              font-['Figtree',sans-serif]
              text-[32px]
              font-semibold
              capitalize
              leading-[42px]
              tracking-[-0.5px]
              text-[#050734]
              sm:text-[40px]
              sm:leading-[50px]
              md:text-[50px]
              md:leading-[60px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h2>

          <div
            className="
              whitespace-pre-line
              font-['Figtree',sans-serif]
              text-[16px]
              font-normal
              leading-[28px]
              text-[#666666]
              sm:text-[17px]
              sm:leading-[30px]
              md:text-[18px]
              md:leading-[31px]
            "
          >
            {description}
          </div>
        </>
      );
    }

    /* =====================================================
       EXAMINATION / CURRICULUM / TC
    ===================================================== */

    if (
      isExamination ||
      isCurriculum ||
      isTC
    ) {
      return (
        <>
          <h2
            className="
              relative
              mb-[20px]
              mt-0
              font-['Figtree',sans-serif]
              text-[32px]
              font-semibold
              capitalize
              leading-[42px]
              tracking-[-0.5px]
              text-[#050734]
              sm:text-[40px]
              sm:leading-[50px]
              md:text-[50px]
              md:leading-[60px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h2>

          <p
            className="
              relative
              mb-[10px]
              whitespace-pre-line
              font-['Figtree',sans-serif]
              text-[16px]
              font-normal
              leading-[27px]
              text-[#666666]
              sm:text-[18px]
              sm:leading-[30px]
            "
          >
            {description}
          </p>
        </>
      );
    }

    /* =====================================================
       ADMISSION
    ===================================================== */

    if (isAdmission) {
      return (
        <>
          <h2
            className="
              mb-[20px]
              mt-0
              font-['Figtree',sans-serif]
              text-[32px]
              font-semibold
              capitalize
              leading-[42px]
              tracking-[-0.5px]
              text-[#050734]
              sm:text-[40px]
              sm:leading-[50px]
              md:text-[50px]
              md:leading-[60px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h2>

          {data.intro?.map((text, index) => (
            <p
              key={index}
              className="
                mb-[15px]
                font-['Figtree',sans-serif]
                text-[16px]
                leading-[27px]
                text-[#666666]
                sm:text-[17px]
                sm:leading-[28px]
                md:text-[18px]
                md:leading-[30px]
              "
            >
              {text}
            </p>
          ))}

          {data.sections?.map(
            (section, index) => (
              <div
                key={index}
                className="mt-[45px]"
              >
                <h3
                  className="
                    mb-[20px]
                    font-['Figtree',sans-serif]
                    text-[26px]
                    font-semibold
                    capitalize
                    leading-[36px]
                    text-[#050734]
                    sm:text-[30px]
                    sm:leading-[40px]
                    md:text-[32px]
                    md:leading-[42px]
                  "
                >
                  {section.title}
                </h3>

                <RuleList
                  items={section.items}
                />
              </div>
            )
          )}
        </>
      );
    }

    /* =====================================================
       PARENTS
    ===================================================== */

    if (isParents) {
      return (
        <>
          <h2
            className="
              relative
              mb-[30px]
              mt-0
              font-['Figtree',sans-serif]
              text-[32px]
              font-semibold
              capitalize
              leading-[42px]
              tracking-[-0.5px]
              text-[#050734]
              sm:text-[40px]
              sm:leading-[50px]
              md:text-[50px]
              md:leading-[60px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h2>

          <RuleList
            items={data.rules}
          />
        </>
      );
    }

    /* =====================================================
       STUDENTS
    ===================================================== */

    if (isStudents) {
      return (
        <>
          <h2
            className="
              relative
              mb-[30px]
              mt-0
              font-['Figtree',sans-serif]
              text-[32px]
              font-semibold
              capitalize
              leading-[42px]
              tracking-[-0.5px]
              text-[#050734]
              sm:text-[40px]
              sm:leading-[50px]
              md:text-[50px]
              md:leading-[60px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h2>

          <RuleList
            items={data.rules}
          />

          <h3
            className="
              relative
              mb-[15px]
              mt-[45px]
              font-['Figtree',sans-serif]
              text-[25px]
              font-semibold
              capitalize
              leading-[35px]
              text-black
              sm:text-[28px]
              sm:leading-[38px]
              md:text-[32px]
              md:leading-[42px]
            "
          >
            {data.classroomTitle}
          </h3>

          <p
            className="
              relative
              mb-[25px]
              font-['Figtree',sans-serif]
              text-[17px]
              leading-[28px]
              text-[#666666]
              md:text-[18px]
              md:leading-[30px]
            "
          >
            {data.classroomDescription}
          </p>

          <RuleList
            items={data.classroomRules}
          />
        </>
      );
    }

    /* =====================================================
       COURSES
    ===================================================== */

    if (isCourses) {
      return (
        <>
          <h2
            className="
              relative
              mb-[30px]
              mt-0
              font-['Figtree',sans-serif]
              text-[32px]
              font-semibold
              capitalize
              leading-[42px]
              tracking-[-0.5px]
              text-[#050734]
              sm:text-[40px]
              sm:leading-[50px]
              md:text-[50px]
              md:leading-[60px]
              lg:text-[60px]
              lg:leading-[70px]
            "
          >
            {title}
          </h2>

          <div
            className="
              w-full
              overflow-x-auto
              rounded-[15px]
            "
          >
            <table
              className="
                w-full
                min-w-[600px]
                border-collapse
                overflow-hidden
                font-['Figtree',sans-serif]
              "
            >
              <thead>
                <tr>
                  <th
                    className="
                      bg-[#2d2588]
                      px-[25px]
                      py-[18px]
                      text-left
                      text-[18px]
                      font-bold
                      leading-[28px]
                      text-white
                      sm:text-[20px]
                    "
                  >
                    XI & XII Groups
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.courses?.map(
                  (course, index) => (
                    <tr
                      key={index}
                      className="
                        group
                        border-b
                        border-[#dddddd]
                        last:border-b-0
                      "
                    >
                      <td
                        className="
                          bg-white
                          px-[25px]
                          py-[18px]
                          text-[16px]
                          font-normal
                          leading-[28px]
                          text-[#666666]
                          transition-all
                          duration-300
                          group-hover:bg-[#fff0f8]
                          group-hover:text-[#e71b93]
                          sm:text-[17px]
                          md:text-[18px]
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            gap-[12px]
                          "
                        >
                          <span
                            className="
                              mt-[3px]
                              flex
                              h-[22px]
                              w-[22px]
                              shrink-0
                              items-center
                              justify-center
                            "
                          >
                            <FaArrowUpRightFromSquare
                              size={14}
                              className="
                                text-[#e71b93]
                                transition-all
                                duration-300
                                group-hover:text-black
                              "
                            />
                          </span>

                          <span>
                            {course}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    return null;
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        py-[80px]
        sm:py-[90px]
        md:py-[100px]
        lg:py-[110px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1320px]
          px-4
          sm:px-5
          lg:px-6
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-[40px]
            lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
            lg:gap-[30px]
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="w-full">
            <div className="relative isolate">

              {!isAcademics && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-[-8px]
                    top-[-8px]
                    z-[-1]
                    hidden
                    h-[calc(100%-35px)]
                    w-[65%]
                    rounded-[22px]
                    bg-black
                    lg:block
                  "
                />
              )}

              <div
                className="
                  relative
                  z-[1]
                  mb-[30px]
                  w-full
                  rounded-[20px]
                  bg-[#f5f5f5]
                  px-[20px]
                  py-[30px]
                  sm:px-[30px]
                  sm:py-[35px]
                  md:px-[40px]
                  md:py-[40px]
                "
              >
                {renderContent()}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <AcademicSidebar />

        </div>
      </div>
    </section>
  );
};

export default Academics;