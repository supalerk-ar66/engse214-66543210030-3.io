window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("id");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("กรุณา Login ก่อน");
        window.location.href = "login.html";
        return;
    }

    // ป้องกัน IDOR
    if (profileId !== String(loggedInUser.id)) {
        alert("คุณไม่มีสิทธิ์เข้าถึงโปรไฟล์นี้");
        window.location.href = "login.html";
        return;
    }

    // ดึงข้อมูลโปรไฟล์
    const response = await fetch(`http://localhost:3000/users/${profileId}`);
    const user = await response.json();

    const container = document.getElementById("profileContainer");
    container.innerHTML = `
        <p>Email: ${user.email}</p>
        <p>User ID: ${user.id}</p>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
});
