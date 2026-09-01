"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiMessageSquare, FiLoader } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Space {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
}

const Community = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDesc, setNewSpaceDesc] = useState("");

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/community/spaces`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpaces(response.data.spaces || []);
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async () => {
    if (!newSpaceName) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/community/spaces`,
        { name: newSpaceName, description: newSpaceDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSpaces([...spaces, response.data.space]);
      setNewSpaceName("");
      setNewSpaceDesc("");
    } catch (error) {
      console.error("Failed to create space:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Trading Community</h1>

        {/* Create Space */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiUsers /> Create Trading Space
          </h2>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              placeholder="Space name (e.g., 'Swing Trading Group')"
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <textarea
              value={newSpaceDesc}
              onChange={(e) => setNewSpaceDesc(e.target.value)}
              placeholder="Description"
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
            />
            <button
              onClick={handleCreateSpace}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Create Space
            </button>
          </div>
        </div>

        {/* Spaces List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <FiLoader className="text-3xl text-blue-400 animate-spin" />
            </div>
          ) : spaces.length > 0 ? (
            spaces.map((space) => (
              <div key={space.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer">
                <h3 className="text-xl font-bold mb-2">{space.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{space.description}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <FiMessageSquare /> View Discussions
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              No spaces yet. Create one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;