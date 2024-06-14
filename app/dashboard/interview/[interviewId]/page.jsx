"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { InfoIcon, LightbulbIcon, Video, VideoIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState("");
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    console.log(result);
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10 flex flex-col">
      <h1 className="font-semibold text-3xl tracking-tight">
        Let's get started
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-5">
        {/* Information section */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col p-5 rounded-lg border">
            <p className="text-muted-foreground">
              You're interviewing for {interviewData.jobRole} role in the{" "}
              {interviewData.jobSector} sector and you have{" "}
              {interviewData.jobExperience} years of work experience.
            </p>
          </div>
          <div className="flex flex-col p-5 rounded-lg border">
            <p className="text-muted-foreground">
              Use a Clear Structure: Begin with your professional background,
              highlight key achievements, and explain why you're excited about
              this role.
            </p>
          </div>
        </div>
        {/* Camera section */}
        <div>
          {webcamEnabled ? (
            <div>
              <Webcam
                style={{ height: 300, width: 400, borderRadius: 8 }}
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => setWebcamEnabled(false)}
                mirrored={true}
              />
            </div>
          ) : (
            <div className="bg-secondary rounded-lg border h-72 w-full">
              <Button
                className="mb-4 mx-auto mt-32 flex"
                variant="outline"
                onClick={() => setWebcamEnabled(true)}
              >
                <VideoIcon className="h-4 w-4 mr-2" /> Enable Camera and
                Microphone
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
