
/* ===== PENGINGAT OTOMATIS PEMUPUKAN ===== */

const sahran_jadwal = document.querySelectorAll(
    ".sahran_table tr[data-tanggal]"
);

const sahran_pesan = document.getElementById(
    "sahran_pesan"
);

if (sahran_pesan && sahran_jadwal.length > 0) {

    const sahran_hariIni = new Date();
    sahran_hariIni.setHours(0, 0, 0, 0);

    let sahran_akanDatang = [];

    sahran_jadwal.forEach((baris) => {

        const tanggal = baris.dataset.tanggal;
        const [tahun, bulan, hari] = tanggal.split("-").map(Number);

        const tanggalPupuk = new Date(
            tahun, bulan - 1, hari
        );

        const selisih = Math.round(
            (tanggalPupuk - sahran_hariIni) /
            (1000 * 60 * 60 * 24)
        );

        const status = baris.cells[5];

        if (selisih < 0) {
            status.textContent = "Perlu diperiksa";
        } 
        else if (selisih === 0) {
            status.textContent = "Hari ini";
        } 
        else {
            status.textContent = "Terjadwal";
        }

        if (selisih >= 0) {
            sahran_akanDatang.push({
                nama: baris.cells[1].textContent,
                tanggal: tanggal,
                selisih: selisih
            });
        }
    });

    sahran_akanDatang.sort(
        (a, b) => a.selisih - b.selisih
    );

    const jadwalTerdekat = sahran_akanDatang[0];

    if (!jadwalTerdekat) {

        sahran_pesan.textContent =
            "Tidak ada jadwal pemupukan mendatang.";

    } else if (jadwalTerdekat.selisih === 0) {

        sahran_pesan.textContent =
            "🔔 Hari ini jadwal pemupukan di " +
            jadwalTerdekat.nama + "!";

    } else if (jadwalTerdekat.selisih <= 7) {

        sahran_pesan.textContent =
            "🔔 Pengingat! Pemupukan " +
            jadwalTerdekat.nama +
            " akan dilakukan dalam " +
            jadwalTerdekat.selisih + " hari.";

    } else {

        sahran_pesan.textContent =
            "Jadwal pemupukan berikutnya di " +
            jadwalTerdekat.nama +
            " masih " + jadwalTerdekat.selisih +
            " hari lagi.";
    }
}

/* ===== FORM KONTAK KAKAO FARM ===== */

const sahran_form = document.getElementById("sahran_form");

if (sahran_form) {

    sahran_form.addEventListener("submit", function(event) {

        event.preventDefault();

        const nama = document.getElementById("sahran_nama").value;
        const email = document.getElementById("sahran_email").value;
        const pesan = document.getElementById("sahran_pesan_kontak").value;

        const hasil = document.getElementById("sahran_hasil");

        hasil.textContent =
            "Terima kasih " + nama +
            "! Formulir Anda berhasil divalidasi.";

        sahran_form.reset();

    });

}
