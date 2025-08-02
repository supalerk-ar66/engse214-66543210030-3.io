// ฟังก์ชัน Hashing แบบจำลอง (เพื่อการศึกษาเท่านั้น)
function simpleHash(password) {
    let hash = "hashed_";
    for (let i = 0; i < password.length; i++) {
        hash += (password.charCodeAt(i) % 10);
    }
    return hash + "_end";
}

// URL เซิร์ฟเวอร์
const SERVER_URL = 'http://localhost:3000/users';

// ฟังก์ชันตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์
async function checkServer() {
    try {
        const response = await fetch(SERVER_URL, { timeout: 5000 });
        console.log('Server check response:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Server check failed:', error.message);
        return false;
    }
}

// Register
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");

        if (!emailInput || !passwordInput) {
            console.error('Input elements not found');
            alert('เกิดข้อผิดพลาด: ไม่พบฟิลด์อีเมลหรือรหัสผ่าน');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;
        console.log('Register attempt with email:', email);

        // ตรวจสอบเซิร์ฟเวอร์
        const serverAvailable = await checkServer();
        if (!serverAvailable) {
            alert(`ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า JSON Server รันอยู่ที่ ${SERVER_URL}`);
            return;
        }

        try {
            // ตรวจสอบอีเมลซ้ำ
            const checkEmail = await fetch(`${SERVER_URL}/users?email=${email}`);
            const existingUsers = await checkEmail.json();
            console.log('Existing users check:', existingUsers);
            if (existingUsers.length > 0) {
                alert('อีเมลนี้ถูกใช้แล้ว');
                return;
            }

            const hashedPassword = simpleHash(password);
            console.log('Hashed password:', hashedPassword);
            const response = await fetch(`${SERVER_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: hashedPassword })
            });

            if (response.ok) {
                const newUser = await response.json();
                console.log('Registration successful, new user:', newUser);
                alert('สมัครสมาชิกสำเร็จ');
                console.log('Redirecting to login.html');
                window.location.assign("login.html");
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                alert(`สมัครสมาชิกไม่สำเร็จ: ${errorData.message || 'เกิดข้อผิดพลาด'}`);
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert(`เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์: ${error.message}`);
        }
    });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        if (!emailInput || !passwordInput) {
            console.error('Input elements not found');
            alert('เกิดข้อผิดพลาด: ไม่พบฟิลด์อีเมลหรือรหัสผ่าน');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;
        console.log('Login attempt with email:', email);

        // ตรวจสอบเซิร์ฟเวอร์
        const serverAvailable = await checkServer();
        if (!serverAvailable) {
            alert(`ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า JSON Server รันอยู่ที่ ${SERVER_URL}`);
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/users?email=${email}`);
            const users = await response.json();
            console.log('Fetched users:', users);

            if (users.length > 0) {
                const user = users[0];
                if (simpleHash(password) === user.password) {
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    console.log('Login successful, redirecting to profile:', user);
                    window.location.assign(`profile.html?id=${user.id}`);
                } else {
                    alert("รหัสผ่านไม่ถูกต้อง");
                }
            } else {
                alert("ไม่พบอีเมลนี้ในระบบ");
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            alert(`เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์: ${error.message}`);
        }
    });
}