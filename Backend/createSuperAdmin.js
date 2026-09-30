const bcrypt = require("bcryptjs");
const pool = require("./config/db");
require("dotenv").config();

const createSuperAdmin = async () => {
  try {
    const name = "Super Admin";
    const email = "admin@msmsmuppaiyur.com";
    const password = "pilankalai1985";

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("Generated hash:", hashedPassword);

    await pool.execute(
      `
      INSERT INTO admins
      (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        email,
        hashedPassword,
        "superadmin",
      ]
    );

    console.log("Super Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Create Super Admin Error:", error);
    process.exit(1);
  }
};

createSuperAdmin();
