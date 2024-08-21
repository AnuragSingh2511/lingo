import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getCourseById } from "@/db/queries";
import { redirect } from "next/navigation";

const LearnPage = async () => {
    const userProgressData = getUserProgress();
    const [userProgress] = await Promise.all([userProgressData]);

    if (!userProgress || !userProgress.activeCourseId) {
        redirect("/courses");
    }

    const activeCourse = await getCourseById(userProgress.activeCourseId);

    if (!activeCourse) {
        redirect("/courses");
    }

    return (
        <div className="h-screen flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={activeCourse.title} />
            </FeedWrapper>
        </div>
    )
}

export default LearnPage;