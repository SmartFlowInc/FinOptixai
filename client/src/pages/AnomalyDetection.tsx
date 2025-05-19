import React from "react";
import AnomalyDetectionComponent from "@/components/ai/AnomalyDetection";

const AnomalyDetection = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI Anomaly Detection</h1>
          <p className="text-neutral-600">
            Automatically detect unusual patterns and anomalies in your financial data
          </p>
        </div>
      </div>

      <AnomalyDetectionComponent />
    </div>
  );
};

export default AnomalyDetection;