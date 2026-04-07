import mysql from "mysql2/promise";

const conn = await mysql.createConnection(
  "mysql://root:@localhost/elearning_platform"
);

try {
  await conn.query(`
    CREATE TABLE modules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      courseId INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description LONGTEXT,
      \`order\` INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Created modules table");
} catch (e: any) {
  console.log("modules:", e.message);
}

try {
  await conn.query("ALTER TABLE lessons ADD moduleId INT");
  console.log("Added moduleId column to lessons");
} catch (e: any) {
  if (e.code !== "ER_DUP_FIELDNAME") console.log("moduleId:", e.message);
}

await conn.end();
console.log("Done!");
