import fetch from 'node-fetch'; // native fetch in Node 18+

async function testBackend() {
  try {
    console.log("Testing Signup...");
    const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test" + Date.now() + "@test.com",
        password: "password123",
      })
    });
    const data = await res.json();
    console.log("Signup:", data);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testBackend();
