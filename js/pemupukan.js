
// ===================================
// SISTEM JADWAL PEMUPUKAN KAKAO
// KAKAO FARM - SAHRAN
// ===================================

// Data awal jadwal pemupukan
const sahran_data_awal = [
    {
        id: 1,
        lahan: "Kebun Sejahtera",
        tanggal: "2026-11-18",
        pupuk: "NPK",
        keterangan: "Pemupukan berkala"
    },
    {
        id: 2,
        lahan: "Kebun Makmur",
        tanggal: "2026-12-18",
        pupuk: "Organik",
        keterangan: "Pemupukan berkala"
    },
    {
        id: 3,
        lahan: "Kebun Subur",
        tanggal: "2027-01-18",
        pupuk: "NPK",
        keterangan: "Pemupukan berkala"
    }
];

// Mengambil data dari Local Storage
let sahran_jadwal = JSON.parse(
    localStorage.getItem("sahran_jadwal")
);

if (!Array.isArray(sahran_jadwal)) {
    sahran_jadwal = sahran_data_awal;
    sahran_simpan_data();
}

// Fungsi menyimpan data
function sahran_simpan_data() {
    localStorage.setItem(
        "sahran_jadwal",
        JSON.stringify(sahran_jadwal)
    );
}

// Mengubah tanggal menjadi format Indonesia
function sahran_format_tanggal(tanggal) {
    return new Date(tanggal + "T00:00:00")
        .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

// Menghitung selisih hari
function sahran_selisih_hari(tanggal) {
    const sekarang = new Date();
    sekarang.setHours(0, 0, 0, 0);

    const target = new Date(tanggal + "T00:00:00");

    return Math.round(
        (target - sekarang) / (1000 * 60 * 60 * 24)
    );
}

// Menentukan status pemupukan
function sahran_status(tanggal) {
    const selisih = sahran_selisih_hari(tanggal);

    if (selisih < 0) {
        return "Terlambat";
    } else if (selisih === 0) {
        return "Hari Ini";
    } else {
        return "Terjadwal";
    }
}

// Menampilkan jadwal ke tabel
function sahran_tampilkan_jadwal() {

    const tabel = document.getElementById(
        "sahran_daftar_jadwal"
    );

    if (!tabel) return;

    tabel.innerHTML = "";

    sahran_jadwal.sort((a, b) =>
        a.tanggal.localeCompare(b.tanggal)
    );

    sahran_jadwal.forEach((data, index) => {

        const baris = document.createElement("tr");

        const nilai = [
            index + 1,
            data.lahan,
            sahran_format_tanggal(data.tanggal),
            data.pupuk,
            data.keterangan,
            sahran_status(data.tanggal)
        ];

        nilai.forEach(teks => {
            const kolom = document.createElement("td");
            kolom.textContent = teks;
            baris.appendChild(kolom);
        });

        const kolom_aksi = document.createElement("td");
        const tombol = document.createElement("button");

        tombol.textContent = "Hapus";
        tombol.type = "button";
        tombol.dataset.id = data.id;
        tombol.className = "sahran_hapus";

        kolom_aksi.appendChild(tombol);
        baris.appendChild(kolom_aksi);

        tabel.appendChild(baris);
    });

    sahran_peng_ing_at();
}

// Pengingat otomatis
function sahran_peng_ing_at() {

    const pesan = document.getElementById(
        "sahran_pesan"
    );

    if (!pesan) return;

    const daftar = [...sahran_jadwal]
        .sort((a, b) =>
            a.tanggal.localeCompare(b.tanggal)
        );

    const hari_ini = daftar.find(data =>
        sahran_selisih_hari(data.tanggal) === 0
    );

    const berikutnya = daftar.find(data =>
        sahran_selisih_hari(data.tanggal) > 0
    );

    const terlambat = daftar.filter(data =>
        sahran_selisih_hari(data.tanggal) < 0
    );

    if (hari_ini) {
        pesan.textContent =
            "🔔 Hari ini waktunya pemupukan " +
            hari_ini.lahan + " menggunakan pupuk " +
            hari_ini.pupuk + "!";

    } else if (berikutnya) {

        const selisih = sahran_selisih_hari(
            berikutnya.tanggal
        );

        if (selisih <= 7) {
            pesan.textContent =
                "🔔 Pengingat! Pemupukan " +
                berikutnya.lahan +
                " akan dilakukan dalam " +
                selisih + " hari.";
        } else {
            pesan.textContent =
                "Belum ada jadwal pemupukan dalam 7 hari ke depan.";
        }

    } else if (terlambat.length > 0) {

        pesan.textContent =
            "⚠️ Ada " + terlambat.length +
            " jadwal pemupukan yang sudah melewati tanggal.";

    } else {
        pesan.textContent =
            "Belum ada jadwal pemupukan.";
    }
}

// Menambahkan jadwal baru
const sahran_form = document.getElementById(
    "sahran_form_pemupukan"
);

if (sahran_form) {

    sahran_form.addEventListener("submit", function(e) {

        e.preventDefault();

        const data_baru = {
            id: Date.now(),
            lahan: document.getElementById(
                "sahran_nama_lahan"
            ).value.trim(),

            tanggal: document.getElementById(
                "sahran_tanggal"
            ).value,

            pupuk: document.getElementById(
                "sahran_jenis_pupuk"
            ).value,

            keterangan: document.getElementById(
                "sahran_keterangan"
            ).value.trim() || "Pemupukan berkala"
        };

        sahran_jadwal.push(data_baru);

        sahran_simpan_data();
        sahran_tampilkan_jadwal();

        alert("Jadwal pemupukan berhasil disimpan!");

        sahran_form.reset();
    });
}

// Menghapus jadwal
const sahran_tabel = document.getElementById(
    "sahran_daftar_jadwal"
);

if (sahran_tabel) {

    sahran_tabel.addEventListener("click", function(e) {

        if (e.target.classList.contains("sahran_hapus")) {

            const id = Number(e.target.dataset.id);

            if (confirm("Yakin ingin menghapus jadwal ini?")) {

                sahran_jadwal = sahran_jadwal.filter(
                    data => data.id !== id
                );

                sahran_simpan_data();
                sahran_tampilkan_jadwal();
            }
        }
    });
}

// Menampilkan data saat halaman dibuka
sahran_tampilkan_jadwal();
