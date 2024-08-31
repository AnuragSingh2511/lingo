import { getLesson, getUserProgress } from "@/db/queries";
import ClientPage from "./ClientPage";

type Props = {
    params: {
        lessonId: string
    }
}

const LessonIdPage = async ({ params }: Props) => {
    const lessonId = parseInt(params.lessonId, 10);

    if (isNaN(lessonId)) {
        return <div>Invalid lesson ID</div>;
    }

    try {
        const [lesson, userProgress] = await Promise.all([
            getLesson(lessonId),
            getUserProgress()
        ]);

        if (!lesson || !userProgress) {
            return <div>Lesson or user progress not found</div>;
        }

        return <ClientPage lesson={lesson} userProgress={userProgress} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        return <div>Error loading lesson</div>;
    }
};

export default LessonIdPage;