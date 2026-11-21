
// ===================================
// SISTEM JADWAL PEMUPUKAN KAKAO
// KAKAO FARM - SAHRAN
// ===================================

// DATA AWAL
const sahran_data_awal = [
    {
        id: 1,
        lahan: "Kebun Sejahtera",
        tanggal: "2026-11-18",
        pupuk: "NPK",
        keterangan: "Pemupukan berkala",
        selesai: false,
        tanggal_realisasi: ""
    },
    {
        id: 2,
        lahan: "Kebun Makmur",
        tanggal: "2026-12-18",
        pupuk: "Organik",
        keterangan: "Pemupukan berkala",
        selesai: false,
        tanggal_realisasi: ""
    },
    {
        id: 3,
        lahan: "Kebun Subur",
        tanggal: "2027-01-18",
        pupuk: "NPK",
        keterangan: "Pemupukan berkala",
        selesai: false,
        tanggal_realisasi: ""
    }
];

// MENGAMBIL DATA LOCAL STORAGE
let sahran_jadwal;

try {
    sahran_jadwal = JSON.parse(
        localStorage.getItem("sahran_jadwal")
    );
} catch (error) {
    sahran_jadwal = null;
}

if (!Array.isArray(sahran_jadwal)) {
    sahran_jadwal = sahran_data_awal;
}

// MENYESUAIKAN DATA LAMA
sahran_jadwal = sahran_jadwal.map(data => ({
    ...data,
    selesai: data.selesai === true,
    tanggal_realisasi: data.tanggal_realisasi || ""
}));

// MENYIMPAN DATA
function sahran_simpan_data() {
    localStorage.setItem(
        "sahran_jadwal",
        JSON.stringify(sahran_jadwal)
    );
}

// FORMAT TANGGAL INDONESIA
function sahran_format_tanggal(tanggal) {
    if (!tanggal) return "-";

    return new Date(tanggal + "T00:00:00")
        .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

// TANGGAL HARI INI
function sahran_hari_ini() {
    const sekarang = new Date();

    const tahun = sekarang.getFullYear();
    const bulan = String(
        sekarang.getMonth() + 1
    ).padStart(2, "0");

    const hari = String(
        sekarang.getDate()
    ).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}

// MENGHITUNG SELISIH HARI
function sahran_selisih_hari(tanggal) {
    const sekarang = new Date(
        sahran_hari_ini() + "T00:00:00"
    );

    const target = new Date(
        tanggal + "T00:00:00"
    );

    return Math.round(
        (target - sekarang) / (1000 * 60 * 60 * 24)
    );
}

// MENENTUKAN STATUS
function sahran_status(data) {

    if (data.selesai) {
        return "Sudah Dipupuk";
    }

    const selisih = sahran_selisih_hari(data.tanggal);

    if (selisih < 0) {
        return "Terlambat";
    }

    if (selisih === 0) {
        return "Hari Ini";
    }

    return "Terjadwal";
}

// MEMBUAT TOMBOL
function sahran_buat_tombol(teks, kelas, id) {

    const tombol = document.createElement("button");

    tombol.type = "button";
    tombol.textContent = teks;
    tombol.className = kelas;
    tombol.dataset.id = id;

    return tombol;
}

// MENAMPILKAN JADWAL
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
            data.keterangan || "-"
        ];

        nilai.forEach(teks => {

            const kolom = document.createElement("td");

            kolom.textContent = teks;
            baris.appendChild(kolom);

        });

        // KOLOM STATUS
        const kolom_status = document.createElement("td");

        const status = document.createElement("span");

        status.textContent = sahran_status(data);
        status.className = "sahran_status";

        if (data.selesai) {
            status.style.color = "#16803c";
            status.style.fontWeight = "bold";
        } else if (sahran_status(data) === "Terlambat") {
            status.style.color = "#c0392b";
            status.style.fontWeight = "bold";
        } else if (sahran_status(data) === "Hari Ini") {
            status.style.color = "#d97706";
            status.style.fontWeight = "bold";
        }

        kolom_status.appendChild(status);

        // TANGGAL REALISASI
        if (data.selesai) {

            const realisasi = document.createElement("small");

            realisasi.textContent =
                "Realisasi: " +
                sahran_format_tanggal(data.tanggal_realisasi);

            realisasi.style.display = "block";
            realisasi.style.marginTop = "5px";

            kolom_status.appendChild(realisasi);
        }

        baris.appendChild(kolom_status);

        // KOLOM AKSI
        const kolom_aksi = document.createElement("td");

        kolom_aksi.style.minWidth = "180px";

        // TOMBOL EDIT
        const tombol_edit = sahran_buat_tombol(
            "Edit",
            "sahran_edit",
            data.id
        );

        kolom_aksi.appendChild(tombol_edit);

        // TOMBOL STATUS
        if (data.selesai) {

            const tombol_batal = sahran_buat_tombol(
                "Batalkan",
                "sahran_batal",
                data.id
            );

            kolom_aksi.appendChild(tombol_batal);

        } else {

            const tombol_selesai = sahran_buat_tombol(
                "Sudah Dipupuk",
                "sahran_selesai",
                data.id
            );

            kolom_aksi.appendChild(tombol_selesai);
        }

        // TOMBOL HAPUS
        const tombol_hapus = sahran_buat_tombol(
            "Hapus",
            "sahran_hapus",
            data.id
        );

        kolom_aksi.appendChild(tombol_hapus);

        baris.appendChild(kolom_aksi);

        tabel.appendChild(baris);
    });

    sahran_simpan_data();

    sahran_peng_ing_at();
}

// PENGINGAT OTOMATIS
function sahran_peng_ing_at() {

    const pesan = document.getElementById(
        "sahran_pesan"
    );

    if (!pesan) return;

    const daftar = sahran_jadwal
        .filter(data => !data.selesai)
        .sort((a, b) =>
            a.tanggal.localeCompare(b.tanggal)
        );

    const terlambat = daftar.find(data =>
        sahran_selisih_hari(data.tanggal) < 0
    );

    const hari_ini = daftar.find(data =>
        sahran_selisih_hari(data.tanggal) === 0
    );

    const berikutnya = daftar.find(data =>
        sahran_selisih_hari(data.tanggal) > 0
    );

    if (terlambat) {

        pesan.textContent =
            "⚠️ Jadwal pemupukan " +
            terlambat.lahan +
            " sudah terlambat. Segera lakukan pemupukan!";

    } else if (hari_ini) {

        pesan.textContent =
            "🔔 Hari ini waktunya pemupukan " +
            hari_ini.lahan +
            " menggunakan pupuk " +
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

    } else {

        pesan.textContent =
            "✅ Semua jadwal pemupukan sudah selesai atau belum ada jadwal.";
    }
}

// MENAMBAHKAN JADWAL BARU
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
            ).value.trim() || "Pemupukan berkala",

            selesai: false,

            tanggal_realisasi: ""
        };

        sahran_jadwal.push(data_baru);

        sahran_simpan_data();
        sahran_tampilkan_jadwal();

        alert("Jadwal pemupukan berhasil disimpan!");

        sahran_form.reset();
    });
}

// AKSI EDIT, HAPUS, DAN STATUS
const sahran_tabel = document.getElementById(
    "sahran_daftar_jadwal"
);

if (sahran_tabel) {

    sahran_tabel.addEventListener("click", function(e) {

        const tombol = e.target.closest("button");

        if (!tombol) return;

        const id = Number(tombol.dataset.id);

        const data = sahran_jadwal.find(
            item => item.id === id
        );

        if (!data) return;

        // EDIT JADWAL
        if (tombol.classList.contains("sahran_edit")) {

            const lahan = prompt(
                "Ubah nama lahan:",
                data.lahan
            );

            if (lahan === null) return;

            if (!lahan.trim()) {
                alert("Nama lahan tidak boleh kosong!");
                return;
            }

            const tanggal = prompt(
                "Ubah tanggal pemupukan (YYYY-MM-DD):",
                data.tanggal
            );

            if (tanggal === null) return;

            if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal) ||
                Number.isNaN(new Date(tanggal + "T00:00:00").getTime()) ||
                new Date(tanggal + "T00:00:00").toISOString().slice(0, 10) !== tanggal) {
                alert("Format tanggal tidak valid!");
                return;
            }

            const pupuk = prompt(
                "Ubah jenis pupuk:",
                data.pupuk
            );

            if (pupuk === null) return;

            if (!pupuk.trim()) {
                alert("Jenis pupuk tidak boleh kosong!");
                return;
            }

            const keterangan = prompt(
                "Ubah keterangan:",
                data.keterangan
            );

            if (keterangan === null) return;

            data.lahan = lahan.trim();
            data.tanggal = tanggal;
            data.pupuk = pupuk.trim();
            data.keterangan = keterangan.trim();

            sahran_simpan_data();
            sahran_tampilkan_jadwal();

            alert("Jadwal berhasil diperbarui!");
        }

        // TANDAI SUDAH DIPUPUK
        else if (
            tombol.classList.contains("sahran_selesai")
        ) {

            if (confirm(
                "Apakah pemupukan di " +
                data.lahan +
                " sudah benar-benar dilakukan?"
            )) {

                data.selesai = true;
                data.tanggal_realisasi = sahran_hari_ini();

                sahran_simpan_data();
                sahran_tampilkan_jadwal();

                alert("Pemupukan berhasil ditandai selesai!");
            }
        }

        // BATALKAN STATUS
        else if (
            tombol.classList.contains("sahran_batal")
        ) {

            if (confirm(
                "Batalkan status Sudah Dipupuk?"
            )) {

                data.selesai = false;
                data.tanggal_realisasi = "";

                sahran_simpan_data();
                sahran_tampilkan_jadwal();

                alert("Status berhasil dikembalikan!");
            }
        }

        // HAPUS JADWAL
        else if (
            tombol.classList.contains("sahran_hapus")
        ) {

            if (confirm(
                "Yakin ingin menghapus jadwal pemupukan ini?"
            )) {

                sahran_jadwal = sahran_jadwal.filter(
                    item => item.id !== id
                );

                sahran_simpan_data();
                sahran_tampilkan_jadwal();

                alert("Jadwal berhasil dihapus!");
            }
        }
    });
}

// MENAMPILKAN DATA SAAT HALAMAN DIBUKA
sahran_simpan_data();
sahran_tampilkan_jadwal();
