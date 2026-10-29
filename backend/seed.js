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
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Configure it in your local backend/.env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Do not create an admin account with a hardcoded public password.
    // Create/promote an administrator through a separate secure setup process.
    let mentor = await User.findOne({ email: "mentor@campus.edu" });
    if (!mentor) {
      console.warn(
        "No mentor@campus.edu account exists. Create an administrator using a secure, private setup process before seeding skills."
      );
      process.exitCode = 1;
      return;
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
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

seed();
