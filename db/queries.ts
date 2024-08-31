import { act, cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq,desc } from "drizzle-orm";
import { userProgress, courses, units, challengeProgress, lessons } from "./schema";

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
            activeCourse: {
                id: courses.id,
                title: courses.title,
                imageSrc: courses.imageSrc,
            },
        })
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .leftJoin(courses, eq(userProgress.activeCourseId, courses.id))
        .limit(1);

    return data[0];
});

export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeCourseId){
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                    with: {
                        challengeProgress: {
                            where: eq(
                                challengeProgress.userId, 
                                userId
                            ),
                        },
                    },
                },
            },
        },
    },
})

const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
        if(
         lesson.challenges.length === 0
        ){
         return { ...lesson, completed: false };
        }
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

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeCourseId){
        return null;
    } 

    const unitsActiveCourse = await db.query.units.findMany({
        orderBy: (units, {asc}) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, {asc}) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                    with: {
                        challengeProgress: {
                            where: eq(
                                challengeProgress.userId, 
                                userId
                            ),
                        },
                    },
                },
            },
        },
    },
    })

    const firstUncompletedLesson = unitsActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress || challenge.challengeProgress.length === 0 || challenge.challengeProgress.some((progress) => progress.completed = false);
        });
    })

    return{
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    }
})

export const getLesson = cache(async (id?: number) => {
  const {userId} = await auth();

  if(!userId){
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if(!lessonId){
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
        challenges: {
            orderBy: (challenges, {asc}) => [asc(challenges.order)],
            with: {
                challengeOptions: true,
                challengeProgress: {
                    where: eq(
                        challengeProgress.userId, 
                        userId
                    ),
                },
            },
        },
    },
  })

  if(!data || !data.challenges){
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed = challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
    // const completed = challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
    return { ...challenge, completed };
  })

  return { ...data, challenges: normalizedChallenges };
})

export const getLessonPercentage = cache(async (id?: number) => {
  const courseProgress = await getCourseProgress();

  if(!courseProgress?.activeLessonId){
    return 0;
  }

  const lesson = await getLesson(courseProgress?.activeLessonId);

  if(!lesson){
    return 0;
  }

  const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
);

return percentage;
})

export const getTopTenUsers = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const data = await db
        .select({
            userId: userProgress.userId,
            userName: userProgress.userName,
            userImageSrc: userProgress.userImageSrc,
            points: userProgress.points,
        })
        .from(userProgress)
        .orderBy(desc(userProgress.points))
        .limit(10);

    return data;
});