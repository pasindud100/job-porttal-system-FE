import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../component/NavBar/Navbar";

const RegisteredStudents = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [usersByCourse, setUsersByCourse] = useState({});
  const [expandedCourses, setExpandedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursesAndUsers = async () => {
      if (!user?.id) {
        setError("Please log in to view your courses.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch courses for the logged-in user
        const coursesRes = await axios.get(`http://localhost:8080/api/courses/published-by/${user.id}`);
        const fetchedCourses = coursesRes.data;
        setCourses(fetchedCourses);

        const usersMap = {};

        // For each course, fetch enrolled user IDs and their details
        await Promise.all(
          fetchedCourses.map(async (course) => {
            try {
              // Fetch user IDs enrolled in this course
              const userIdsRes = await axios.get(
                `http://localhost:8080/api/enroll/course/${course.id}/users`
              );
              const userIds = userIdsRes.data;

              // Fetch user details for each user ID
              const userDetails = await Promise.all(
                userIds.map(async (userId) => {
                  try {
                    const userRes = await axios.get(
                      `http://localhost:8080/api/auth/user/${userId}`
                    );
                    return userRes.data; // UserDTO with name and email
                  } catch (err) {
                    console.error(`Failed to fetch user ${userId}:`, err);
                    return null;
                  }
                })
              );

              // Filter out any failed user fetches
              usersMap[course.id] = userDetails.filter((user) => user !== null);
            } catch (err) {
              console.error(`Failed to fetch users for course ${course.id}:`, err);
              usersMap[course.id] = [];
            }
          })
        );

        setUsersByCourse(usersMap);
      } catch (err) {
        console.error("Error fetching courses or users:", err);
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndUsers();
  }, [user]);

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Registered Users by Course</h1>

        {loading ? (
          <h2 className="text-xl text-center text-green-600">Loading courses and users...</h2>
        ) : error ? (
          <h2 className="text-xl text-center text-red-600">{error}</h2>
        ) : courses.length === 0 ? (
          <h2 className="text-xl text-center text-green-600">No courses found.</h2>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white shadow-lg rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg mb-2 cursor-pointer" onClick={() => toggleCourse(course.id)}>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-green-800 mr-2">{course.title}</h2>
                    <span className="text-green-600">({(usersByCourse[course.id] || []).length} Registered Users)</span>
                  </div>
                  <button onClick={() => toggleCourse(course.id)} className="focus:outline-none">
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 ${expandedCourses[course.id] ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l-3-3h6l-3 3zm0-6l3 3H9l3-3z" />
                    </svg>
                  </button>
                </div>

                {expandedCourses[course.id] && (
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-green-700">Registered Users</h3>
                    <div className="border-t border-green-300 mt-2">
                      {(usersByCourse[course.id] || []).length === 0 ? (
                        <p className="text-green-600">No users registered for this course.</p>
                      ) : (
                        <ul>
                          {(usersByCourse[course.id] || []).map((user, index) => (
                            <li key={user.id || index} className="border-b border-green-200 py-2">
                              <p className="text-md text-green-800">{user.name || "Unknown"}</p>
                              <p className="text-sm text-green-600">{user.email || "N/A"}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredStudents;
