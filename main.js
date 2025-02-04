document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=35.15.08.1004';
    const lokasiInfo = document.getElementById('lokasi-info');
    const cuacaData = document.getElementById('cuaca-data');

    // Fungsi untuk mengambil data cuaca
    async function fetchCuaca() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Gagal mengambil data cuaca');
            }
            const data = await response.json();
            displayLokasi(data.lokasi);
            displayCuaca(data.data[0].cuaca);
        } catch (error) {
            console.error('Error:', error);
            cuacaData.innerHTML = '<p>Gagal memuat data cuaca. Silakan coba lagi.</p>';
        }
    }

    // Fungsi untuk menampilkan informasi lokasi
    function displayLokasi(lokasi) {
        lokasiInfo.innerHTML = `
            <p><strong>Lokasi:</strong> ${lokasi.desa}, ${lokasi.kecamatan}, ${lokasi.kotkab}, ${lokasi.provinsi}</p>
            <p><strong>Koordinat:</strong> Lat ${lokasi.lat}, Lng ${lokasi.lon}</p>
            <p><strong>Zona Waktu:</strong> ${lokasi.timezone}</p>
        `;
    }

    // Fungsi untuk menampilkan data cuaca
    function displayCuaca(cuaca) {
        if (!cuaca || cuaca.length === 0) {
            cuacaData.innerHTML = '<p>Data cuaca tidak tersedia.</p>';
            return;
        }

        let html = '';
        cuaca.forEach((hari) => {
            hari.forEach((item) => {
                html += `
                    <div class="weather-item">
                        <p><strong>Tanggal & Waktu:</strong> ${item.local_datetime}</p>
                        <p><strong>Cuaca:</strong> ${item.weather_desc} <img src="${item.image}" alt="${item.weather_desc}"></p>
                        <p><strong>Suhu:</strong> ${item.t}°C</p>
                        <p><strong>Kelembaban:</strong> ${item.hu}%</p>
                        <p><strong>Kecepatan Angin:</strong> ${item.ws} km/jam (${item.wd})</p>
                        <p><strong>Visibilitas:</strong> ${item.vs_text}</p>
                    </div>
                `;
            });
        });

        cuacaData.innerHTML = html;
    }

    // Panggil fungsi fetchCuaca saat halaman dimuat
    fetchCuaca();
});