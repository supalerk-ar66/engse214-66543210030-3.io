// URL เซิร์ฟเวอร์ (ต้องตรงกับ auth.js)
const SERVER_URL = 'http://localhost:3000';

window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("id");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("กรุณา Login ก่อน");
        window.location.assign("login.html");
        return;
    }

    // ป้องกัน IDOR
    if (profileId !== String(loggedInUser.id)) {
        alert("คุณไม่มีสิทธิ์เข้าถึงโปรไฟล์นี้");
        window.location.assign("login.html");
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/users/${profileId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const user = await response.json();
        console.log('Fetched user profile:', user);

        const container = document.getElementById("profileContainer");
        if (!container) {
            console.error('Profile container not found');
            alert('เกิดข้อผิดพลาด: ไม่พบคอนเทนเนอร์โปรไฟล์');
            return;
        }

        container.innerHTML = `
            <p>Email: ${user.email}</p>
            <p>User ID: ${user.id}</p>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.assign("login.html");
        });
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์: ${error.message}`);
        window.location.assign("login.html");
    }
});