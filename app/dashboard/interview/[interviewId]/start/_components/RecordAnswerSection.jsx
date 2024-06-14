"use client";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { toast } from "@/components/ui/use-toast";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState("");
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      const transcript = results.map((result) => result.transcript).join(" ");
      console.log("Transcript: ", transcript); // Debugging output
      setUserAnswer(transcript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex].question}. User Answer: ${userAnswer}. Depending on the question and user answer for the given interview question, please give a rating on a scale of 1-10 for the answer and give feedback for areas of improvement if any in 3-5 lines in JSON format with rating field and feedback field.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      console.log("Raw response:", responseText);

      const mockJsonResponse = responseText
        .replace("```json", "")
        .replace("```", "")
        .trim();
      console.log("Cleaned JSON response:", mockJsonResponse);

      const JsonFeedbackResponse = JSON.parse(mockJsonResponse);
      console.log("Parsed JSON response:", JsonFeedbackResponse);

      const dbResponse = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAnswer: userAnswer,
        feedback: JsonFeedbackResponse?.feedback,
        rating: JsonFeedbackResponse?.rating,
        userEmail: user.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });
      if (dbResponse) {
        toast("Your answer has been successfully recorded!");
      }
    } catch (err) {
      console.error("Failed to process response:", err);
      toast("Failed to record your answer. Please try again.");
      setResults([]);
    } finally {
      setUserAnswer("");
      setResults([]);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-secondary rounded-lg border h-full w-full">
          <Webcam mirrored={true} style={{ zIndex: 10, borderRadius: 8 }} />
        </div>
        <Button
          disabled={loading}
          variant="outline"
          className="mt-4"
          onClick={StartStopRecording}
        >
          {isRecording ? (
            <p className="text-red-600 flex items-center">
              <StopCircle className="h-4 w-4 mr-2" /> Stop Recording
            </p>
          ) : (
            <p className="flex items-center">
              <Mic className="h-4 w-4 mr-2" /> Record Answer
            </p>
          )}
        </Button>
      </div>
    </>
  );
}

export default RecordAnswerSection;
