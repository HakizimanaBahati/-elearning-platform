import mysql from "mysql2/promise";

const conn = await mysql.createConnection(
  "mysql://root:@localhost/elearning_platform"
);

try {
  await conn.query(
    "ALTER TABLE courses ADD certificatePrice DECIMAL(10,2) DEFAULT '0'"
  );
  console.log("Added certificatePrice column");
} catch (e: any) {
  console.log("certificatePrice:", e.message);
}

// Now create demo data
const [instructorResult] = (await conn.query(
  "SELECT id FROM users WHERE email = 'instructor@ehub.com'"
)) as any[];
const instructorId = instructorResult[0]?.id || 1;

const courses = [
  {
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    category: "Programming",
    level: "beginner",
    price: "15000",
    certificatePrice: "5000",
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
  },
  {
    title: "Advanced JavaScript Programming",
    description:
      "Master advanced JavaScript concepts including ES6+, async programming, and design patterns.",
    category: "Programming",
    level: "advanced",
    price: "25000",
    certificatePrice: "8000",
    thumbnail:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
  },
  {
    title: "Data Science with Python",
    description:
      "Learn data science fundamentals using Python, Pandas, NumPy, and visualization.",
    category: "Data Science",
    level: "intermediate",
    price: "30000",
    certificatePrice: "10000",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
  },
  {
    title: "Digital Marketing Masterclass",
    description:
      "Learn digital marketing strategies including SEO, social media marketing, and paid advertising.",
    category: "Marketing",
    level: "beginner",
    price: "20000",
    certificatePrice: "6000",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
  },
];

for (const course of courses) {
  try {
    const [result] = await conn.query(
      `INSERT INTO courses (instructorId, title, description, category, level, price, certificatePrice, requiresCertificate, thumbnail, isPublished) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, 1)`,
      [
        instructorId,
        course.title,
        course.description,
        course.category,
        course.level,
        course.price,
        course.certificatePrice,
        course.thumbnail,
      ]
    );
    console.log(`Created course: ${course.title}`);

    const courseId = (result as any).insertId;

    const modules = [
      {
        title: "Getting Started",
        description: "Introduction and setup",
        order: 1,
      },
      {
        title: "Core Concepts",
        description: "Main topics and fundamentals",
        order: 2,
      },
      {
        title: "Practical Exercises",
        description: "Hands-on practice",
        order: 3,
      },
      {
        title: "Final Project",
        description: "Apply what you learned",
        order: 4,
      },
    ];

    for (const mod of modules) {
      const [modResult] = await conn.query(
        `INSERT INTO modules (courseId, title, description, \`order\`) VALUES (?, ?, ?, ?)`,
        [courseId, mod.title, mod.description, mod.order]
      );
      const moduleId = (modResult as any).insertId;

      const lessons = [
        {
          title: `Introduction to ${mod.title}`,
          description: `Welcome to ${mod.title}`,
          lessonType: "video",
          videoUrl: "https://example.com/video1.mp4",
          duration: 15,
          order: 1,
        },
        {
          title: `${mod.title} Fundamentals`,
          description: `Deep dive into ${mod.title}`,
          lessonType: "document",
          content: "# " + mod.title + "\n\nThis is the content.",
          order: 2,
        },
        {
          title: `${mod.title} Practice`,
          description: `Practice ${mod.title}`,
          lessonType: "video",
          videoUrl: "https://example.com/video2.mp4",
          duration: 20,
          order: 3,
        },
      ];

      for (const les of lessons) {
        await conn.query(
          `INSERT INTO lessons (courseId, moduleId, title, description, lessonType, videoUrl, content, duration, \`order\`) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            courseId,
            moduleId,
            les.title,
            les.description,
            les.lessonType,
            les.videoUrl,
            les.content,
            les.duration,
            les.order,
          ]
        );
      }
    }
    console.log(`  ✓ Modules and lessons created`);
  } catch (e: any) {
    console.log(`Error with ${course.title}:`, e.message);
  }
}

console.log("\n✅ Demo courses created successfully!");
await conn.end();
