import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LightbulbIcon, Volume2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

function QuestionsSection({
  mockInterviewQuestion = [],
  activeQuestionIndex,
  setActiveQuestionIndex,
  interviewData,
}) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser doesn't support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-center">
          {mockInterviewQuestion.map((question, index) => (
            <p
              key={index}
              className={`p-2 bg-secondary rounded-full text-sm cursor-pointer ${
                activeQuestionIndex === index && "bg-violet-600 text-white"
              }`}
            >
              Question {index + 1}
            </p>
          ))}
        </div>
        <h2 className="mt-8 text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
          <Volume2Icon
            onClick={() =>
              textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
            }
            className="h-4 w-4 cursor-pointer inline-block ml-2 align-text-center text-violet-600"
          />
        </h2>

        <div className="border rounded-lg p-4 mt-10 bg-violet-50">
          <p className="flex gap-2 items-center text-sm text-violet-600 my-2">
            Tip: Use a Clear Structure. Begin with your professional background,
            highlight key achievements, and explain why you're excited about
            this role.
          </p>
        </div>
        <Separator className="mt-8" />
        <div className="flex justify-end gap-x-6 mt-6">
          {activeQuestionIndex > 0 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            >
              Previous Question
            </Button>
          )}
          {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            >
              Next Question
            </Button>
          )}
          {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
            <Link
              href={`/dashboard/interview/${interviewData.mockId}/feedback`}
            >
              <Button>End Interview</Button>
            </Link>
          )}
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
