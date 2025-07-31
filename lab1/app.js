const commentsContainer = document.getElementById('comments-container');
const form = document.getElementById('comment-form');
const nameInput = document.getElementById('name-input');
const commentInput = document.getElementById('comment-input');

// จำลองฐานข้อมูลในหน่วยความจำ
let comments = [
    { id: 1, name: "Alice", text: "นี่คือคอมเมนต์แรก!" }
];

// รับข้อมูลจากแบบฟอร์ม
form.addEventListener('submit', e => {
    e.preventDefault();

    const name = nameInput.value;
    const text = commentInput.value;

    // ตรวจสอบคำต้องห้าม
    const forbiddenPatterns = [/<script.*?>.*?<\/script>/gi, /<.*?>/g];
    if (forbiddenPatterns.some(pattern => pattern.test(text) || pattern.test(name))) {
        alert("⚠️ ตรวจพบคำต้องห้าม เช่น <script> หรือ HTML tags อื่น ๆ กรุณาตรวจสอบข้อความของคุณ");
        return;
    }

    if (!name || !text) {
        alert("กรุณากรอกทั้งชื่อและข้อความ");
        return;
    }

    comments.push({ id: comments.length + 1, name, text });
    renderComments();
    form.reset();
});

// แสดงคอมเมนต์แบบปลอดภัย
function renderComments() {
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');

        const nameElement = document.createElement('strong');
        nameElement.textContent = comment.name;

        const textElement = document.createElement('span');
        textElement.textContent = `: ${comment.text}`;

        commentElement.appendChild(nameElement);
        commentElement.appendChild(textElement);

        commentsContainer.appendChild(commentElement);
    });
}

renderComments();
