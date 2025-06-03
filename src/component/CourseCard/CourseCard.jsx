import React from 'react';
import { useNavigate } from 'react-router-dom';

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Passing the course object as state to the CourseDetails page
    navigate('/coursedetails', { state: { course } });
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-4 m-2 w-72 h-52">
        <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
        <h3 className="text-xl text-gray-600">{course.category}</h3>
        <p className="text-lg text-gray-600">{course.duration}</p>
        <button
          className="mt-4 w-full bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition"
          onClick={handleClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
