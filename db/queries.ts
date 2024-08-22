import { act, cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { userProgress, courses, units } from "./schema";

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db
        .select({
            userId: userProgress.userId,
            userName: userProgress.userName,
            userImageSrc: userProgress.userImageSrc,
            activeCourseId: userProgress.activeCourseId,
            hearts: userProgress.hearts,
            points: userProgress.points,
            // Include any fields from the courses table you need
        })
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .leftJoin(courses, eq(userProgress.activeCourseId, courses.id))
        .limit(1);

    return data[0];
});

export const getUnits = cache(async (courseId: number) => {
    const userProgress = await getUserProgress();

    if(!userProgress?.activeCourseId){
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                    with: {
                        challengeProgress: true,
                    },
                },
            },
        },
    },
})

const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
        const allCompletedChallenges = lesson.challenges.every((challenge) => 
        {
            return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
        })

        return { ...lesson, completed: allCompletedChallenges };
    })
    return { ...unit, lessons: lessonsWithCompletedStatus };
})

return normalizedData
})

export const getCourses = cache(async () => {
    const data = await db
        .select()
        .from(courses);

    return data;
});

export const getCourseById = cache(async (coursesId: number) => {
const data = await db.query.courses.findFirst({
    where: eq(courses.id, coursesId),
    //TODO:Populate units and lessons
})
return data;
})