const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// API TEST
// =====================================================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// =====================================================
// ADMIN
// =====================================================

const adminRoutes = require("./routes/adminRoutes");

app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// GALLERY
// =====================================================

const galleryRoutes = require("./routes/galleryRoutes");

app.use(
  "/api",
  galleryRoutes
);

// =====================================================
// ALUMNI
// =====================================================

const alumniRoutes = require("./routes/alumniRoutes");

app.use(
  "/api/alumni",
  alumniRoutes
);

// =====================================================
// ACTIVITIES
// =====================================================

const activityRoutes = require("./routes/activityRoutes");

app.use(
  "/api/activities",
  activityRoutes
);

// =====================================================
// FACILITIES
// =====================================================

const facilitiesRoutes = require("./routes/facilitiesRoutes");

app.use(
  "/api/facilities",
  facilitiesRoutes
);

// =====================================================
// ACADEMICS
// =====================================================

const academicRoutes = require("./routes/academicRoutes");

app.use(
  "/api/academics",
  academicRoutes
);

// =====================================================
// ABOUT
// =====================================================

const aboutRoutes = require("./routes/aboutRoutes");

app.use(
  "/api/about",
  aboutRoutes
);

// =====================================================
// ABOUT HOME
// =====================================================

const aboutHomeRoutes = require("./routes/aboutHomeRoutes");

app.use(
  "/api/about-home",
  aboutHomeRoutes
);

// =====================================================
// ACTIVITY HOME
// =====================================================

const activityHomeRoutes = require("./routes/activityHomeRoutes");

app.use(
  "/api/activities-home",
  activityHomeRoutes
);

// =====================================================
// WHY CHOOSE
// =====================================================

const whyChooseRoutes = require("./routes/whyChooseRoutes");

app.use(
  "/api/why-choose",
  whyChooseRoutes
);

// =====================================================
// HOW TO APPLY
// =====================================================

const howToApplyRoutes = require("./routes/howToApplyRoutes");

app.use(
  "/api/how-to-apply",
  howToApplyRoutes
);

// =====================================================
// GALLERY HOME
// =====================================================

const galleryHomeRoutes = require("./routes/galleryHomeRoutes");

app.use(
  "/api/gallery-home",
  galleryHomeRoutes
);

// =====================================================
// MANAGEMENT
// =====================================================

const managementRoutes = require("./routes/managementRoutes");

app.use(
  "/api/management",
  managementRoutes
);

// =====================================================
// NEWS & EVENTS
// =====================================================

const newsEventRoutes = require("./routes/newsEventRoutes");

app.use(
  "/api/news-events",
  newsEventRoutes
);

// =====================================================
// FOOTER
// =====================================================

const footerRoutes = require("./routes/footerRoutes");

app.use(
  "/api/footer",
  footerRoutes
);

// =====================================================
// INNER FOOTER
// =====================================================

const innerFooterRoutes = require("./routes/innerFooterRoutes");

app.use(
  "/api/inner-footer",
  innerFooterRoutes
);

// =====================================================
// HERO
// =====================================================

const heroRoutes = require("./routes/heroRoutes");

app.use(
  "/api/hero",
  heroRoutes
);

// =====================================================
// MARQUEE
// =====================================================

const marqueeRoutes = require("./routes/marqueeRoutes");

app.use(
  "/api/marquee",
  marqueeRoutes
);

// =====================================================
// HEADER
// =====================================================

const headerRoutes = require("./routes/headerRoutes");

app.use(
  "/api/header",
  headerRoutes
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Global server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    `Uploads available at: http://localhost:${PORT}/uploads`
  );
});