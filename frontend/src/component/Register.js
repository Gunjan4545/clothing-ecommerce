import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './style/Auth.css'

function Register() {
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    
  const [successMessage, setSuccessMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/register', formData);
            // Handle successful registration or display an error message.
            if (response.status === 201) {
                // Registration was successful
                setSuccessMessage('Registration successful.');
                // You can redirect to a login page or show a success message
                // console.log('Registration successful');
                // Example: Redirect to the login page
                history.push('/login');
            } else {
                // Handle other success cases if needed
                console.log('Registration response:', response.data);
            }
        } catch (error) {
            // Handle registration error, e.g., display an error message.
             // Registration failed
        // Handle and display an error message
        console.error('Registration error:', error.response.data.message);
        }
    };
    return (
        <div className='body'>
            <div className='box'>
                <h1>SIGN UP</h1>
                {successMessage && (
    <div className="success-message">{successMessage}</div>
)}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Name"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
            
                    <button type="submit">Create Account</button>
                </form>
                
                <p>
                    Already have an account? <a href="/login">Sign In</a>
                </p>
            </div>
        </div>
    );
    
}
export default Register;