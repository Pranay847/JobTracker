import '../styles/JobList.css'

function JobList({ jobs, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      'Applied': '#3b82f6',
      'Interviewing': '#f59e0b',
      'Rejected': '#ef4444',
      'Offer': '#10b981'
    }
    return colors[status] || '#6b7280'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="jobs-list">
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <div className="job-header">
            <div className="job-title-section">
              <h3>{job.title}</h3>
              <p className="company-name">{job.company}</p>
            </div>
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(job.status) }}
            >
              {job.status}
            </span>
          </div>

          <div className="job-details">
            <div className="detail-item">
              <span className="label">Applied:</span>
              <span>{formatDate(job.applicationDate)}</span>
            </div>
            {job.notes && (
              <div className="detail-item full-width">
                <span className="label">Notes:</span>
                <span>{job.notes}</span>
              </div>
            )}
          </div>

          <div className="job-actions">
            <button
              className="btn btn-edit"
              onClick={() => onEdit(job)}
              title="Edit job"
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(job.id)}
              title="Delete job"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default JobList
