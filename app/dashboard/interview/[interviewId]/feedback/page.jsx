"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };

  return (
    <div>
      <h1 className="text-3xl tracking-tight font-semibold">
        Congratulations!
      </h1>
      <p className="text-lg">Here is your interview feedback</p>
      <p className="text-muted-foreground">
        Your overall interview rating is{" "}
        <span className="font-semibold text-black">7/10</span>.
      </p>
      <p className="text-sm text-muted-foreground">
        Your answer and feedback for improvement.
      </p>
      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible
            key={index}
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-2 mt-8 grid w-full mx-auto"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              {item.question}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-4 py-3 font-mono text-sm text-muted-foreground">
                Your answer: <br />
                {item.userAnswer}
              </div>
              <div
                className={`rounded-md border px-4 py-3 font-mono text-sm text-muted-foreground ${
                  item.rating < 7
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                Rating: {item.rating}/10 <br /> <br />
                Feedback: <br />
                {item.feedback}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

      <Button
        className="mt-20 cursor-pointer"
        onClick={() => router.replace("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}

export default Feedback;
