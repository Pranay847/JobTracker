import { useState, useEffect } from 'react'
import './App.css'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import StatusFilter from './components/StatusFilter'

const API_BASE = 'http://localhost:8000/api/jobs'

function App() {
  const [jobs, setJobs] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingJob, setEditingJob] = useState(null)

  // Fetch jobs from API
  const fetchJobs = async (status = 'all') => {
    setLoading(true)
    setError(null)
    try {
      const url = status === 'all' ? API_BASE : `${API_BASE}?status=${status}`
      const response = await fetch(url)
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
    fetchJobs(selectedStatus)
  }, [selectedStatus])

  // Add or update job
  const handleSaveJob = async (jobData) => {
    setError(null)
    try {
      const method = editingJob ? 'PUT' : 'POST'
      const url = editingJob ? `${API_BASE}/${editingJob.id}` : API_BASE
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save job')
      }

      setEditingJob(null)
      await fetchJobs(selectedStatus)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  // Delete job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete job')
      
      await fetchJobs(selectedStatus)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  // Edit job
  const handleEditJob = (job) => {
    setEditingJob(job)
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingJob(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 Job Tracker</h1>
        <p>Manage your job applications</p>
      </header>

      <main className="app-main">
        <div className="content-wrapper">
          {/* Form Section */}
          <div className="form-section">
            <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <JobForm
              onSubmit={handleSaveJob}
              initialData={editingJob}
              onCancel={editingJob ? handleCancelEdit : null}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Filter Section */}
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />

          {/* Jobs List Section */}
          <div className="jobs-section">
            <h2>My Applications</h2>
            {loading ? (
              <div className="loading">⏳ Loading...</div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <p>No jobs found. {selectedStatus !== 'all' && 'Try changing the filter.'}</p>
              </div>
            ) : (
              <JobList
                jobs={jobs}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
