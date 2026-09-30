// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { FaArrowUpRightFromSquare } from "react-icons/fa6";

// import logoSidebar from "../../../assets/academics/logo_sidebar.png";
// import ratingShadow from "../../../assets/academics/rating-shadow.png";

// const RulesOfStudents = () => {
//   const rules = [
//     "Come in time, remain in your class and no wandering around the campus.",

//     'Come with proper uniform, neat and tidy, do not walk scratching your shoe on the floor, lift your foot and walk gently and wish "Hello and Good Morning" who you meet.',

//     "Maintain silence, no touching and fighting, no shouting and pushing, no pulling and playing around the corridor.",

//     "From the moment you enter the school campus till you leave you have to speak only in English.",

//     "Keep the class room and campus clean; do not throw paper, pencil & pen and other unwanted materials here and there but put them in the dustbin.",

//     "Bring healthy food in eatable quantity and do not waste them. Do not bring to school plastic materials.",

//     "Do not steal or break other students' belongings and do not damage school properties while going around and steal fruits and coconuts. You will receive fine.",

//     "Students are not allowed to meet parents and relatives inside the school campus without the permission of the principal or correspondent.",

//     "The management is not entitled to take responsibility for the accidents that occurs outside the school premises, and when students pickup fights between them, fall or damage themselves carelessly inside the campus.",

//     "Parents have to avoid direct involvement with the teachers and other students. No giving gifts and asking them to have special attention.",

//     "Students who have not paid the full fee will not be permitted to appear for final exams.",
//   ];

//   const classRoomRules = [
//     "Class teachers are expected to come early and leave the school when everything is kept in order.",

//     "There will be a class Teacher for each section for the whole year. If anyone leaves the school there will be changes.",

//     "There will be class leaders from the students for the whole year appointed by the management with the consultation of class teacher.",

//     "Class leaders should realize that being leader is a special privilege to prove the quality of leadership and animation. It recommends trust and simplicity, truthfulness and honesty, courage and confidence.",

//     "Class leaders have to be exemplary and role model to others in all aspects.",

//     "All students have to respect the class leaders and be subjects to the guidance of the class leaders.",

//     "One of the class leaders will maintain the black board every day with date and number of the students present as per the indication of the class teacher.",

//     "Leaders should clean the black board after each class.",

//     "Class leaders have to be responsible for any happening in the absence of the class teacher.",

//     "There will be an assistant class leader who will look after the neatness of the students and class room, black board and book shelf, the order of the benches and desk.",

//     "Class teacher along with the class leader take care of every aspect of the class room, teaching and when other information or circular is passed on.",

//     "Students should not play in the class rooms and corridors and jump over the benches.",

//     "Opening the doors, windows and arranging the desks and benches in the class room: As well as closing the windows, switching off the lights and fans, collecting the dust and put them in the dustbin when the school is over.",

//     "When the students come without proper uniform the teacher will keep record and if they found more than 3 times in a month they will be fined.",

//     "While moving from the class room for any other purpose, the class leader should lead the line at the left side of the corridor.",
//   ];

//   const sidebarItems = [
//     {
//       name: "Rules of Parents",
//       href: "/rules-of-parents",
//     },
//     {
//       name: "Admission Procedure",
//       href: "/admission-procedure",
//     },
//     {
//       name: "Rules of Students",
//       href: "/rules-of-students",
//     },
//     {
//       name: "TC",
//       href: "/tc",
//     },
//     {
//       name: "Courses Offered",
//       href: "/courses-offered",
//     },
//   ];

//   return (
//     <section
//       className="
//         relative
//         w-full
//         overflow-hidden
//         bg-white
//         py-[80px]
//         sm:py-[90px]
//         md:py-[100px]
//         lg:py-[110px]
//       "
//     >
//       <div
//         className="
//           mx-auto
//           w-full
//           max-w-[1320px]
//           px-4
//           sm:px-5
//           lg:px-6
//         "
//       >
//         <div
//           className="
//             grid
//             grid-cols-1
//             gap-[40px]
//             lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
//             lg:gap-[30px]
//           "
//         >

//           {/* =====================================================
//               LEFT CONTENT
//           ===================================================== */}

//           <div className="w-full">

//             {/* CARD + BLACK BACKGROUND */}
//             <div className="relative isolate">

//               {/* BLACK BACK SHAPE */}

//               <div
//                 className="
//                   pointer-events-none
//                   absolute
//                   left-[-8px]
//                   top-[-8px]
//                   z-[-1]
//                   hidden
//                   h-[calc(100%-35px)]
//                   w-[65%]
//                   rounded-[22px]
//                   bg-black
//                   lg:block
//                 "
//               />

//               {/* MAIN CARD */}

//               <div
//                 className="
//                   relative
//                   z-[1]
//                   mb-[30px]
//                   w-full
//                   rounded-[20px]
//                   bg-[#f5f5f5]
//                   px-[20px]
//                   py-[30px]
//                   sm:px-[30px]
//                   sm:py-[35px]
//                   md:px-[40px]
//                   md:py-[40px]
//                 "
//               >

//                 {/* TITLE */}

//                 <h2
//                   className="
//                     relative
//                     mb-[30px]
//                     mt-0
//                     font-['Figtree',sans-serif]
//                     text-[32px]
//                     font-semibold
//                     capitalize
//                     leading-[42px]
//                     tracking-[-0.5px]
//                     text-[#050734]
//                     sm:text-[40px]
//                     sm:leading-[50px]
//                     md:text-[50px]
//                     md:leading-[60px]
//                     lg:text-[60px]
//                     lg:leading-[70px]
//                   "
//                 >
//                   Rules of Students
//                 </h2>

//                 {/* ==========================================
//                     MAIN RULES
//                 ========================================== */}

//                 <ul className="m-0 list-none space-y-[25px] p-0">

//                   {rules.map((rule, index) => (
//                     <li
//                       key={index}
//                       className="
//                         relative
//                         flex
//                         items-start
//                         pl-[35px]
//                         font-['Figtree',sans-serif]
//                         text-[16px]
//                         font-normal
//                         leading-[27px]
//                         text-[#666666]
//                         sm:text-[17px]
//                         sm:leading-[28px]
//                         md:text-[18px]
//                         md:leading-[30px]
//                       "
//                     >

//                       {/* ICON */}

//                       <span
//                         className="
//                           absolute
//                           left-0
//                           top-[3px]
//                           flex
//                           h-[24px]
//                           w-[24px]
//                           items-center
//                           justify-center
//                         "
//                       >
//                         <FaArrowUpRightFromSquare
//                           size={14}
//                           className="text-[#e71b93]"
//                         />
//                       </span>

//                       {/* TEXT */}

//                       <span>
//                         {rule}
//                       </span>

//                     </li>
//                   ))}

//                 </ul>

//                 {/* ==========================================
//                     CLASS ROOM DISCIPLINE
//                 ========================================== */}

//                 <h3
//                   className="
//                     relative
//                     mb-[15px]
//                     mt-[45px]
//                     font-['Figtree',sans-serif]
//                     text-[25px]
//                     font-semibold
//                     capitalize
//                     leading-[35px]
//                     text-black
//                     sm:text-[28px]
//                     sm:leading-[38px]
//                     md:text-[32px]
//                     md:leading-[42px]
//                   "
//                 >
//                   Class Room Discipline:
//                 </h3>

//                 {/* DESCRIPTION */}

//                 <p
//                   className="
//                     relative
//                     mb-[25px]
//                     font-['Figtree',sans-serif]
//                     text-[17px]
//                     leading-[28px]
//                     text-[#666666]
//                     md:text-[18px]
//                     md:leading-[30px]
//                   "
//                 >
//                   For the Class Teacher and Class Leaders
//                 </p>

//                 {/* CLASS ROOM RULES */}

//                 <ul className="m-0 list-none space-y-[25px] p-0">

//                   {classRoomRules.map((rule, index) => (
//                     <li
//                       key={index}
//                       className="
//                         relative
//                         flex
//                         items-start
//                         pl-[35px]
//                         font-['Figtree',sans-serif]
//                         text-[16px]
//                         font-normal
//                         leading-[27px]
//                         text-[#666666]
//                         sm:text-[17px]
//                         sm:leading-[28px]
//                         md:text-[18px]
//                         md:leading-[30px]
//                       "
//                     >

//                       {/* ICON */}

//                       <span
//                         className="
//                           absolute
//                           left-0
//                           top-[3px]
//                           flex
//                           h-[24px]
//                           w-[24px]
//                           items-center
//                           justify-center
//                         "
//                       >
//                         <FaArrowUpRightFromSquare
//                           size={14}
//                           className="text-[#e71b93]"
//                         />
//                       </span>

//                       {/* TEXT */}

//                       <span>
//                         {rule}
//                       </span>

//                     </li>
//                   ))}

//                 </ul>

//               </div>
//             </div>
//           </div>

//           {/* =====================================================
//               RIGHT SIDEBAR
//           ===================================================== */}

//           <div className="w-full">

//             <aside
//               className="
//                 sticky
//                 z-[10]
//               "
//             >

//               {/* =================================================
//                   CATEGORY WIDGET
//               ================================================= */}

//               <div
//                 className="
//                   relative
//                   mb-[40px]
//                   overflow-hidden
//                   rounded-[5px]
//                   bg-[#f5f5f6]
//                   p-[30px]
//                 "
//               >

//                 {/* TITLE */}

//                 <h3
//                   className="
//                     relative
//                     -mx-[30px]
//                     -mt-[30px]
//                     mb-[40px]
//                     bg-[#e71b93]
//                     px-[30px]
//                     py-[13px]
//                     font-['Figtree',sans-serif]
//                     text-[23px]
//                     font-bold
//                     leading-[32px]
//                     text-white
//                   "
//                 >
//                   Academics
//                 </h3>

//                 {/* MENU */}

//                 <ul className="m-0 list-none p-0">

//                   {sidebarItems.map((item) => (
//                     <li
//                       key={item.name}
//                       className="
//                         group
//                         relative
//                         mb-[15px]
//                         last:mb-0
//                       "
//                     >

//                       <a
//                         href={item.href}
//                         className="
//                           relative
//                           block
//                           overflow-hidden
//                           rounded-full
//                           border
//                           border-black/50
//                           px-[30px]
//                           py-[18px]
//                           pr-[75px]
//                           font-['Figtree',sans-serif]
//                           text-[16px]
//                           font-semibold
//                           capitalize
//                           leading-[26px]
//                           text-black
//                           transition-all
//                           duration-300
//                           hover:rotate-[2deg]
//                           hover:text-white
//                         "
//                       >

//                         {/* HOVER BACKGROUND */}

//                         <span
//                           className="
//                             absolute
//                             inset-0
//                             z-0
//                             translate-y-[-105%]
//                             rounded-full
//                             bg-gradient-to-r
//                             from-[#e71b93]
//                             via-[#e71b93]
//                             to-[#040201]
//                             transition-transform
//                             duration-500
//                             group-hover:translate-y-0
//                           "
//                         />

//                         {/* TEXT */}

//                         <span className="relative z-[2]">
//                           {item.name}
//                         </span>

//                         {/* ARROW */}

//                         <span
//                           className="
//                             absolute
//                             right-[6px]
//                             top-1/2
//                             z-[3]
//                             flex
//                             h-[55px]
//                             w-[55px]
//                             -translate-y-1/2
//                             items-center
//                             justify-center
//                             rounded-full
//                             bg-black
//                             text-white
//                             transition-all
//                             duration-300
//                             group-hover:bg-white
//                             group-hover:text-black
//                           "
//                         >
//                           <ArrowRight
//                             size={20}
//                             strokeWidth={2.5}
//                           />
//                         </span>

//                       </a>
//                     </li>
//                   ))}

//                 </ul>
//               </div>

//               {/* =================================================
//                   CONTACT WIDGET
//               ================================================= */}

//               <div
//                 className="
//                   relative
//                   mb-[40px]
//                   overflow-hidden
//                   rounded-[45px]
//                   bg-black
//                 "
//               >

//                 <div
//                   className="
//                     relative
//                     px-[30px]
//                     pb-[45px]
//                     pt-[35px]
//                     sm:px-[40px]
//                     sm:pb-[50px]
//                   "
//                   style={{
//                     backgroundImage: `url(${ratingShadow})`,
//                     backgroundPosition: "center top",
//                     backgroundRepeat: "no-repeat",
//                     backgroundSize: "100% auto",
//                   }}
//                 >

//                   {/* LOGO */}

//                   <div
//                     className="
//                       relative
//                       mt-[25px]
//                       flex
//                       justify-center
//                       sm:mt-[40px]
//                     "
//                   >
//                     <img
//                       src={logoSidebar}
//                       alt="School Logo"
//                       className="
//                         max-h-[90px]
//                         w-auto
//                         object-contain
//                       "
//                     />
//                   </div>

//                   {/* PHONE */}

//                   <h4
//                     className="
//                       relative
//                       mt-[25px]
//                       text-center
//                       font-['Figtree',sans-serif]
//                       text-[16px]
//                       font-normal
//                       leading-[30px]
//                       text-white
//                       sm:mt-[30px]
//                       sm:leading-[40px]
//                     "
//                   >
//                     Any Questions? Let’s talk

//                     <a
//                       href="tel:+919655407774"
//                       className="
//                         block
//                         font-['Figtree',sans-serif]
//                         text-[24px]
//                         font-bold
//                         leading-[35px]
//                         text-white
//                         transition-colors
//                         duration-300
//                         hover:text-[#e71b93]
//                         sm:text-[29px]
//                         sm:leading-[40px]
//                       "
//                     >
//                       (+91) 9655407774
//                     </a>
//                   </h4>

//                   {/* BUTTON */}

//                   <div
//                     className="
//                       relative
//                       mt-[30px]
//                       flex
//                       justify-center
//                       sm:mt-[35px]
//                     "
//                   >
//                     <a
//                       href="/contact"
//                       className="
//                         group
//                         relative
//                         inline-flex
//                         items-center
//                         overflow-hidden
//                         rounded-full
//                         bg-[#e71b93]
//                         py-[8px]
//                         pl-[30px]
//                         pr-[8px]
//                         font-['Figtree',sans-serif]
//                         text-[14px]
//                         font-bold
//                         uppercase
//                         text-white
//                         transition-all
//                         duration-300
//                         hover:bg-white
//                         hover:text-black
//                       "
//                     >

//                       <span className="relative z-[2]">
//                         Get a Call Back
//                       </span>

//                       <span
//                         className="
//                           relative
//                           z-[2]
//                           ml-[15px]
//                           flex
//                           h-[50px]
//                           w-[50px]
//                           items-center
//                           justify-center
//                           rounded-full
//                           bg-black
//                         "
//                       >
//                         <ArrowRight
//                           size={20}
//                           className="text-white"
//                         />
//                       </span>

//                     </a>
//                   </div>

//                 </div>
//               </div>

//             </aside>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default RulesOfStudents;
