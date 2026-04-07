import mysql from "mysql2/promise";

const conn = await mysql.createConnection(
  "mysql://root:@localhost/elearning_platform"
);

try {
  await conn.query(
    "ALTER TABLE payments MODIFY COLUMN paymentMethod ENUM('mtn_mobile_money', 'airtel_money', 'equity_bank') NOT NULL"
  );
  console.log("Updated paymentMethod enum");
} catch (e: any) {
  console.log("Error:", e.message);
}

await conn.end();
console.log("Done!");
