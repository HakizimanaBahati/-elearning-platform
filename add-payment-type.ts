import mysql from "mysql2/promise";

const conn = await mysql.createConnection(
  "mysql://root:@localhost/elearning_platform"
);

try {
  await conn.query(
    "ALTER TABLE payments ADD paymentType ENUM('course', 'certificate') DEFAULT 'course'"
  );
  console.log("Added paymentType column");
} catch (e: any) {
  console.log("Error:", e.message);
}

await conn.end();
console.log("Done!");
