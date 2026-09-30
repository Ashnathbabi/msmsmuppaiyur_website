// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { FaArrowUpRightFromSquare } from "react-icons/fa6";

// import logoSidebar from "../../../assets/academics/logo_sidebar.png";
// import ratingShadow from "../../../assets/academics/rating-shadow.png";

// const AdmissionProcedure = () => {
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

//   const lkgRules = [
//     "Application is available from March.",
//     "Application fee: Rs. 200",
//     "Admission is from April (first 2 weeks of April).",
//     "To those who pay full fee on admission.",
//     "To those who's siblings are studying already at MSMHSS",
//     "For LKG: books, notes, stitched uniforms, shoe - socks will be given at the first day of the school.",
//     "Parents have to take responsibility to find the vehicle to send their children to the school.",
//   ];

//   const otherClassRules = [
//     'Student must have completed age 5 for 1" STD.',
//     "Students should provide: Birth certificate, TC, EMIS number.",
//     "Aadhar number and 2 passport size photos.",
//     'For 6" and 9" there will be an interview or test on admission by the principal or a class teacher.',
//   ];

//   const higherClassRules = [
//     "Students should bring previous year marks sheet, TC, 2 passport size photos, Emis no. and parents' letter for joining this school and taking what subject.",
//     "There will be an interview on admission by the principal or a class teacher.",
//     "Full fee has to be paid on admission.",
//     "Minimum 300 marks have to be obtained.",
//     "Concession will be given to those who have scored above 470 at SSLC.",
//   ];

//   const RuleList = ({ items }) => {
//     return (
//       <ul className="relative m-0 list-none space-y-[20px] p-0 sm:space-y-[25px]">
//         {items.map((item, index) => (
//           <li
//             key={index}
//             className="
//               relative
//               pl-[35px]
//               font-['Figtree',sans-serif]
//               text-[16px]
//               font-normal
//               leading-[27px]
//               text-[#666666]
//               sm:text-[17px]
//               sm:leading-[28px]
//               md:text-[18px]
//               md:leading-[30px]
//             "
//           >
//             {/* ICON */}

//             <span
//               className="
//                 absolute
//                 left-0
//                 top-[4px]
//                 flex
//                 h-[22px]
//                 w-[22px]
//                 items-center
//                 justify-center
//                 text-[#ff650c]
//               "
//             >
//               <FaArrowUpRightFromSquare size={15} />
//             </span>

//             {/* TEXT */}

//             <span>{item}</span>
//           </li>
//         ))}
//       </ul>
//     );
//   };

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

//             {/* CARD WRAPPER */}

//             <div className="relative isolate">

//               {/* =================================================
//                   BLACK BACKGROUND SHAPE
//               ================================================= */}

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

//               {/* =================================================
//                   MAIN SERVICE CARD
//               ================================================= */}

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

//                 {/* =================================================
//                     INTRO CONTENT
//                 ================================================= */}

//                 <div className="relative">

//                   <h2
//                     className="
//                       mb-[20px]
//                       mt-0
//                       font-['Figtree',sans-serif]
//                       text-[32px]
//                       font-semibold
//                       capitalize
//                       leading-[42px]
//                       tracking-[-0.5px]
//                       text-[#050734]
//                       sm:text-[40px]
//                       sm:leading-[50px]
//                       md:text-[50px]
//                       md:leading-[60px]
//                       lg:text-[60px]
//                       lg:leading-[70px]
//                     "
//                   >
//                     Admission Procedure
//                   </h2>

//                   <div
//                     className="
//                       space-y-[15px]
//                       font-['Figtree',sans-serif]
//                       text-[16px]
//                       leading-[27px]
//                       text-[#666666]
//                       sm:text-[17px]
//                       sm:leading-[28px]
//                       md:text-[18px]
//                       md:leading-[30px]
//                     "
//                   >
//                     <p>
//                       We take all students from the surrounding villages and
//                       give special attention to the poor and less-privileged.
//                       We fix the school fee reasonably and try to be charitable
//                       toward deserving students.
//                     </p>

//                     <p>
//                       Office hours : Morning 9.00 am to Noon 13.00 pm.
//                     </p>

//                     <p>
//                       For receiving application, paying fees, Obtaining
//                       Certificates &amp; Application, Submitting forms and
//                       Copies and for any other enquiry.
//                     </p>
//                   </div>
//                 </div>

//                 {/* =================================================
//                     LKG
//                 ================================================= */}

//                 <div className="mt-[40px]">

//                   <h3
//                     className="
//                       mb-[20px]
//                       font-['Figtree',sans-serif]
//                       text-[26px]
//                       font-semibold
//                       capitalize
//                       leading-[36px]
//                       text-[#050734]
//                       sm:text-[30px]
//                       sm:leading-[40px]
//                       md:text-[32px]
//                       md:leading-[42px]
//                     "
//                   >
//                     For LKG: available seats 120
//                   </h3>

//                   <RuleList items={lkgRules} />

//                 </div>

//                 {/* =================================================
//                     OTHER CLASSES I - IX
//                 ================================================= */}

//                 <div className="mt-[45px]">

//                   <h3
//                     className="
//                       mb-[20px]
//                       font-['Figtree',sans-serif]
//                       text-[26px]
//                       font-semibold
//                       capitalize
//                       leading-[36px]
//                       text-[#050734]
//                       sm:text-[30px]
//                       sm:leading-[40px]
//                       md:text-[32px]
//                       md:leading-[42px]
//                     "
//                   >
//                     For other Classes (I to IX) from May
//                   </h3>

//                   <RuleList items={otherClassRules} />

//                 </div>

//                 {/* =================================================
//                     OTHER CLASSES XI - XII
//                 ================================================= */}

//                 <div className="mt-[45px]">

//                   <h3
//                     className="
//                       mb-[20px]
//                       font-['Figtree',sans-serif]
//                       text-[26px]
//                       font-semibold
//                       capitalize
//                       leading-[36px]
//                       text-[#050734]
//                       sm:text-[30px]
//                       sm:leading-[40px]
//                       md:text-[32px]
//                       md:leading-[42px]
//                     "
//                   >
//                     For other Classes (XI and XII) from June
//                   </h3>

//                   <RuleList items={higherClassRules} />

//                 </div>

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
//                           transition-all
//                           duration-300
//                           group-hover:bg-[#e71b93]
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

// export default AdmissionProcedure;
