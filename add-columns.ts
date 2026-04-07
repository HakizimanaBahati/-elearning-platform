import mysql from "mysql2/promise";

const conn = await mysql.createConnection(
  "mysql://root:@localhost/elearning_platform"
);

try {
  await conn.query(
    "ALTER TABLE lessons ADD lessonType enum('video','document') DEFAULT 'video'"
  );
  console.log("Added lessonType column");
} catch (e: any) {
  if (e.code !== "ER_DUP_FIELDNAME") console.log("lessonType:", e.message);
}

try {
  await conn.query("ALTER TABLE lessons ADD content longtext");
  console.log("Added content column");
} catch (e: any) {
  if (e.code !== "ER_DUP_FIELDNAME") console.log("content:", e.message);
}

await conn.end();
console.log("Done!");
