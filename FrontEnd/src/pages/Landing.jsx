import { Link } from 'react-router-dom'
import '../styles/Landing.css'

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Job Tracker</h1>
        <p>Track your job applications and manage your career journey</p>
        
        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
