import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
//@ts-ignore

const db = drizzle(sql , { schema });

const main = async () => {
   try {
      console.log("Seeding the database");

      await db.delete(schema.courses);
      await db.delete(schema.userProgress);
      await db.delete(schema.units);
      await db.delete(schema.lessons);
      await db.delete(schema.challenges);
      await db.delete(schema.challengeOptions);
      await db.delete(schema.challengeProgress);

      await db.insert(schema.courses).values([
        {
          id: 1,
          title: "Spanish",
          imageSrc: "/es.svg",
        },
        {
            id: 2,
            title: "Italian",
            imageSrc: "/it.svg",
        },
        {
            id: 3,
            title: "French",
            imageSrc: "/fr.svg",
        },
        {
            id: 4,
            title: "Croatian",
            imageSrc: "/hr.svg",
        },
        
      ])

      await db.insert(schema.units).values([
        {
          id: 1,
          courseId: 1,
          title: "Unit 1",
          description: "Learn the basics of Spanish",
          order: 1,
        }
      ])

      await db.insert(schema.lessons).values([
        {
          id: 1,
          unitId: 1, // Unit 1 learn the basics...
          title: "Nouns",
          order: 1,
        },
        {
          id: 2,
          unitId: 1, // Unit 1 learn the basics...
          title: "Verbs",
          order: 1,
        },
        {
          id: 3,
          unitId: 1, // Unit 1 learn the basics...
          title: "Nouns",
          order: 3,
        },
        {
          id: 4,
          unitId: 1, // Unit 1 learn the basics...
          title: "Nouns",
          order: 4,
        },
        {
          id: 5,
          unitId: 1, // Unit 1 learn the basics...
          title: "Nouns",
          order: 5,
        },
      ])

      await db.insert(schema.challenges).values([
        {
          id: 1,
          lessonId: 1, //Nouns
          type: "SELECT",
          question: 'Which one of these is "the man"?',
          order: 1,
        },
      ])

      await db.insert(schema.challengeOptions).values([
        {
          id: 1,
          challengeId: 1,
          imageSrc: "/man.svg",
          text: "el hombre",
          audioSrc: "/es_man.mp3",
          correct: true,
        },
        {
          id: 2,
          challengeId: 1,
          imageSrc: "/woman.svg",
          text: "la mujer",
          audioSrc: "/es_woman.mp3",
          correct: false,
        },
        {
          id: 3,
          challengeId: 1,
          imageSrc: "/robot.svg",
          text: "el robot",
          audioSrc: "/es_robot.mp3",
          correct: false,
        },
      ])

      console.log("Seeding finished"); 
   } catch (error) {
       console.error(error);
       throw new Error("Failed to seed the database");
   }
}

main();