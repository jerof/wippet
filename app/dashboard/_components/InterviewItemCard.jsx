import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function InterviewItemCard({ interview }) {
  return (
    <div className="border shadow-sm rounded-lg p-4">
      <h4 className="font-semibold text-primary">{interview?.jobRole}</h4>
      <p className="text-sm">{interview?.jobExperience} years of experience</p>
      <p className="text-muted-foreground text-xs">
        Created at: {interview.createdAt}
      </p>
      <div className="flex justify-end mt-4 gap-x-2">
        <Link href={`/dashboard/interview/${interview?.mockId}/feedback`}>
          <Button size="sm" variant="outline" className="w-full">
            Feedback
          </Button>
        </Link>
        <Link href={`dashboard/interview/${interview?.mockId}/start`}>
          <Button size="sm" className="w-full">
            Retry
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewItemCard;
