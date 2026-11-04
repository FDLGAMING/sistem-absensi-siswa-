
// ===================================
// SISTEM ABSENSI SISWA
// JAVASCRIPT
// ===================================

// MENGAMBIL ELEMEN HTML
const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const forgotPage = document.getElementById("forgotPage");
const dashboardPage = document.getElementById("dashboardPage");

// NAVIGASI HALAMAN
function showPage(page) {
    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    forgotPage.classList.add("hidden");
    dashboardPage.classList.add("hidden");

    page.classList.remove("hidden");
}

// TOMBOL PINDAH HALAMAN
document.getElementById("goRegister").onclick = function(e) {
    e.preventDefault();
    showPage(registerPage);
};

document.getElementById("goLogin").onclick = function(e) {
    e.preventDefault();
    showPage(loginPage);
};

document.getElementById("goForgot").onclick = function(e) {
    e.preventDefault();
    showPage(forgotPage);
};

document.getElementById("backLogin").onclick = function(e) {
    e.preventDefault();
    showPage(loginPage);
};

// PENYIMPANAN DATA DEMO
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// PENDAFTARAN AKUN
document.getElementById("registerForm").onsubmit = function(e) {
    e.preventDefault();

    const first = document.getElementById("firstName").value.trim();
    const last = document.getElementById("lastName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    let users = getUsers();

    if (users.some(user => user.email === email)) {
        alert("Email sudah terdaftar!");
        return;
    }

    const newUser = {
        first: first,
        last: last,
        email: email,
        password: password,
        className: "",
        attendance: ""
    };

    users.push(newUser);
    saveUsers(users);

    alert("Pendaftaran berhasil! Silakan login.");

    this.reset();
    showPage(loginPage);
};

// LOGIN AKUN
document.getElementById("loginForm").onsubmit = function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(function(account) {
        return account.email === email &&
               account.password === password;
    });

    if (!user) {
        alert("Email atau password salah!");
        return;
    }

    localStorage.setItem("activeUser", email);

    this.reset();
    openDashboard(user);
};

// MEMBUKA DASHBOARD
function openDashboard(user) {
    showPage(dashboardPage);

    document.getElementById("studentName").textContent =
        "Halo, " + user.first + " " + user.last + "!";

    document.getElementById("classInfo").textContent =
        user.className || "Belum bergabung";

    document.getElementById("teacherInfo").textContent =
        user.className ? "Belum ditentukan" : "-";

    document.getElementById("attendanceStatus").textContent =
        user.attendance || "Belum Absen";

    document.getElementById("attendanceButton").disabled =
        user.attendance !== "";
}

// LUPA PASSWORD
document.getElementById("forgotForm").onsubmit = function(e) {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value.trim().toLowerCase();

    const users = getUsers();

    const user = users.find(account => account.email === email);

    if (!user) {
        alert("Email tidak ditemukan!");
        return;
    }

    alert(
        "Email ditemukan. Fitur pengiriman tautan reset password membutuhkan backend dan verifikasi email. Fitur ini belum aktif."
    );
};

// ABSENSI DEMO
document.getElementById("attendanceButton").onclick = function() {
    const email = localStorage.getItem("activeUser");

    let users = getUsers();

    const user = users.find(account => account.email === email);

    if (!user || user.attendance !== "") {
        alert("Absensi tidak dapat dilakukan.");
        return;
    }

    const confirmation = confirm(
        "Apakah kamu yakin ingin melakukan absensi?"
    );

    if (!confirmation) {
        return;
    }

    user.attendance = "Hadir";

    saveUsers(users);

    alert("Absensi demo berhasil dicatat!");

    openDashboard(user);
};

// LOGOUT
document.getElementById("logoutButton").onclick = function() {
    localStorage.removeItem("activeUser");

    alert("Kamu berhasil logout.");

    showPage(loginPage);
};

// MEMERIKSA SESI LOGIN
window.onload = function() {
    const activeEmail = localStorage.getItem("activeUser");

    if (activeEmail) {
        const users = getUsers();

        const user = users.find(account =>
            account.email === activeEmail
        );

        if (user) {
            openDashboard(user);
            return;
        }
    }

    showPage(loginPage);
};

