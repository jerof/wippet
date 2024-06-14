"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobExperience, setJobExperience] = useState("");
  const [jobSector, setJobSector] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonRepsonse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    /* Fetching jobExperience, jobRole and jobSector from the form */
    console.log(jobExperience, jobRole, jobSector);

    /* Create an InputPrompt to be sent to GeminiAI */
    const InputPrompt = `job role: ${jobRole}, job sector: ${jobSector}, years of experience: ${jobExperience}. Depending on this information, please give me 5 interview question and their answer fields in a JSON file format. each quesiton should have an answer. The output should be a JSON file`;

    try {
      /* InputPrompt sent to GeminiAI */
      const result = await chatSession.sendMessage(InputPrompt);

      /* Raw Response from GeminiAI stored in rawResponse */
      const rawResponse = await result.response.text();
      console.log("Raw Response: ", rawResponse);

      /* Clean the raw response */
      const cleanedResponse = rawResponse
        .replace("```json", "")
        .replace("```", "");
      console.log("Cleaned Response: ", cleanedResponse);

      /* Throw error if cleanedResponse is null */
      if (!cleanedResponse) {
        throw new Error("Cleaned response is empty or undefined");
      }

      /* Parse JSON String to a Javascript object at the client */
      const parsedResponse = JSON.parse(cleanedResponse);
      console.log("Parsed Response: ", parsedResponse);

      setJsonResponse(parsedResponse);

      /* Convert Javascript object to JSON string to be sent to db */
      const jsonString = JSON.stringify(parsedResponse);
      console.log("JSON string for database: ", jsonString);

      const dbResponse = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResponse: jsonString,
          jobRole: jobRole,
          jobSector: jobSector,
          jobExperience: jobExperience,
          createdBy: user.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted Id: ", dbResponse);

      if (dbResponse) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${dbResponse[0].mockId}`);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div
            className="border rounded-lg p-8 mt-4 hover:shadow-sm cursor-pointer transition-all w-[300px]"
            onClick={() => setOpenDialog(true)}
          >
            <h2 className="flex items-center justify-center text-primary font-semibold">
              Start New Interview
            </h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <DialogHeader className="mt-4">
              <DialogTitle className="text-2xl text-center mb-4">
                Tell us about yourself
              </DialogTitle>
              <DialogDescription>
                <div className="my-2">
                  <Label className="font-normal text-black">
                    How many years of experience do you have?
                  </Label>
                  <Input
                    className="mt-2"
                    placeholder="2"
                    type="number"
                    required
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <Label className="font-normal text-black">
                    Which sectors are you interested in?
                  </Label>
                  <Input
                    className="mt-2"
                    placeholder="Consulting, Social impact"
                    type="text"
                    required
                    onChange={(e) => setJobSector(e.target.value)}
                  />
                </div>
                <div className="my-2">
                  <Label className="font-normal text-black">
                    Which roles are you interested in?
                  </Label>
                  <Input
                    className="mt-2"
                    placeholder="Analyst, consultant"
                    type="text"
                    required
                    onChange={(e) => setJobRole(e.target.value)}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenDialog(false)}
              >
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Generating from AI..
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddNewInterview;
