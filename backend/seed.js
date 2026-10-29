const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Skill = require("./models/Skill");

const seedSkills = [
  {
    title: "C++ Basics & Problem Solving",
    category: "Programming",
    mode: "Online",
    description: "I can help beginners understand C++ basics, pointers, and simple data structures.",
  },
  {
    title: "Poster & UI Design in Figma",
    category: "Design",
    mode: "Offline",
    description: "Learn Canva and basic Figma design for college events, presentations, and social media.",
  },
  {
    title: "Calculus & Engineering Math",
    category: "Academics",
    mode: "Online",
    description: "Need help with derivatives, differential equations, and integrals? Guided problem solving.",
  },
  {
    title: "Public Speaking & Presentation",
    category: "Communication",
    mode: "Offline",
    description: "Practice speeches, presentations, and group discussions with constructive peer feedback.",
  },
  {
    title: "Fullstack React & Node.js",
    category: "Web Development",
    mode: "Online",
    description: "Learn how to build responsive React web apps connected to Express and MongoDB backends.",
  },
  {
    title: "Campus Placement & Interview Prep",
    category: "Other",
    mode: "Both",
    description: "Resume reviews, mock technical and HR interviews, and tips for campus placement drives.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Check if mentor exists
    let mentor = await User.findOne({ email: "mentor@campus.edu" });
    if (!mentor) {
      mentor = await User.create({
        name: "Campus Mentor",
        email: "mentor@campus.edu",
        password: "Password123!",
        branch: "Computer Science",
        year: "4",
        experience: "3 years peer tutoring experience",
        role: "admin",
      });
      console.log("Created default mentor/admin account (mentor@campus.edu / Password123!)");
    }

    const existingSkillCount = await Skill.countDocuments();
    if (existingSkillCount === 0) {
      const skillsToInsert = seedSkills.map((s) => ({
        ...s,
        offeredBy: mentor._id,
      }));
      await Skill.insertMany(skillsToInsert);
      console.log(`Seeded ${skillsToInsert.length} skills into database.`);
    } else {
      console.log(`Database already has ${existingSkillCount} skills.`);
    }

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
