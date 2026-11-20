
const sahran_form_profil = document.getElementById("sahran_form_profil");

const sahran_input_profil = [
    "sahran_nama_pemilik",
    "sahran_alamat_kebun",
    "sahran_nomor_hp",
    "sahran_luas_kebun",
    "sahran_jumlah_pohon",
    "sahran_tahun_berkebun",
    "sahran_catatan_kebun"
];

// Mengambil profil yang tersimpan
function sahran_ambil_profil() {
    return JSON.parse(localStorage.getItem("sahran_profil_kebun")) || null;
}

// Menampilkan data profil
function sahran_tampilkan_profil() {
    const data = sahran_ambil_profil();
    if (!data) return;

    sahran_input_profil.forEach(id => {
        document.getElementById(id).value = data[id] || "";
    });

    const tampilan = document.getElementById("sahran_tampilan_profil");
    tampilan.innerHTML = `
        <h2>Profil Kebun Tersimpan</h2>
        <p><strong>Pemilik:</strong> ${sahran_aman(data.sahran_nama_pemilik)}</p>
        <p><strong>Alamat:</strong> ${sahran_aman(data.sahran_alamat_kebun)}</p>
        <p><strong>Nomor HP:</strong> ${sahran_aman(data.sahran_nomor_hp)}</p>
        <p><strong>Luas Kebun:</strong> ${sahran_aman(data.sahran_luas_kebun)} Hektare</p>
        <p><strong>Jumlah Pohon:</strong> ${sahran_aman(data.sahran_jumlah_pohon)} Pohon</p>
        <p><strong>Tahun Mulai:</strong> ${sahran_aman(data.sahran_tahun_berkebun || "-")}</p>
        <p><strong>Catatan:</strong> ${sahran_aman(data.sahran_catatan_kebun || "-")}</p>
    `;
}

// Mengamankan teks sebelum ditampilkan
function sahran_aman(teks) {
    const elemen = document.createElement("span");
    elemen.textContent = String(teks ?? "");
    return elemen.innerHTML;
}

// Menyimpan atau memperbarui profil
sahran_form_profil.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {};

    sahran_input_profil.forEach(id => {
        data[id] = document.getElementById(id).value.trim();
    });

    const luas = Number(data.sahran_luas_kebun);
    const pohon = Number(data.sahran_jumlah_pohon);

    if (!Number.isFinite(luas) || luas <= 0 ||
        !Number.isSafeInteger(pohon) || pohon <= 0) {
        alert("Periksa kembali luas kebun dan jumlah pohon!");
        return;
    }

    localStorage.setItem("sahran_profil_kebun", JSON.stringify(data));

    alert("Profil kebun berhasil disimpan!");
    sahran_tampilkan_profil();
});

// Tampilkan data ketika halaman dibuka
sahran_tampilkan_profil();
