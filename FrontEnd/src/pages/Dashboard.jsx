import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import JobForm from '../components/JobForm'
import JobList from '../components/JobList'
import StatusFilter from '../components/StatusFilter'
import '../styles/Dashboard.css'

const API_BASE = 'http://localhost:8000/api/jobs'

function Dashboard({ user, onLogout }) {
  const [jobs, setJobs] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingJob, setEditingJob] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // Fetch jobs from API
  const fetchJobs = async (status = 'all') => {
    setLoading(true)
    setError(null)
    try {
      const url = status === 'all' ? API_BASE : `${API_BASE}?status=${status}`
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (token) {
      fetchJobs(selectedStatus)
    }
  }, [selectedStatus, token])

  // Add or update job
  const handleSaveJob = async (jobData) => {
    setError(null)
    try {
      const method = editingJob ? 'PUT' : 'POST'
      const url = editingJob ? `${API_BASE}/${editingJob.id}` : API_BASE
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      })

      if (!response.ok) throw new Error('Failed to save job')
      
      const newJob = await response.json()
      
      if (editingJob) {
        setJobs(jobs.map(job => job.id === newJob.id ? newJob : job))
      } else {
        setJobs([newJob, ...jobs])
      }
      
      setEditingJob(null)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  // Delete job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to delete job')
      
      setJobs(jobs.filter(job => job.id !== id))
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    onLogout()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Job Tracker</h1>
          <div className="header-user">
            <span>Welcome, {user?.name || 'User'}!</span>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="form-section">
            <JobForm 
              onSubmit={handleSaveJob}
              initialData={editingJob}
              onCancel={() => setEditingJob(null)}
            />
          </div>

          <div className="list-section">
            {error && <div className="error-message">{error}</div>}
            <StatusFilter 
              selectedStatus={selectedStatus} 
              onStatusChange={setSelectedStatus} 
            />
            {loading ? (
              <p className="loading">Loading jobs...</p>
            ) : (
              <JobList 
                jobs={jobs}
                onDelete={handleDeleteJob}
                onEdit={setEditingJob}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
