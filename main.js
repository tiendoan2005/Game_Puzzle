const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Các nút
const button = {
    x: 5,
    y: 5,
    width: 100,
    height: 50,
    text: "Bắt đầu",
};

const button1 = {
    x: 130,
    y: 5,
    width: 90,
    height: 50,
    text: "Làm mới",
};

const button2 = {
    x: 5,
    y: 650,
    width: 90,
    height: 45,
    text: "Xác nhận",
};

// Trạng thái trò chơi
let isGameStarted = false;
let isGameOver = false;  // Biến để theo dõi nếu trò chơi đã kết thúc

// Các phần vẽ
function drawText() {
    ctx.fillStyle = '#d3d3d3';
    ctx.font = "20px Arial";
    ctx.fillText("Điểm: ", 150, 685);
}

const box = {
    x: 15,
    y: 185,
    width: 470,
    height: 460,
};

const image = {
    x: 320,
    y: 10,
    width: 161,
    height: 161,
};

function drawButton() {
    ctx.fillStyle = '#d40505'; // Màu nền
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.fillRect(button1.x, button1.y, button1.width, button1.height);
    ctx.fillRect(button2.x, button2.y, button2.width, button2.height);
    ctx.strokeStyle = '#d40505'; // Màu viền
    ctx.strokeRect(button.x, button.y, button.width, button.height);
    ctx.strokeRect(button1.x, button1.y, button1.width, button1.height);
    ctx.strokeRect(button2.x, button2.y, button2.width, button2.height);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
    ctx.fillText(button1.text, button1.x + button1.width / 2, button1.y + button1.height / 2);
    ctx.fillText(button2.text, button2.x + button2.width / 2, button2.y + button2.height / 2);
}

function drawBox() {
    ctx.fillStyle = 'rgba(255,204,0,0.49)';
    ctx.fillRect(box.x, box.y, box.width, box.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
}

function drawImage() {
    ctx.fillStyle = 'rgba(255,255,255,0)';
    ctx.fillRect(image.x, image.y, image.width, image.height);
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 3;
    ctx.strokeRect(image.x, image.y, image.width, image.height);
}

const rows = 10;
const cols = 10;
const boxSize = 45;
const padding = 0;
const offsetX = 25;
const offsetY = 190;

const gridColors = [];

for (let row = 0; row < rows; row++) {
    gridColors[row] = [];
    for (let col = 0; col < cols; col++) {
        gridColors[row][col] = 'white';
    }
}

function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetX + col * (boxSize + padding);
            const y = offsetY + row * (boxSize + padding);

            ctx.fillStyle = gridColors[row][col];
            ctx.fillRect(x, y, boxSize, boxSize);

            ctx.strokeStyle = '#000000';
            ctx.strokeRect(x, y, boxSize, boxSize);
        }
    }
}

canvas.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;

    const col = Math.floor((x - offsetX) / (boxSize + padding));
    const row = Math.floor((y - offsetY) / (boxSize + padding));

    if (isGameStarted) {
        // Nếu trò chơi đã bắt đầu, người dùng có thể thay đổi màu sắc ô
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            if (gridColors[row][col] === 'white') {
                gridColors[row][col] = 'red';
            } else if (gridColors[row][col] === 'red') {
                gridColors[row][col] = 'blue';
            } else {
                gridColors[row][col] = 'white';
            }

            drawGrid();
        }
    }

    // Nút "Làm mới"
    if (x >= button1.x && x <= button1.x + button1.width && y >= button1.y && y <= button1.y + button1.height) {
        resetGrid();
    }

    // Nút "Bắt đầu" hoặc "Chơi"
    if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
        if (!isGameStarted && !isGameOver) {  // Khi chưa bắt đầu và trò chơi chưa kết thúc
            startNewGame();
        } else if (isGameOver) {  // Nếu trò chơi đã kết thúc, nhấn lại để chơi lại
            restartGame();
        }
    }

    // Nút "Xác nhận"
    if (x >= button2.x && x <= button2.x + button2.width && y >= button2.y && y <= button2.y + button2.height) {
        checkMatch(); // Kiểm tra sự tương đương
    }
});

// Hàm reset bảng
function resetGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            gridColors[row][col] = 'white';
        }
    }
    drawGrid();
}

// Biến điểm
let score = 0;

// Hàm vẽ điểm
function drawScore() {
    const scoreX = 150;  // Tọa độ x của điểm
    const scoreY = 685;  // Tọa độ y của điểm

    // Xóa phần số điểm cũ
    ctx.clearRect(scoreX - 50, scoreY - 20, 200, 30); // Xóa vùng chứa số điểm cũ, đảm bảo đủ rộng để xóa

    // Vẽ lại số điểm mới
    ctx.fillStyle = '#d3d3d3';
    ctx.font = "20px Arial";
    ctx.fillText("Điểm: " + score, scoreX, scoreY); // Vẽ lại chữ "Điểm" và số điểm
}

// Mảng lưu màu sắc của ảnh ngẫu nhiên
const randomImageColors = [];

// Hàm tạo ảnh ngẫu nhiên
function generateRandomImage() {
    const imageRows = 10;
    const imageCols = 10;
    const imageBoxSize = 16;

    // Xóa ảnh cũ trước khi vẽ ảnh mới
    ctx.clearRect(image.x, image.y, image.width, image.height);

    for (let row = 0; row < imageRows; row++) {
        randomImageColors[row] = [];
        for (let col = 0; col < imageCols; col++) {
            const randomColor = Math.random() < 0.5 ? 'blue' : 'red';
            randomImageColors[row][col] = randomColor;

            const x = image.x + col * (imageBoxSize + padding);
            const y = image.y + row * (imageBoxSize + padding);

            ctx.fillStyle = randomColor;
            ctx.fillRect(x, y, imageBoxSize, imageBoxSize);

            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(x, y, imageBoxSize, imageBoxSize);
        }
    }
}

// Hàm hiển thị thông báo trên canvas với tọa độ có thể thay đổi
function showMessage(message, x, y) {
    ctx.fillStyle = '#ffffff';  // Màu chữ
    ctx.font = "20px Arial";
    ctx.fillText(message, x, y);  // Vị trí hiển thị thông báo trên canvas
}

// Hàm kiểm tra sự tương đương và cộng điểm
function checkMatch() {
    let isMatch = true;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (gridColors[row][col] !== randomImageColors[row][col]) {
                isMatch = false;
                break;
            }
        }
    }

    // Hiển thị thông báo và cộng điểm nếu tương đương
    if (isMatch) {
        score += 100; // Cộng thêm 100 điểm khi hoàn thành
        drawScore(); // Vẽ lại điểm
        showMessage("Chúc mừng!", 130, 80); // Hiển thị thông báo "Chúc mừng!"

        // Đặt thời gian hiển thị thông báo "Chúc mừng!" trong 2 giây
        setTimeout(() => {
            ctx.clearRect(120 - 50, 80 - 20, 150, 30); // Xóa thông báo "Chúc mừng!"
        }, 2000);

        // Tạo ảnh ngẫu nhiên mới và làm mới bảng
        resetGrid(); // Reset bảng
        generateRandomImage(); // Tạo lại ảnh ngẫu nhiên
    } else {
        showMessage("Hãy thử lại.", 120, 80); // Hiển thị thông báo "Hãy thử lại."

        // Đặt thời gian hiển thị thông báo "Hãy thử lại." trong 2 giây
        setTimeout(() => {
            ctx.clearRect(120 - 50, 80 - 20, 150, 30); // Xóa thông báo "Hãy thử lại."
        }, 2000);
    }
}

// Cập nhật thời gian đếm ngược (5 phút - 300 giây)
let countdown = 180;

function drawCountdown() {
    const countdownX = 100;  // Tọa độ x của đồng hồ đếm ngược
    const countdownY = 170;  // Tọa độ y của đồng hồ đếm ngược

    // Tính toán số phút và giây từ tổng số giây
    const minutes = Math.floor(countdown / 60);  // Số phút
    const seconds = countdown % 60;  // Số giây còn lại

    // Đảm bảo giây luôn có 2 chữ số (ví dụ: 09, 01, 15...)
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    // Xóa phần thời gian cũ trước khi vẽ lại
    ctx.clearRect(countdownX - 70, countdownY - 20, 200, 30); // Xóa phần trước khi vẽ thời gian mới

    // Vẽ lại thời gian mới (theo định dạng MM:SS)
    ctx.fillStyle = '#ffffff';  // Màu chữ
    ctx.font = "20px Arial";
    ctx.fillText("Thời gian: " + minutes + ":" + formattedSeconds, countdownX, countdownY);  // Hiển thị thời gian còn lại
}

// Hàm cập nhật thời gian
function updateCountdown() {
    if (countdown > 0 && isGameStarted) {
        countdown--;  // Giảm thời gian mỗi giây
        drawCountdown();  // Vẽ lại thời gian
    } else if (countdown <= 0 && isGameStarted) {
        // Khi thời gian hết, thay đổi trạng thái trò chơi và nút
        isGameStarted = false;
        isGameOver = true;
        button.text = "Chơi";
        drawButton();  // Cập nhật lại nút
    }
}

// Hàm bắt đầu lại trò chơi
function startNewGame() {
    // Reset lại điểm, bảng, thời gian, và trạng thái trò chơi
    score = 0;
    countdown = 180;  // Đặt lại thời gian
    isGameStarted = true;
    isGameOver = false;
    button.text = "Đang chơi";  // Đổi tên nút
    drawButton();

    resetGrid();  // Reset bảng
    generateRandomImage();  // Tạo lại ảnh ngẫu nhiên
    drawScore();  // Vẽ lại điểm số ban đầu
    drawCountdown();  // Vẽ lại thời gian bắt đầu
}

// Hàm khởi động lại trò chơi
function restartGame() {
    score = 0;
    countdown = 180;
    isGameStarted = false;
    isGameOver = false;
    button.text = "Bắt đầu";  // Đổi tên nút thành "Bắt đầu"
    drawButton();
}

// Cập nhật mỗi giây (sử dụng setInterval)
setInterval(updateCountdown, 1000);  // Mỗi giây cập nhật lại thời gian

// Gọi hàm tạo ảnh ngẫu nhiên
generateRandomImage();

// Vẽ các phần khác trên canvas
drawBox();
drawButton();
drawText();
drawImage();
drawGrid();
drawScore(); // Vẽ điểm ban đầu
