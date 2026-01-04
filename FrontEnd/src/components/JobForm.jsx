import { useState, useEffect } from 'react'
import '../styles/JobForm.css'

const STATUSES = ['Applied', 'Interviewing', 'Rejected', 'Offer']

function JobForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [errors, setErrors] = useState({})

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        title: initialData.title,
        status: initialData.status,
        applicationDate: initialData.applicationDate,
        notes: initialData.notes
      })
    }
  }, [initialData])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.title.trim()) newErrors.title = 'Job title is required'
    if (!formData.status) newErrors.status = 'Status is required'
    return newErrors
  }

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    
    // Reset form if not editing
    if (!initialData) {
      setFormData({
        company: '',
        title: '',
        status: 'Applied',
        applicationDate: new Date().toISOString().split('T')[0],
        notes: ''
      })
    }
    setErrors({})
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="company">Company Name *</label>
        <input
          id="company"
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g., Google, Microsoft"
          className={errors.company ? 'input-error' : ''}
        />
        {errors.company && <span className="error-text">{errors.company}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="title">Job Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Software Engineer"
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'input-error' : ''}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.status && <span className="error-text">{errors.status}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="applicationDate">Application Date</label>
          <input
            id="applicationDate"
            type="date"
            name="applicationDate"
            value={formData.applicationDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this application..."
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? '✏️ Update Job' : '➕ Add Job'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default JobForm
