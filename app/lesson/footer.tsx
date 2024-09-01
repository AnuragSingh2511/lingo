import React from "react";
import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer: React.FC<Props> = ({
  onCheck,
  status,
  disabled,
  lessonId,
}) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");
  const router = useRouter();

  const handleButtonClick = () => {
    if (status === "completed") {
      router.push("/learn");
    } else {
      onCheck();
    }
  };

  const handlePracticeAgain = () => {
    window.location.reload();
  };

  return (
    <footer
      className={cn(
        "lg:h-[140px] h-[100px] border-t-2 fixed w-full bottom-0",
        status === "correct" && "bg-green-100 border-transparent",
        status === "wrong" && "bg-rose-100 border-transparent",
        status === "completed" && "bg-blue-100 border-transparent"
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Nicely done!
          </div>
        )}
        {status === "wrong" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Try again
          </div>
        )}
        {status === "completed" && (
          <div className="text-blue-500 font-bold text-base lg:text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Lesson completed!
          </div>
        )}
        <div className="flex items-center">
          {status === "completed" && (
            <Button
              variant="secondaryOutline"
              size={isMobile ? "sm" : "lg"}
              onClick={handlePracticeAgain}
              className="mr-4"
            >
              Practice again
            </Button>
          )}
          {status !== "completed" && (
            <Button
              disabled={disabled}
              onClick={handleButtonClick}
              size={isMobile ? "sm" : "lg"}
              variant={status === "wrong" ? "danger" : "primary"}
            >
              {status === "none" && "Check"}
              {status === "correct" && "Next"}
              {status === "wrong" && "Retry"}
            </Button>
          )}
          {status === "completed" && (
            <Button
              onClick={() => {
                router.replace("/learn");
              }}
              size={isMobile ? "sm" : "lg"}
              variant={"primary"}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};
