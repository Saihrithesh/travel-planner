const fp = require('fs');

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "User Node", email: "nodetest" + Date.now() + "@test.com", password: "password123" })
    });
    
    const text = await res.text();
    fp.writeFileSync('error_dump.json', text, 'utf-8');
  } catch(err) {
    fp.writeFileSync('error_dump.json', err.message, 'utf-8');
  }
}
test();
