
async function testLogin() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'password123'
      })
    });
    
    console.log('Error status:', response.status);
    const data = await response.json();
    console.log('Error data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error message:', err.message);
  }
}

testLogin();
