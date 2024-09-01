import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper"
import { UserProgress } from "@/components/user-progress"
import { getUserProgress } from "@/db/queries"
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const ShopPage = async () => {
    const userProgress = await getUserProgress();

    if(!userProgress || !userProgress.activeCourseId) {
        redirect("/courses")
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={{
                        id: userProgress.activeCourseId,
                        title: userProgress.activeCourse?.title || "Unknown Course",
                        imageSrc: userProgress.activeCourse?.imageSrc || "/default-course-image.svg"
                    }}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                 />
                 <Promo />
                 <Quests points={userProgress.points} />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                  <Image 
                    src="/shop.svg"
                    alt="Shop"
                    width={90}
                    height={90}
                  />
                  <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                    Shop
                  </h1>
                  <p className="text-muted-foreground text-center text-lg mb-6">
                    Spend your points on cool stuff.
                  </p>
                  <Items 
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                  />
                </div>
            </FeedWrapper>
        </div>
    )
}

export default ShopPage