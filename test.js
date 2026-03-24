import fetch from 'node-fetch'; // mock fetch script to diagnose if backend receives it without CORS

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "User", email: "userxxssxx@example.com", password: "password123" })
    });
    
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch (e) {
    console.error("Hard Network Error in Node:", e.message);
  }
}
test();
