
// ======================================
// SISTEM ABSENSI SISWA - SUPABASE
// ======================================

const SUPABASE_URL = "https://xlqicsxvgwfdizokvxlq.supabase.co";
const SUPABASE_KEY = "TEMPEL_PUBLISHABLE_KEY_DI_SINI";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ELEMENT HTML
const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const forgotPage = document.getElementById("forgotPage");
const dashboardPage = document.getElementById("dashboardPage");

function showPage(page) {
    [loginPage, registerPage, forgotPage, dashboardPage]
        .forEach(p => p.classList.add("hidden"));

    page.classList.remove("hidden");
}

function showError(error) {
    alert(error.message || "Terjadi kesalahan.");
}

// NAVIGASI
document.getElementById("goRegister").onclick = e => {
    e.preventDefault();
    showPage(registerPage);
};

document.getElementById("goLogin").onclick = e => {
    e.preventDefault();
    showPage(loginPage);
};

document.getElementById("goForgot").onclick = e => {
    e.preventDefault();
    showPage(forgotPage);
};

document.getElementById("backLogin").onclick = e => {
    e.preventDefault();
    showPage(loginPage);
};

// REGISTRASI
document.getElementById("registerForm").onsubmit = async function(e) {
    e.preventDefault();

    const first = document.getElementById("firstName").value.trim();
    const last = document.getElementById("lastName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: first,
                last_name: last
            }
        }
    });

    if (error) return showError(error);

    this.reset();

    if (!data.session) {
        alert("Pendaftaran berhasil! Silakan periksa email untuk verifikasi akun.");
        showPage(loginPage);
    } else {
        alert("Pendaftaran berhasil!");
        openDashboard(data.user);
    }
};

// LOGIN
document.getElementById("loginForm").onsubmit = async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await db.auth.signInWithPassword({
        email,
        password
    });

    if (error) return showError(error);

    this.reset();
    await openDashboard(data.user);
};

// DASHBOARD
async function openDashboard(user) {
    const { data: profile, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) return showError(error);

    const first = profile?.first_name || user.user_metadata?.first_name || "Siswa";
    const last = profile?.last_name || user.user_metadata?.last_name || "";

    showPage(dashboardPage);

    document.getElementById("studentName").textContent =
        "Halo, " + first + " " + last + "!";

    document.getElementById("classInfo").textContent =
        "Belum bergabung";

    document.getElementById("teacherInfo").textContent = "-";

    await checkAttendance(user);
}

// CEK ABSENSI HARI INI
function getTodayRange() {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}

async function checkAttendance(user) {
    const { start, end } = getTodayRange();

    const { data, error } = await db
        .from("attendance")
        .select("id, status")
        .eq("student_id", user.id)
        .gte("created_at", start)
        .lt("created_at", end)
        .limit(1);

    if (error) return showError(error);

    const attended = data.length > 0;

    document.getElementById("attendanceStatus").textContent =
        attended ? data[0].status : "Belum Absen";

    document.getElementById("attendanceButton").disabled = attended;
}

// ABSENSI
document.getElementById("attendanceButton").onclick = async function() {
    const { data: { user }, error: authError } =
        await db.auth.getUser();

    if (authError || !user) {
        alert("Silakan login kembali.");
        showPage(loginPage);
        return;
    }

    const confirmation = confirm("Apakah kamu yakin ingin melakukan absensi?");

    if (!confirmation) return;

    const { error } = await db
        .from("attendance")
        .insert({
            student_id: user.id,
            status: "Hadir"
        });

    if (error) return showError(error);

    alert("Absensi berhasil dicatat!");
    await checkAttendance(user);
};

// LUPA PASSWORD
document.getElementById("forgotForm").onsubmit = async function(e) {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value.trim().toLowerCase();

    const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
    });

    if (error) return showError(error);

    alert("Jika email terdaftar, tautan reset password akan dikirim. Periksa kotak masuk email.");
    this.reset();
    showPage(loginPage);
};

// LOGOUT
document.getElementById("logoutButton").onclick = async function() {
    const { error } = await db.auth.signOut();

    if (error) return showError(error);

    alert("Kamu berhasil logout.");
    showPage(loginPage);
};

// CEK SESI SAAT WEBSITE DIBUKA
async function initializeApp() {
    const { data, error } = await db.auth.getSession();

    if (error) return showError(error);

    if (data.session) {
        await openDashboard(data.session.user);
    } else {
        showPage(loginPage);
    }
}

initializeApp();

// MEMANTAU PERUBAHAN LOGIN
db.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
        showPage(loginPage);
    }
});
