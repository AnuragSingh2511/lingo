"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Quiz } from "../quiz";

type ChallengeOption = {
    id: number;
    text: string;
    correct: boolean;
    imageSrc: string | null;
    audioSrc: string | null;
    challengeId: number;
};

type Challenge = {
    id: number;
    lessonId: number;
    type: "SELECT" | "ASSIST";
    question: string;
    order: number;
    completed: boolean;
    challengeOptions: ChallengeOption[];
};

type Lesson = {
    id: number;
    title: string;
    unitId: number;
    order: number;
    challenges: Challenge[];
};

type UserProgress = {
    userId: string;
    userName: string;
    userImageSrc: string;
    activeCourseId: number | null;
    hearts: number;
    points: number;
};

type Props = {
    lesson: Lesson;
    userProgress: UserProgress;
};

const ClientPage = ({ lesson, userProgress }: Props) => {
    const router = useRouter();

    const initialPercentage = (lesson.challenges.filter(challenge => challenge.completed).length / lesson.challenges.length) * 100;

    return (
        <Quiz
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubscription={null}
        />
    );
};

export default ClientPage;