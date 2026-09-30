import { Outlet, useLocation } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import InnerFooter from "../InnerFooter/InnerFooter";
import ScrollToTop from "../ScrollTop/ScrollTop";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import StickyHeader from "../StickyHeader/StickyHeader";

function MainLayout() {

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // =========================================
  // PAGE TITLES
  // =========================================

  const pageTitles = {
    "/about": "About Us",
    "/academics": "Academics",
    "/activities": "Activities",
    "/facilities": "Facilities",
    "/contact": "Contact Us",
  };

  const pageTitle =
    pageTitles[location.pathname] || "Page";

  return (
    <div className="min-h-screen w-full">

      {/* =====================================
          SCROLL TOP
      ===================================== */}

      <ScrollToTop />
      <StickyHeader />


      {/* =====================================
          COMMON HEADER
          Home + Inner pages
      ===================================== */}

      <Header />


      {/* =====================================
          BREADCRUMB
          Inner pages only
      ===================================== */}

      {!isHomePage && (
        <Breadcrumb title={pageTitle} />
      )}


      {/* =====================================
          PAGE CONTENT
      ===================================== */}

      <main className="main-content">
        <Outlet />
      </main>


      {/* =====================================
          FOOTER
      ===================================== */}

      {isHomePage ? (
        <Footer />
      ) : (
        <InnerFooter />
      )}

    </div>
  );
}

export default MainLayout;
