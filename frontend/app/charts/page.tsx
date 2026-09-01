"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiLoader } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const Charts = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyzeChart = async () => {
    if (!imageUrl) {
      setError("Please enter an image URL");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/charts/analyze`,
        { image_url: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AI Chart Analysis</h1>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiUpload /> Analyze Trading Chart
          </h2>
          
          <div className="space-y-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter chart image URL"
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            
            <button
              onClick={handleAnalyzeChart}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Chart with AI"
              )}
            </button>
          </div>

          {error && <div className="mt-4 bg-red-600/20 text-red-300 p-3 rounded">{error}</div>}
        </div>

        {analysis && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Confluences Detected</p>
                <p className="text-3xl font-bold text-blue-400">{analysis.confluences}</p>
              </div>
              
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Confidence Score</p>
                <p className="text-3xl font-bold text-green-400">{analysis.confidence}%</p>
              </div>
            </div>
            
            <div className="mt-4 bg-slate-700/50 rounded p-4">
              <p className="text-slate-400 text-sm mb-2">Recommendation</p>
              <p className="text-white">{analysis.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;