const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| Ensure Footer Settings Row
|--------------------------------------------------------------------------
*/

const ensureFooterSettings = async () => {
  const sql = `
    INSERT INTO footer_settings (
      id,
      logo,
      description,
      phone,
      address,
      email,
      privacy_text,
      privacy_url,
      copyright_year,
      powered_by_text,
      powered_by_url,
      facebook_url,
      instagram_url,
      youtube_url
    )
    VALUES (
      1,
      '',
      'MSMHSS was founded in the year 2006 with a primary objective of "Giving education to the poor and socially less privileged"',
      '(+91) 9655407774',
      'Madurai-Thondi Highway, Muppaiyur',
      'msmsmuppaiyur@gmail.com',
      'PRIVATE POLICY',
      '#',
      '2026',
      'Bonifon',
      'https://www.bonifontechnologies.com',
      '',
      '',
      ''
    )
    ON DUPLICATE KEY UPDATE id = 1
  `;

  await db.query(sql);
};


/*
|--------------------------------------------------------------------------
| Delete Local Logo File
|--------------------------------------------------------------------------
*/

const deleteLogoFile = (logoPath) => {
  if (!logoPath) return;

  /*
    Only delete files inside our uploads/footer directory.
    This prevents accidentally deleting external files.
  */

  if (!logoPath.startsWith("/uploads/footer/")) {
    return;
  }

  const filename = path.basename(logoPath);

  const fullPath = path.join(
    process.cwd(),
    "uploads",
    "footer",
    filename
  );

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log("Old footer logo deleted:", fullPath);
    } catch (error) {
      console.error("Unable to delete old footer logo:", error);
    }
  }
};


/*
|--------------------------------------------------------------------------
| GET FOOTER
|--------------------------------------------------------------------------
*/

exports.getFooter = async (req, res) => {
  try {
    await ensureFooterSettings();

    const [settingsRows] = await db.query(`
      SELECT *
      FROM footer_settings
      WHERE id = 1
      LIMIT 1
    `);

    const [quickLinks] = await db.query(`
      SELECT *
      FROM footer_quick_links
      ORDER BY sort_order ASC, id ASC
    `);

    const [academicLinks] = await db.query(`
      SELECT *
      FROM footer_academic_links
      ORDER BY sort_order ASC, id ASC
    `);

    res.json({
      success: true,
      settings: settingsRows[0] || null,
      quickLinks,
      academicLinks
    });

  } catch (error) {
    console.error("Get footer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch footer",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE FOOTER SETTINGS
|--------------------------------------------------------------------------
*/

exports.updateSettings = async (req, res) => {
  try {
    await ensureFooterSettings();

    const {
      description = "",
      phone = "",
      address = "",
      email = "",

      privacy_text = "PRIVATE POLICY",
      privacy_url = "#",

      copyright_year = "2026",

      powered_by_text = "Bonifon",
      powered_by_url = "https://www.bonifontechnologies.com",

      facebook_url = "",
      instagram_url = "",
      youtube_url = ""
    } = req.body;

    const sql = `
      UPDATE footer_settings
      SET
        description = ?,
        phone = ?,
        address = ?,
        email = ?,
        privacy_text = ?,
        privacy_url = ?,
        copyright_year = ?,
        powered_by_text = ?,
        powered_by_url = ?,
        facebook_url = ?,
        instagram_url = ?,
        youtube_url = ?
      WHERE id = 1
    `;

    await db.query(sql, [
      description,
      phone,
      address,
      email,

      privacy_text,
      privacy_url,

      copyright_year,

      powered_by_text,
      powered_by_url,

      facebook_url,
      instagram_url,
      youtube_url
    ]);

    res.json({
      success: true,
      message: "Footer settings updated successfully"
    });

  } catch (error) {
    console.error("Update footer settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update footer settings",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPLOAD FOOTER LOGO
|--------------------------------------------------------------------------
*/

exports.uploadLogo = async (req, res) => {
  try {
    await ensureFooterSettings();

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a logo image"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get Existing Logo
    |--------------------------------------------------------------------------
    */

    const [rows] = await db.query(`
      SELECT logo
      FROM footer_settings
      WHERE id = 1
      LIMIT 1
    `);

    const oldLogo = rows[0]?.logo || "";

    /*
    |--------------------------------------------------------------------------
    | New Logo Path
    |--------------------------------------------------------------------------
    */

    const newLogo = `/uploads/footer/${req.file.filename}`;

    /*
    |--------------------------------------------------------------------------
    | Update Database
    |--------------------------------------------------------------------------
    */

    await db.query(
      `
        UPDATE footer_settings
        SET logo = ?
        WHERE id = 1
      `,
      [newLogo]
    );

    /*
    |--------------------------------------------------------------------------
    | Delete Old Logo
    |--------------------------------------------------------------------------
    */

    if (oldLogo && oldLogo !== newLogo) {
      deleteLogoFile(oldLogo);
    }

    res.json({
      success: true,
      message: "Footer logo uploaded successfully",
      logo: newLogo
    });

  } catch (error) {
    console.error("Upload footer logo error:", error);

    /*
    If database update fails, delete newly uploaded file.
    */

    if (req.file) {
      const uploadedFile = path.join(
        process.cwd(),
        "uploads",
        "footer",
        req.file.filename
      );

      if (fs.existsSync(uploadedFile)) {
        try {
          fs.unlinkSync(uploadedFile);
        } catch (deleteError) {
          console.error(deleteError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload footer logo",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE FOOTER LOGO
|--------------------------------------------------------------------------
*/

exports.deleteLogo = async (req, res) => {
  try {
    await ensureFooterSettings();

    const [rows] = await db.query(`
      SELECT logo
      FROM footer_settings
      WHERE id = 1
      LIMIT 1
    `);

    const oldLogo = rows[0]?.logo || "";

    if (oldLogo) {
      deleteLogoFile(oldLogo);
    }

    await db.query(`
      UPDATE footer_settings
      SET logo = ''
      WHERE id = 1
    `);

    res.json({
      success: true,
      message: "Footer logo deleted successfully"
    });

  } catch (error) {
    console.error("Delete footer logo error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete footer logo",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADD QUICK LINK
|--------------------------------------------------------------------------
*/

exports.addQuickLink = async (req, res) => {
  try {
    const {
      name,
      href,
      sort_order = 0,
      status = 1
    } = req.body;

    if (!name || !href) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required"
      });
    }

    await db.query(
      `
        INSERT INTO footer_quick_links
        (
          name,
          href,
          sort_order,
          status
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        name.trim(),
        href.trim(),
        Number(sort_order),
        Number(status)
      ]
    );

    res.json({
      success: true,
      message: "Quick link added successfully"
    });

  } catch (error) {
    console.error("Add quick link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add quick link",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE QUICK LINK
|--------------------------------------------------------------------------
*/

exports.updateQuickLink = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      href,
      sort_order = 0,
      status = 1
    } = req.body;

    if (!name || !href) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required"
      });
    }

    await db.query(
      `
        UPDATE footer_quick_links
        SET
          name = ?,
          href = ?,
          sort_order = ?,
          status = ?
        WHERE id = ?
      `,
      [
        name.trim(),
        href.trim(),
        Number(sort_order),
        Number(status),
        Number(id)
      ]
    );

    res.json({
      success: true,
      message: "Quick link updated successfully"
    });

  } catch (error) {
    console.error("Update quick link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quick link",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE QUICK LINK
|--------------------------------------------------------------------------
*/

exports.deleteQuickLink = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
        DELETE FROM footer_quick_links
        WHERE id = ?
      `,
      [Number(id)]
    );

    res.json({
      success: true,
      message: "Quick link deleted successfully"
    });

  } catch (error) {
    console.error("Delete quick link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete quick link",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| REORDER QUICK LINKS
|--------------------------------------------------------------------------
*/

exports.reorderQuickLinks = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reorder data"
      });
    }

    await connection.beginTransaction();

    for (let index = 0; index < items.length; index++) {
      await connection.query(
        `
          UPDATE footer_quick_links
          SET sort_order = ?
          WHERE id = ?
        `,
        [
          index + 1,
          Number(items[index].id)
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Quick links reordered successfully"
    });

  } catch (error) {
    await connection.rollback();

    console.error("Reorder quick links error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reorder quick links",
      error: error.message
    });

  } finally {
    connection.release();
  }
};


/*
|--------------------------------------------------------------------------
| ADD ACADEMIC LINK
|--------------------------------------------------------------------------
*/

exports.addAcademicLink = async (req, res) => {
  try {
    const {
      name,
      href,
      sort_order = 0,
      status = 1
    } = req.body;

    if (!name || !href) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required"
      });
    }

    await db.query(
      `
        INSERT INTO footer_academic_links
        (
          name,
          href,
          sort_order,
          status
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        name.trim(),
        href.trim(),
        Number(sort_order),
        Number(status)
      ]
    );

    res.json({
      success: true,
      message: "Academic link added successfully"
    });

  } catch (error) {
    console.error("Add academic link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add academic link",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE ACADEMIC LINK
|--------------------------------------------------------------------------
*/

exports.updateAcademicLink = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      href,
      sort_order = 0,
      status = 1
    } = req.body;

    if (!name || !href) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required"
      });
    }

    await db.query(
      `
        UPDATE footer_academic_links
        SET
          name = ?,
          href = ?,
          sort_order = ?,
          status = ?
        WHERE id = ?
      `,
      [
        name.trim(),
        href.trim(),
        Number(sort_order),
        Number(status),
        Number(id)
      ]
    );

    res.json({
      success: true,
      message: "Academic link updated successfully"
    });

  } catch (error) {
    console.error("Update academic link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update academic link",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE ACADEMIC LINK
|--------------------------------------------------------------------------
*/

exports.deleteAcademicLink = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
        DELETE FROM footer_academic_links
        WHERE id = ?
      `,
      [Number(id)]
    );

    res.json({
      success: true,
      message: "Academic link deleted successfully"
    });

  } catch (error) {
    console.error("Delete academic link error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete academic link",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| REORDER ACADEMIC LINKS
|--------------------------------------------------------------------------
*/

exports.reorderAcademicLinks = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reorder data"
      });
    }

    await connection.beginTransaction();

    for (let index = 0; index < items.length; index++) {
      await connection.query(
        `
          UPDATE footer_academic_links
          SET sort_order = ?
          WHERE id = ?
        `,
        [
          index + 1,
          Number(items[index].id)
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Academic links reordered successfully"
    });

  } catch (error) {
    await connection.rollback();

    console.error("Reorder academic links error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reorder academic links",
      error: error.message
    });

  } finally {
    connection.release();
  }
};