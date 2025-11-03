import React, { useState } from "react";
import "./style.css";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    plan: '',
    specialRequirements: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Backend URL configuration
  const BACKEND_URL = "https://fitzone-1-bny6.onrender.com";

  const openModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
    setSubmitStatus({ message: '', type: '' });
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      plan: '',
      specialRequirements: ''
    });
    setSubmitStatus({ message: '', type: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName.trim()) {
      errors.push('Full name is required');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.phoneNumber.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    if (!formData.plan) {
      errors.push('Please select a membership plan');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus({
        message: validationErrors.join('\n'),
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending form data:', formData);

      // ✅ Use environment-based URL instead of hardcoded localhost
      try {
        const testResponse = await fetch(`${BACKEND_URL}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });
        
      if (!testResponse.ok) {
          throw new Error('Backend server is not responding properly');
      }
      } catch (error) {
        console.error('Test endpoint error:', error);
        throw new Error('Cannot connect to the backend server. Please make sure it is running.');
      }

      const response = await fetch(`${BACKEND_URL}/api/memberships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response from server:', data);
      
      if (data.success) {
        setSubmitStatus({
          message: data.message || 'Membership application submitted successfully! You will receive a confirmation email shortly.',
          type: 'success'
        });
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setSubmitStatus({
          message: data.error || 'Something went wrong. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        message: 'Failed to connect to the server. Please check if the backend server is running.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <header>
        <nav className="navbar container">
          <div className="logo">IronForge Gym</div>
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#programs">Programs</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#stories">Stories</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="#membership" className="btn-primary" onClick={openModal}>Get Membership</a>
          <div className="menu-btn">☰</div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero container" id="hero">
        <div className="hero-text">
          <h1>Train Hard <span>Stay Strong</span></h1>
          <p>Build strength, improve endurance, and transform your body with programs designed by certified trainers. Your journey starts now.</p>
          <div className="hero-buttons">
            <a href="#pricing" className="btn btn-green" onClick={openModal}>Join Now</a>
            <a href="#programs" className="btn btn-dark">Explore Programs</a>
          </div>
          <div className="hero-stats">
            <div>500+ Members</div>
            <div>20+ Trainers</div>
            <div>100% Results</div>
          </div>
        </div>
        <div className="hero-img">
          <img src="m1.jpg" alt="Gym" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="about container" id="about">
        <div className="about-img">
          <img src="m2.jpg" alt="About Gym" />
        </div>
        <div className="about-text">
          <h2>About IronForge</h2>
          <p>We are more than just a gym. IronForge is a community where people come to challenge themselves and achieve their fitness goals.</p>
          <a href="#programs" className="btn">Learn More</a>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="programs container" id="programs">
        <h2>Our Programs</h2>
        <div className="program-grid">
          <div className="program-card">
            <h3>Strength Training</h3>
            <p>Build raw strength with our expert-designed lifting programs.</p>
          </div>
          <div className="program-card">
            <h3>Cardio Blast</h3>
            <p>Burn fat and boost endurance with high-intensity cardio classes.</p>
          </div>
          <div className="program-card">
            <h3>Yoga & Flexibility</h3>
            <p>Enhance mobility, flexibility, and mental balance.</p>
          </div>
        </div>
      </section>

      {/* POPULAR CLASSES */}
      <section className="popular-classes container" id="popular-classes">
        <h2>Popular Classes</h2>
        <p>Join a supportive group with expert guidance and structured programming.</p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Days</th>
                <th>Time</th>
                <th>Coach</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Powerlifting 101</td>
                <td>Mon, Wed, Fri</td>
                <td>06:00 – 07:00</td>
                <td>Ravi K.</td>
                <td>Beginner</td>
              </tr>
              <tr>
                <td>HIIT Blast</td>
                <td>Tue, Thu</td>
                <td>18:30 – 19:15</td>
                <td>Ananya S.</td>
                <td>All</td>
              </tr>
              <tr>
                <td>Strength & Conditioning</td>
                <td>Mon–Thu</td>
                <td>19:30 – 20:30</td>
                <td>Arjun P.</td>
                <td>Intermediate</td>
              </tr>
              <tr>
                <td>Yoga for Mobility</td>
                <td>Sat</td>
                <td>08:00 – 09:00</td>
                <td>Priya M.</td>
                <td>All</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="trainers container" id="trainers">
        <h2>Meet Our Trainers</h2>
        <div className="trainer-grid">
          <div className="trainer-card">
            <img src="m3.jpg" alt="Coach Ravi" />
            <h3>Coach Ravi - Strength Coach</h3>
          </div>
          <div className="trainer-card">
            <img src="m4.jpg" alt="Coach Ananya" />
            <h3>Coach Ananya - HIIT Specialist</h3>
          </div>
          <div className="trainer-card">
            <img src="m5.jpg" alt="Coach Arjun" />
            <h3>Coach Arjun - S&C</h3>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing container" id="pricing">
        <h2>Flexible Pricing</h2>
        <div className="price-grid">
          <div className="price-card">
            <h3>Basic</h3>
            <p>₹999 / month</p>
            <ul>
              <li>Gym Access</li>
              <li>1 Trainer Session</li>
              <li>Free Locker</li>
            </ul>
            <button onClick={openModal}>Choose Plan</button>
          </div>
          <div className="price-card">
            <h3>Pro</h3>
            <p>₹1999 / month</p>
            <ul>
              <li>Gym + Classes</li>
              <li>5 Trainer Sessions</li>
              <li>Priority Support</li>
            </ul>
            <button onClick={openModal}>Choose Plan</button>
          </div>
          <div className="price-card">
            <h3>Elite</h3>
            <p>₹2999 / month</p>
            <ul>
              <li>All Access</li>
              <li>Unlimited Sessions</li>
              <li>Nutrition Guidance</li>
            </ul>
            <button onClick={openModal}>Choose Plan</button>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="stories container" id="stories">
        <h2>Member Stories</h2>
        <div className="story-grid">
          <div className="story-card">
            "Lost 9 kg in 3 months while getting stronger. Trainers are patient and motivating!"
            <span className="story-name">– Priya</span>
          </div>
          <div className="story-card">
            "The Pro plan’s classes keep me consistent. Facilities are spotless."
            <span className="story-name">– Kiran</span>
          </div>
          <div className="story-card">
            "Best strength gym in town. Great community and equipment."
            <span className="story-name">– Sameer</span>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact container" id="contact">
        <h2>Get in Touch</h2>
        <div className="contact-boxes">
          <div className="contact-box">
            <h3>Visit</h3>
            <p>📍 MG Road, Hyderabad</p>
          </div>
          <div className="contact-box">
            <h3>Hours</h3>
            <p>Mon – Sun<br />5:00 AM – 11:00 PM</p>
          </div>
          <div className="contact-box">
            <h3>Call</h3>
            <p>+91 98765 43210<br />info@ironforgegym.com</p>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.207441548578!2d78.48667191435358!3d17.385044888090785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb979e3b777f3d%3A0x1bdb57c9c4042afe!2sMG%20Road%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1636547891234!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          title="map"
        />
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 IronForge Gym. All Rights Reserved.</p>
      </footer>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Membership Application</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={loading}
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
              <select
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                required
                disabled={loading}
                style={{width: "80%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "none"}}
              >
                <option value="">Select Membership Plan</option>
                <option value="basic">Basic - ₹999/month</option>
                <option value="pro">Pro - ₹1999/month</option>
                <option value="elite">Elite - ₹2999/month</option>
              </select>
              <textarea
                name="specialRequirements"
                placeholder="Any special requirements or health conditions?"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                disabled={loading}
                style={{width: "80%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "none", minHeight: "100px"}}
              />
              {submitStatus.message && (
                <div style={{
                  margin: "10px 0",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: submitStatus.type === 'success' ? '#4CAF50' : '#f44336',
                  color: 'white'
                }}>
                  {submitStatus.message}
                </div>
              )}
              <button 
                type="submit" 
                className="btn-submit" 
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
