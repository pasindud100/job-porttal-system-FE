import React from "react";
import { Search as SearchIcon } from "@mui/icons-material";

const HeroSection = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mt-3">
        Search, Apply & <br />
        Get Your Dream Job & Training
      </h1>

      <div className="flex justify-center mt-4">
        <div className="flex items-center bg-white shadow-lg rounded-full max-w-md w-full p-2">
          <div className="flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Find your dream jobs"
            className="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="ml-2 bg-purple-600 text-white rounded-full px-4 py-2 hover:bg-purple-700 transition">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
