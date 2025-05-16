// auth.js - Pastikan path fetch sesuai
const API_BASE_URL = 'http://localhost:3000';

// Signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Signup attempted'); // Debug
  
  const formData = {
    username: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    alert('Registrasi berhasil!');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Signup Error:', error);
    alert(error.message);
  }
});