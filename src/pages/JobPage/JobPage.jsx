import React, { useEffect, useState } from "react";
import JobCard from "../../component/JobCard/JobCard";
import axios from "axios";
import Navbar from "../../component/NavBar/Navbar";
import CustomPagination from "../../component/Pagination/CustomPagination";
import SuggetionCarousel from "../../component/SuggetionCarousel/SuggetionCarousel";

const JobPage = () => {
  const jobsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [minSalaryFilter, setMinSalaryFilter] = useState("");
  const [maxSalaryFilter, setMaxSalaryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLocationChange = (event) => setLocationFilter(event.target.value);
  const handleIndustryChange = (event) => setIndustryFilter(event.target.value);
  const handleMinSalaryChange = (event) => setMinSalaryFilter(event.target.value);
  const handleMaxSalaryChange = (event) => setMaxSalaryFilter(event.target.value);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/jobs/all", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("iap-final-token"),
          },
        });
        setAllJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = allJobs;

    const minSalary = minSalaryFilter ? Number(minSalaryFilter) : null;
    const maxSalary = maxSalaryFilter ? Number(maxSalaryFilter) : null;

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (industryFilter) {
      filtered = filtered.filter((job) => job.industry === industryFilter);
    }

    if (minSalary !== null) {
      filtered = filtered.filter((job) => Number(job.salary) >= minSalary);
    }

    if (maxSalary !== null) {
      filtered = filtered.filter((job) => Number(job.salary) <= maxSalary);
    }

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [
    locationFilter,
    industryFilter,
    minSalaryFilter,
    maxSalaryFilter,
    searchTerm,
    allJobs,
  ]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const displayedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-4 p-6 max-w-7xl mx-auto">
        {/* Location Filter */}
        <div className="w-full sm:w-72">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location"
            value={locationFilter}
            onChange={handleLocationChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
          >
            <option value="">All Locations</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Los Angeles">Los Angeles</option>
          </select>
        </div>

        {/* Industry Filter */}
        <div className="w-full sm:w-72">
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <select
            id="industry"
            value={industryFilter}
            onChange={handleIndustryChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
          >
            <option value="">All Industries</option>
            <option value="IT">IT</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Min Salary Filter */}
        <div className="w-full sm:w-72">
          <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Min Salary
          </label>
          <input
            id="minSalary"
            type="number"
            value={minSalaryFilter}
            onChange={handleMinSalaryChange}
            placeholder="Enter min salary"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 sm:text-sm"
          />
        </div>

        {/* Max Salary Filter */}
        <div className="w-full sm:w-72">
          <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Max Salary
          </label>
          <input
            id="maxSalary"
            type="number"
            value={maxSalaryFilter}
            onChange={handleMaxSalaryChange}
            placeholder="Enter max salary"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 sm:text-sm"
          />
        </div>
      </div>

      {/* Job Title Search */}
      <div className="max-w-7xl mx-auto p-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search by Job Title
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a job title"
          className="block w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 sm:text-sm"
        />
      </div>

      <SuggetionCarousel />

      {/* Job Cards */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg font-semibold py-12">
            No jobs available
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto p-6 flex justify-center">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default JobPage;

