// ฟังก์ชัน Hashing แบบจำลอง
function simpleHash(password) {
    let hash = "hashed_";
    for (let i = 0; i < password.length; i++) {
        hash += (password.charCodeAt(i) % 10);
    }
    return hash + "_end";
}

// Register
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const hashedPassword = simpleHash(password);

    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: hashedPassword })
    });

    if (response.ok) {
        alert('สมัครสมาชิกสำเร็จ');
        window.location.href = "login.html";
    } else {
        alert('สมัครสมาชิกไม่สำเร็จ');
    }
});

// Login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`http://localhost:3000/users?email=${email}`);
    const users = await response.json();

    if (users.length > 0) {
        const user = users[0];
        if (simpleHash(password) === user.password) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = `profile.html?id=${user.id}`;
        } else {
            alert("รหัสผ่านไม่ถูกต้อง");
        }
    } else {
        alert("ไม่พบอีเมลนี้ในระบบ");
    }
});
