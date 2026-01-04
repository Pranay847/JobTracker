import '../styles/StatusFilter.css'

const STATUSES = ['all', 'Applied', 'Interviewing', 'Rejected', 'Offer']

function StatusFilter({ selectedStatus, onStatusChange }) {
  return (
    <div className="status-filter">
      <h3>Filter by Status</h3>
      <div className="filter-buttons">
        {STATUSES.map(status => (
          <button
            key={status}
            className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
            onClick={() => onStatusChange(status)}
          >
            {status === 'all' ? 'Show All' : status}
          </button>
        ))}
      </div>
    </div>
  )
}

export default StatusFilter
