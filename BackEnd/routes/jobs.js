import express from 'express';
import db from '../database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs for the authenticated user
router.get('/', verifyToken, (req, res) => {
  const { status } = req.query;
  const userId = req.userId;

  let query = 'SELECT * FROM jobs WHERE userId = ?';
  const params = [userId];

  if (status && status !== 'all') {
    query += ' AND LOWER(status) = LOWER(?)';
    params.push(status);
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, jobs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(jobs || []);
  });
});

// Create a new job
router.post('/', verifyToken, (req, res) => {
  const { company, title, status, applicationDate, notes } = req.body;
  const userId = req.userId;

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

  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const appDate = applicationDate || new Date().toISOString().split('T')[0];

  db.run(
    'INSERT INTO jobs (userId, company, title, status, applicationDate, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, company.trim(), title.trim(), formattedStatus, appDate, notes ? notes.trim() : ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const newJob = {
        id: this.lastID,
        userId,
        company: company.trim(),
        title: title.trim(),
        status: formattedStatus,
        applicationDate: appDate,
        notes: notes ? notes.trim() : '',
        createdAt: new Date().toISOString()
      };

      res.status(201).json(newJob);
    }
  );
});

// Update a job
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { company, title, status, applicationDate, notes } = req.body;
  const userId = req.userId;

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

  // Check if job exists and belongs to user
  db.get('SELECT id FROM jobs WHERE id = ? AND userId = ?', [id, userId], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    db.run(
      'UPDATE jobs SET company = ?, title = ?, status = ?, applicationDate = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [company.trim(), title.trim(), formattedStatus, applicationDate, notes ? notes.trim() : '', id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.get('SELECT * FROM jobs WHERE id = ?', [id], (err, updatedJob) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json(updatedJob);
        });
      }
    );
  });
});

// Delete a job
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Check if job exists and belongs to user
  db.get('SELECT id FROM jobs WHERE id = ? AND userId = ?', [id, userId], (err, job) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    db.run('DELETE FROM jobs WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Job deleted successfully', id });
    });
  });
});

export const resetJobs = () => {
  jobs = [];
  nextId = 1;
};

export default router;
