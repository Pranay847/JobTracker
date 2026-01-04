import express from 'express';

const router = express.Router();

let jobs = [];
let nextId = 1;

router.get('/', (req, res) => {
  const { status } = req.query;
  let filteredJobs = jobs;
  
  if (status && status !== 'all') {
    filteredJobs = jobs.filter(job => 
      job.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  res.json(filteredJobs);
});

router.post('/', (req, res) => {
  const { company, title, status, applicationDate, notes } = req.body;
  
  if (!company || !title || !status) {
    return res.status(400).json({ 
      error: 'Company, title, and status are required fields' 
    });
  }
  
  const validStatuses = ['applied', 'interviewing', 'rejected', 'offer'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ 
      error: 'Invalid status. Must be: Applied, Interviewing, Rejected, or Offer' 
    });
  }
  
  const newJob = {
    id: nextId++,
    company: company.trim(),
    title: title.trim(),
    status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    applicationDate: applicationDate || new Date().toISOString().split('T')[0],
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString()
  };
  
  jobs.push(newJob);
  res.status(201).json(newJob);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { company, title, status, applicationDate, notes } = req.body;
  
  const jobIndex = jobs.findIndex(job => job.id === parseInt(id));
  
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  if (!company || !title || !status) {
    return res.status(400).json({ 
      error: 'Company, title, and status are required fields' 
    });
  }
  
  const validStatuses = ['applied', 'interviewing', 'rejected', 'offer'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ 
      error: 'Invalid status. Must be: Applied, Interviewing, Rejected, or Offer' 
    });
  }
  
  const updatedJob = {
    ...jobs[jobIndex],
    company: company.trim(),
    title: title.trim(),
    status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    applicationDate: applicationDate || jobs[jobIndex].applicationDate,
    notes: notes ? notes.trim() : '',
    updatedAt: new Date().toISOString()
  };
  
  jobs[jobIndex] = updatedJob;
  res.json(updatedJob);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const jobIndex = jobs.findIndex(job => job.id === parseInt(id));
  
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const deletedJob = jobs.splice(jobIndex, 1)[0];
  res.json({ message: 'Job deleted successfully', job: deletedJob });
});

export const resetJobs = () => {
  jobs = [];
  nextId = 1;
};

export default router;
