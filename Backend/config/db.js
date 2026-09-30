const mysql = require("mysql2/promise");
require("dotenv").config();


const db = mysql.createPool({

    host: process.env.DB_HOST,

    port: Number(process.env.DB_PORT),

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});


// Test Connection
(async () => {

    try {

        const connection = await db.getConnection();

        console.log("MySQL Connected Successfully");

        connection.release();


    } catch (error) {

        console.error(
            "Database Connection Failed"
        );

        console.error(error);

    }

})();



module.exports = db;