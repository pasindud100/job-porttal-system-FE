import React from 'react';
import { useNavigate } from 'react-router-dom';

function JobCard({ job }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Passing the job object as state to the JobDetails page
    navigate('/jobdetails', { state: { job } });
  };

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 m-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
        <p className="text-gray-600 text-md">{job.location}</p>
        <p className="text-gray-600 text-md font-bold">{job.salary}</p>
        <button
          onClick={handleClick}
          className="mt-4 w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default JobCard;
