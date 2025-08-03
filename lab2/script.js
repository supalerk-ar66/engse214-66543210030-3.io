const vulnCode = `function loginUser(username, password) {
  const query = \`SELECT * FROM users
                WHERE username = '\${username}'
                AND password = '\${password}'\`;
  return executeQuery(query);
}`;

const secureCode = `function loginUserSecure(username, password) {
  const query = \`SELECT * FROM users
                WHERE username = ?
                AND password = ?\`;
  return executeSecureQuery(query, [username, password]);
}`;

document.getElementById("vuln-code").textContent = vulnCode;
document.getElementById("secure-code").textContent = secureCode;

function executeQuery(query) {
  alert("\u26a0 SQL ที่ถูกรัน (ไม่ปลอดภัย):\n\n" + query);
}

function executeSecureQuery(query, params) {
  alert("✅ SQL แบบปลอดภัย (Parameterized):\n\n" + query + "\n\nพารามิเตอร์: " + JSON.stringify(params));
}

function testVulnerable() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  executeQuery(query);
}

function testSecure() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  executeSecureQuery(query, [username, password]);
}