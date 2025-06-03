import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../component/NavBar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useJobs } from "../../context/JobsProvider";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Visibility, Delete } from "@mui/icons-material";

const steps = ["Job Details", "Requirements", "Publish"];

const VacancyPage = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDataModal, setOpenDataModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    companyId: "",
    location: "",
    description: "",
    skillsRequired: "",
    experienceRequired: "",
    industry: "",
    salary: "",
    active: true,
    publishDate: new Date().toISOString().split("T")[0],
  });
  const { jobs, setJobs } = useJobs();
  const [openModal, setOpenModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [companyIdwithname, setCompanyIdwithname] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/companies/user/${user.id}`
      );

      const companies =
        response.data?.map((company) => ({
          id: company.id,
          name: company.name,
        })) || [];

      setCompanyIdwithname(companies);
      const ids = companies.map((company) => company.id);
      fetchJobs(ids);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleViewJob = (jobId) => {
    if (!Array.isArray(jobs)) return; // safeguard check
    const job = jobs.find((job) => job.id === jobId);
    if (job) {
      setSelectedJob(job);
      setOpenDataModal(true);
    }
  };

  const fetchJobs = async (companyIds) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/jobs/companies",
        {
          params: { companyIds: companyIds.join(",") },
        }
      );
      // Ensure response data is an array
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.warn("Jobs API did not return an array:", response.data);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    try {
      if (editingJobId) {
        await axios.put(
          `http://localhost:8080/api/jobs/update/${editingJobId}`,
          jobData
        );
        alert("Job Updated Successfully!");
      } else {
        await axios.post("http://localhost:8080/api/jobs/create", jobData);
        alert("Job Created Successfully!");
      }

      setJobData({
        title: "",
        companyId: "",
        location: "",
        description: "",
        skillsRequired: "",
        experienceRequired: "",
        industry: "",
        salary: "",
        active: true,
        publishDate: new Date().toISOString().split("T")[0],
      });
      setActiveStep(0);
      setOpenModal(false);
      fetchCompanies();
    } catch (error) {
      console.error("Error creating/updating job:", error);
      alert("Failed to create/update job");
    }
  };

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:8080/api/jobs/delete/${jobId}`);
      alert("Job Deleted Successfully!");
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJobId(job.id);
      setJobData({
        ...job,
        publishDate: job.publishDate ? job.publishDate.split("T")[0] : new Date().toISOString().split("T")[0],
      });
      setActiveStep(0);
    } else {
      setEditingJobId(null);
      setJobData({
        title: "",
        companyId: "",
        location: "",
        description: "",
        skillsRequired: "",
        experienceRequired: "",
        industry: "",
        salary: "",
        active: true,
        publishDate: new Date().toISOString().split("T")[0],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ backgroundColor: "#e8f5e9", minHeight: "100vh", padding: 3 }}>
      <Navbar />
      <Box sx={{ width: "70%", margin: "auto", padding: 3, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 3, marginTop: 5 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ marginBottom: 2 }}
        >
          Create New Vacancy
        </Button>

        <Box sx={{ mt: 3 }}>
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <Box
                key={job.id}
                sx={{
                  border: "1px solid #a5d6a7",
                  padding: 2,
                  marginBottom: 2,
                  position: "relative",
                  borderRadius: 1,
                  boxShadow: 2,
                  backgroundColor: "#f1f8e9",
                }}
              >
                <IconButton
                  color="success"
                  onClick={() => handleViewJob(job.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    "&:hover": {
                      backgroundColor: "rgba(0, 128, 0, 0.1)",
                    },
                  }}
                >
                  <Visibility />
                </IconButton>

                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {job.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Location:</strong> {job.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Skills:</strong> {job.skillsRequired}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Salary:</strong> {job.salary}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => handleDelete(job.id)}
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleOpenModal(job)}
                    variant="contained"
                    color="success"
                    size="small"
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 4, textAlign: "center", color: "gray" }}>
              No job vacancies available.
            </Typography>
          )}
        </Box>

        {/* Job Details Dialog */}
        <Dialog
          open={openDataModal}
          onClose={() => setOpenDataModal(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedJob && (
            <>
              <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#a5d6a7", color: "#fff" }}>
                {selectedJob.title}
              </DialogTitle>
              <DialogContent dividers>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Company:</strong> {selectedJob.companyId}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Location:</strong> {selectedJob.location}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Description:</strong> {selectedJob.description}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Industry:</strong> {selectedJob.industry}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Salary:</strong> {selectedJob.salary}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Skills Required:</strong> {selectedJob.skillsRequired}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Experience Required:</strong>{" "}
                  {selectedJob.experienceRequired}
                </Typography>
                <Typography variant="body1">
                  <strong>Publish Date:</strong>{" "}
                  {new Date(selectedJob.publishDate).toLocaleDateString()}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenDataModal(false)}
                  variant="contained"
                  color="success"
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Create/Update Job Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              width: 450,
              margin: "auto",
              padding: 3,
              marginTop: 10,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              {editingJobId ? "Update Job" : "Create a Job"}
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 3 }}>
              {activeStep === 0 && (
                <>
                  <TextField
                    label="Job Title"
                    name="title"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={jobData.title}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="company-select-label">
                      Select Company
                    </InputLabel>
                    <Select
                      labelId="company-select-label"
                      name="companyId"
                      value={jobData.companyId}
                      onChange={handleChange}
                      label="Select Company"
                    >
                      {companyIdwithname.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Location"
                    name="location"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={jobData.location}
                  />
                </>
              )}
              {activeStep === 1 && (
                <>
                  <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    onChange={handleChange}
                    value={jobData.description}
                  />
                  <TextField
                    label="Skills Required"
                    name="skillsRequired"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={jobData.skillsRequired}
                  />
                  <TextField
                    label="Experience Required"
                    name="experienceRequired"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={jobData.experienceRequired}
                  />
                </>
              )}
              {activeStep === 2 && (
                <>
                  <TextField
                    label="Industry"
                    name="industry"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={jobData.industry}
                  />
                  <TextField
                    label="Salary"
                    name="salary"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={jobData.salary}
                  />
                </>
              )}
            </Box>

            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                color="success"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="success"
                >
                  {editingJobId ? "Update" : "Create"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="success"
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default VacancyPage;
