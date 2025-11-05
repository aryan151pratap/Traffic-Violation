import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function YoloAnalytics({analyticsData}) {
  const [model, setModel] = useState("model1");
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const data = analyticsData[model];
    const perClassArray = Object.entries(data.perClass).map(([name, value]) => ({
      name,
      mAP: (value * 100).toFixed(2),
    }));

    setAnalytics({
      classMetrics: perClassArray,
      precision: data.summary.precision,
      recall: data.summary.recall,
      f1: data.summary.f1,
      map50: data.summary.mAP50,
      map5095: data.summary.mAP50_95,
      name: data.name,
    });
  }, [model]);

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          {analytics.name} Validation Analytics
        </h2>
        <select
          className="border p-2 rounded-lg"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="model1">Model 1</option>
          <option value="model2">Model 2</option>
        </select>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricBox title="mAP@50" value={analytics.map50?.toFixed(3)} desc="Mean Average Precision at IoU 0.5" />
        <MetricBox title="mAP@50-95" value={analytics.map5095?.toFixed(3)} desc="Average mAP over IoU thresholds 0.5–0.95" />
        <MetricBox title="Precision" value={analytics.precision?.toFixed(3)} desc="Correct predictions ratio" />
        <MetricBox title="Recall" value={analytics.recall?.toFixed(3)} desc="Detected real objects ratio" />
        <MetricBox title="F1-Score" value={analytics.f1?.toFixed(3)} desc="Balance of precision and recall" />
      </div>

      {/* Per-Class mAP Bar Chart */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Per-Class mAP Scores</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={analytics.classMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="mAP" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Class Accuracy Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Per-Class Accuracy Overview</h3>
        <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2 text-left">Class Name</th>
              <th className="p-2 text-center">mAP (%)</th>
              <th className="p-2 text-center">Approx. Accuracy (%)</th>
            </tr>
          </thead>
          <tbody>
            {analytics.classMetrics?.map((cls, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2">{cls.name}</td>
                <td className="p-2 text-center">{cls.mAP}</td>
                <td className="p-2 text-center">
                  {(parseFloat(cls.mAP) * 0.95).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricBox({ title, value, desc }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-semibold text-gray-700">{value}</h3>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  );
}
