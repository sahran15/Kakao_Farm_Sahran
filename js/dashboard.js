
// DASHBOARD STATISTIK KAKAO FARM

function sahran_data_dashboard() {
    return JSON.parse(localStorage.getItem("sahran_data_panen")) || [];
}

// Mengambil data lahan
function sahran_data_lahan_dashboard() {
    return JSON.parse(localStorage.getItem("sahran_data_lahan")) || [];
}

function sahran_rupiah_dashboard(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// Menghitung ringkasan data
function sahran_ringkasan_dashboard() {
    const data = sahran_data_dashboard();
    const data_lahan = sahran_data_lahan_dashboard();

    let total_kg = 0;
    let total_pendapatan = 0;
    let total_luas = 0;
    let total_pohon = 0;

    const daftar_lahan = new Set();

    // Menghitung hasil panen dan pendapatan
    data.forEach(item => {
        total_kg += Number(item.jumlah) || 0;

        total_pendapatan +=
            (Number(item.jumlah) || 0) *
            (Number(item.harga) || 0);

        if (item.lahan) {
            daftar_lahan.add(item.lahan.trim().toLowerCase());
        }
    });

    // Menghitung luas dan jumlah pohon
    data_lahan.forEach(lahan => {
        total_luas += parseFloat(lahan.luas) || 0;
        total_pohon += parseInt(lahan.pohon) || 0;
    });

    document.getElementById("sahran_dashboard_kg").textContent =
        total_kg.toLocaleString("id-ID") + " Kg";

    document.getElementById("sahran_dashboard_rupiah").textContent =
        sahran_rupiah_dashboard(total_pendapatan);

    document.getElementById("sahran_dashboard_lahan").textContent =
        data_lahan.length + " Lahan";

    document.getElementById("sahran_dashboard_luas").textContent =
        total_luas.toLocaleString("id-ID", {
            maximumFractionDigits: 2
        }) + " Ha";

    document.getElementById("sahran_dashboard_pohon").textContent =
        total_pohon.toLocaleString("id-ID") + " Pohon";
}

// Membuat pilihan tahun grafik
function sahran_pilihan_tahun() {
    const data = sahran_data_dashboard();
    const pilihan = document.getElementById("sahran_tahun_grafik");
    const tahun_sekarang = new Date().getFullYear();

    const daftar_tahun = new Set([tahun_sekarang]);

    data.forEach(item => {
        if (item.tanggal) {
            daftar_tahun.add(Number(item.tanggal.substring(0, 4)));
        }
    });

    pilihan.innerHTML = "";

    [...daftar_tahun].sort((a, b) => b - a).forEach(tahun => {
        const opsi = document.createElement("option");
        opsi.value = tahun;
        opsi.textContent = tahun;
        pilihan.appendChild(opsi);
    });
}

// Menampilkan grafik hasil panen
function sahran_grafik_dashboard() {
    const data = sahran_data_dashboard();
    const tahun = document.getElementById("sahran_tahun_grafik").value;
    const area = document.getElementById("sahran_area_grafik");

    const nama_bulan = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    const jumlah_bulan = Array(12).fill(0);

    data.forEach(item => {
        if (item.tanggal && item.tanggal.startsWith(tahun + "-")) {
            const bulan = Number(item.tanggal.substring(5, 7)) - 1;

            if (bulan >= 0 && bulan < 12) {
                jumlah_bulan[bulan] += Number(item.jumlah) || 0;
            }
        }
    });

    const nilai_maksimum = Math.max(...jumlah_bulan, 1);

    area.innerHTML = "";

    jumlah_bulan.forEach((jumlah, index) => {
        const kolom = document.createElement("div");
        kolom.className = "sahran_kolom_grafik";

        const nilai = document.createElement("span");
        nilai.className = "sahran_nilai_grafik";
        nilai.textContent = jumlah.toLocaleString("id-ID") + " Kg";

        const batang = document.createElement("div");
        batang.className = "sahran_batang_grafik";
        batang.style.height =
            Math.max((jumlah / nilai_maksimum) * 180, 4) + "px";
        batang.title = nama_bulan[index] + ": " + jumlah + " Kg";

        const bulan = document.createElement("span");
        bulan.className = "sahran_label_bulan";
        bulan.textContent = nama_bulan[index];

        kolom.appendChild(nilai);
        kolom.appendChild(batang);
        kolom.appendChild(bulan);

        area.appendChild(kolom);
    });
}

// Menampilkan status kondisi kebun
function sahran_status_kondisi_dashboard() {
    const data_lahan = sahran_data_lahan_dashboard();
    const area = document.getElementById("sahran_status_kondisi");

    if (!area) return;

    area.innerHTML = "";

    if (data_lahan.length === 0) {
        area.textContent = "Belum ada data lahan yang terdaftar.";
        return;
    }

    const jumlah_kondisi = {};

    data_lahan.forEach(lahan => {
        const kondisi = (lahan.kondisi || "Belum diisi").trim();

        jumlah_kondisi[kondisi] =
            (jumlah_kondisi[kondisi] || 0) + 1;
    });

    Object.entries(jumlah_kondisi).forEach(([kondisi, jumlah]) => {
        const kartu = document.createElement("div");
        kartu.className = "sahran_stat_kartu";

        const judul = document.createElement("h3");
        judul.textContent = kondisi;

        const angka = document.createElement("p");
        angka.textContent = jumlah + " Lahan";

        kartu.appendChild(judul);
        kartu.appendChild(angka);

        area.appendChild(kartu);
    });
}


// Jalankan dashboard
sahran_pilihan_tahun();
sahran_ringkasan_dashboard();
sahran_grafik_dashboard();
sahran_status_kondisi_dashboard();

document.getElementById("sahran_tahun_grafik")
    .addEventListener("change", sahran_grafik_dashboard);
