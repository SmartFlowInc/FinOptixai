import React from "react";
import FeedbackSystem from "@/components/continuous-improvement/FeedbackSystem";

const ContinuousImprovement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Continuous Improvement</h1>
          <p className="text-neutral-600">
            Track feedback, measure process improvements, and drive adaptive learning
          </p>
        </div>
      </div>

      <FeedbackSystem />
    </div>
  );
};

export default ContinuousImprovement;