// import React from "react";
// import { ArrowRight, ArrowUpRight } from "lucide-react";
// import { FaArrowUpRightFromSquare } from "react-icons/fa6";


// import logoSidebar from "../../../assets/academics/logo_sidebar.png";
// import ratingShadow from "../../../assets/academics/rating-shadow.png";

// const RulesOfParents = () => {
//   const rules = [
//     "We expect that all parents ensure to pay all fee in due time and during office hours (9.00 to 13.00).",

//     "You make sure that your students come regularly to school in full / neat uniform with required books and writing materials.",

//     "Parents should regularly check whether your children do their home works and sign the dairies.",

//     "Parents are to participate parents' meet regularly, sign the rank card, collect proper information about their children from the class teachers and make suggestions if they have.",

//     "Continuous absence of the parents for the parent's meet may cause the dismissal of the students.",

//     "Boys are to come to the school with their hair properly dressed, shirt ducked and shoes are tied properly and girls with their hair dressed of two plaits.",

//     "Do not send the students to school when they are suffering from fever, contagious and infectious disease like viral, dengue, vomiting and chicken and small pox.",

//     "Parents are to come in proper dress to school. No Bermudas and lunghis.",

//     "Parents are not allowed to meet their children during class hours. When an emergency occurs they have to seek the permission of the principal or correspondent.",

//     "Parents have to avoid direct involvement with the teachers and other students. No giving gifts and asking them to have special attention.",

//     "Do not allow the students to bring mobile phones, electronic, play items, and costly things like watch, ring and jewels. The management will not take responsibility if they lose anything of that kind.",

//     "We encourage parents to give leave letters before taking leave. When an emergency takes place send the leave letter when next they come to school.",

//     "Long leave without information or medical certificate may cause removal or dismissal from the school.",

//     "Late comers will not be allowed to enter into the campus. Frequent late arrivals will be fined or dismissed.",

//     "Any student who causes annoyances and disturbs other students for unnecessary reason will be also dismissed.",

//     "Students who tease the staff, office workers, ayyas and other students will be dismissed from the school.",

//     "Students who damage school materials, engage in immoral and filthy languages and activities will be dismissed immediately.",

//     "We encourage students to be disciplined, courteous and well mannered to study well and pursue good marks to set their future goal.",

//     "Encourage your students to make use of all the facilities and enjoy all chances given by the school especially those extra-curricular activities.",

//     "Legitimate complaints and proposals should reach the principal or correspondent in due time.",

//     "Parents are to be mindful of making unhealthy comments about the teachers and management. They are not to engage in arguments with anyone else about the school matters.",

//     "Any irregularity and abnormality found in the behaviour of the children, parents should immediately bring to the knowledge of the management.",

//     "Parents should encourage and fulfill all necessary things when their children are selected for sports and other academic events or competition. You are to send them in time and receive them with due attention.",

//     "Parents are requested not to react impulsively to any complaints and matters arising on their children, before clarifying the truth.",

//     "Only parents are allowed to sign the rank card of their children on that day, not allowed on any other days.",
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

//             {/* =================================================
//                 SERVICE CARD WRAPPER
//             ================================================= */}

//             <div className="relative isolate">

//               {/* =================================================
//                   BLACK BACKGROUND SHAPE
//                   IMPORTANT:
//                   This stays BEHIND the card.
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
//                   MAIN CARD
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
//                     TITLE
//                 ================================================= */}

//                 <div className="relative">

//                   <h2
//                     className="
//                       relative
//                       mb-[30px]
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
//                     Rules of Parents
//                   </h2>

//                   {/* =================================================
//                       RULES
//                   ================================================= */}

//                   <ul className="m-0 list-none space-y-[25px] p-0">

//                     {rules.map((rule, index) => (
//                       <li
//                         key={index}
//                         className="
//                           relative
//                           flex
//                           items-start
//                           pl-[35px]
//                           font-['Figtree',sans-serif]
//                           text-[16px]
//                           font-normal
//                           leading-[27px]
//                           text-[#666666]
//                           sm:text-[17px]
//                           sm:leading-[28px]
//                           md:text-[18px]
//                           md:leading-[30px]
//                         "
//                       >

//                         {/* ICON */}

//                         <span
//                           className="
//                             absolute
//                             left-0
//                             top-[2px]
//                             flex
//                             h-[24px]
//                             w-[24px]
//                             shrink-0
//                             items-center
//                             justify-center
//                             rounded-full
//                             text-white
//                           "
//                         >
//                           <FaArrowUpRightFromSquare
//                             size={14}
//                             strokeWidth={2.5}
//                             className="text-[#e71b93]"
//                           />
//                         </span>

//                         {/* TEXT */}

//                         <span className="block">
//                           {rule}
//                         </span>

//                       </li>
//                     ))}

//                   </ul>

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

//                 {/* SIDEBAR MENU */}

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

// export default RulesOfParents;
