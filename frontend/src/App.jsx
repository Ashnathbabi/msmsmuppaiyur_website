import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

// =====================================================
// Public Layout
// =====================================================

import MainLayout from "./component/Inc/MainLayout/MainLayout";

// =====================================================
// Home & About
// =====================================================

import Home from "./component/Pages/Home/Home";
import AboutInner from "./component/Pages/AboutInner/AboutInner";

// =====================================================
// Academics
// =====================================================

import Academics from "./component/Pages/Academics/Academic";
<Route
  path="/academics/:slug"
  element={<Academics />}
/>
// =====================================================
// Activities
// =====================================================

import Activities from "./component/Pages/Activities/Activities";

// =====================================================
// Facilities
// =====================================================

import Facilities from "./component/Pages/Facilities/Facilities";

// =====================================================
// Alumni
// =====================================================

import Alumni from "./component/Pages/Alumni/Alumini";

// =====================================================
// Gallery & Contact
// =====================================================

import GalleryInner from "./component/Pages/Gallery/Gallery";
import ContactUs from "./component/Pages/Contact/Contact";

// =====================================================
// Admin
// =====================================================

import AdminLogin from "../admin/pages/AdminLogin";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminLayout from "../admin/pages/AdminLayout";

import AdminContact from "../admin/components/AdminContact";
import GalleryAdmin from "../admin/components/AdminGallery";
import AlumniAdmin from "../admin/components/AdminAlumini";
import AdminActivities from "../admin/components/AdminActivitie";
import ActivityForm from "../admin/components/AdminActivityForm";
import ProtectedRoute from "../admin/ProtectedRoute";
import FacilityList from "../admin/components/FacilityList";
import AddFacility from "../admin/components/AddFacility";
import EditFacility from "../admin/components/EditFacility";
import AdminAcademics from "../admin/components/AdminAcademics";
import AdminAbout from "../admin/components/AdminAbout";
import AdminHomeAbout from "../admin/components/AdminHomeAbout";
import AdminActivity from "../admin/components/AdminActivity";
import WhyChooseAdmin from "../admin/components/AdminWhyChoose";
import AdminHowToApply from "../admin/components/AdminHowToApply";
import AdminGalleryHome from "../admin/components/AdminGalleryHome";
import AdminManagement from "../admin/components/AdminManagement";
import NewsEventList from "../admin/components/NewsEventList";
import AddNewsEvent from "../admin/components/AddNewsEvent";
import EditNewsEvent from "../admin/components/EditNewsEvent";
import Footer from "../admin/components/AdminFooter";
import InnerFooterAdmin from "../admin/components/InnerFooterAdmin";
import HeroBannerAdmin from "../admin/components/HeroBannerAdmin";
import MarqueeAdmin from "../admin/components/MarqueeAdmin";
import HeaderAdmin from "../admin/components/HeaderAdmin";

// =====================================================
// App
// =====================================================

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
      mirror: true,
      offset: 100,
    });

    const handleRefresh = () => {
      AOS.refresh();
    };

    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);

    return () => {
      window.removeEventListener("load", handleRefresh);
      window.removeEventListener("resize", handleRefresh);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC WEBSITE
        ===================================================== */}

        <Route element={<MainLayout />}>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* About */}
          <Route path="/about" element={<AboutInner />} />

          {/* =================================================
              Academics
          ================================================= */}

          <Route path="/academics" element={<Academics />} />
            <Route
        path="/academics/:slug"
        element={<Academics />}
      />

          {/* =================================================
              Activities
          ================================================= */}

          {/* Activity listing */}
         {/* Activity listing */}
          <Route
            path="/activities"
            element={<Activities />}
          />
<Route
        path="/activities/:slug"
        element={<Activities />}
      />





         
          {/* =================================================
              Facilities
          ================================================= */}

          <Route
            path="/facilities"
            element={<Facilities />}
          />
          <Route path="/:slug" element={<Facilities />} />
         
          {/* =================================================
              Alumni
          ================================================= */}

          <Route
            path="/alumni"
            element={<Alumni />}
          />

          {/* =================================================
              Gallery
          ================================================= */}

          <Route
            path="/gallery"
            element={<GalleryInner />}
          />

          {/* =================================================
              Contact
          ================================================= */}

          <Route
            path="/contact"
            element={<ContactUs />}
          />

        </Route>

        {/* =====================================================
    ADMIN LOGIN
===================================================== */}

<Route
  path="/admin"
  element={<AdminLogin />}
/>

<Route
  path="/admin/login"
  element={<AdminLogin />}
/>


{/* =====================================================
    PROTECTED ADMIN PANEL
===================================================== */}

<Route element={<ProtectedRoute />}>
  <Route
    path="/admin"
    element={<AdminLayout />}
  >
    <Route
      path="dashboard"
      element={<AdminDashboard />}
    />

    <Route
      path="contact"
      element={<AdminContact />}
    />

    <Route
      path="gallery"
      element={<GalleryAdmin />}
    />

    <Route
      path="alumni"
      element={<AlumniAdmin />}
    />

    <Route
      path="activities"
      element={<AdminActivities />}
    />

    <Route
      path="new"
      element={<ActivityForm />}
    />

    <Route
      path="edit/:id"
      element={<ActivityForm />}
    />
    <Route
    path="/admin/facilities"
    element={<FacilityList />}
    />
    <Route
        path="/admin/facilities/add"
        element={<AddFacility />}
    />

    <Route
        path="/admin/facilities/edit/:id"
        element={<EditFacility />}
    />
    <Route
        path="/admin/academics"
        element={<AdminAcademics />}
    />
    <Route
        path="/admin/about-inner"
        element={<AdminAbout />}
    />
     <Route
        path="/admin/about-home"
        element={<AdminHomeAbout />}
    />
     <Route
        path="/admin/activity-home"
        element={<AdminActivity />}
    />
     <Route
        path="/admin/whychoose"
        element={<WhyChooseAdmin />}
    />
    <Route
    path="/admin/how-to-apply"
    element={<AdminHowToApply />}
/>
<Route
    path="/admin/gallery-home"
    element={<AdminGalleryHome />}
/>
    <Route
    path="/admin/management"
    element={<AdminManagement />}
/>
<Route
    path="/admin/news-events"
    element={<NewsEventList />}
/>

<Route
    path="/admin/news-events/add"
    element={<AddNewsEvent />}
/>

<Route
    path="/admin/news-events/edit/:id"
    element={<EditNewsEvent />}
/>
<Route
    path="/admin/footer"
    element={<Footer />}
/>
<Route
  path="/admin/inner-footer"
  element={<InnerFooterAdmin />}
/>
<Route
  path="/admin/hero-banner"
  element={<HeroBannerAdmin />}
/>
<Route
  path="/admin/marquee"
  element={<MarqueeAdmin />}
/>
<Route
  path="/admin/header"
  element={<HeaderAdmin />}
/>
  </Route>
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
