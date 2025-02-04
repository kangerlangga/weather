// Ambil URL saat ini
const urlParams = new URLSearchParams(window.location.search);

// Ambil parameter tertentu
const adm = urlParams.get('adm');
console.log(adm);

document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm)}`;
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
            groupAndDisplayCuaca(data.data[0].cuaca);
        } catch (error) {
            console.error('Error:', error);
            cuacaData.innerHTML = '<h1 class="text-danger text-center">Gagal memuat data cuaca. Silakan coba lagi.</h1>';
        }
    }

    // Fungsi untuk menampilkan informasi lokasi
    function displayLokasi(lokasi) {
        lokasiInfo.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td><strong>Kode Wilayah</strong></td>
                                <td>${encodeURIComponent(adm)}</td>
                            </tr>
                            <tr>
                                <td><strong>Desa / Kelurahan</strong></td>
                                <td>${lokasi.desa}</td>
                            </tr>
                            <tr>
                                <td><strong>Kecamatan</strong></td>
                                <td>${lokasi.kecamatan}</td>
                            </tr>
                            <tr>
                                <td><strong>Kota / Kabupaten</strong></td>
                                <td>${lokasi.kotkab}</td>
                            </tr>
                            <tr>
                                <td><strong>Provinsi</strong></td>
                                <td>${lokasi.provinsi}</td>
                            </tr>
                            <tr>
                                <td><strong>Koordinat</strong></td>
                                <td>Lat ${lokasi.lat}, Lon ${lokasi.lon}</td>
                            </tr>
                            <tr>
                                <td><strong>Zona Waktu</strong></td>
                                <td>${lokasi.timezone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Fungsi untuk mengelompokkan data cuaca per hari
    function groupAndDisplayCuaca(cuaca) {
        if (!cuaca || cuaca.length === 0) {
            cuacaData.innerHTML = '<p class="text-warning">Data cuaca tidak tersedia.</p>';
            return;
        }

        // Kelompokkan data cuaca per hari
        const groupedData = {};
        cuaca.forEach((hari) => {
            hari.forEach((item) => {
                const date = item.local_datetime.split(' ')[0]; // Ambil tanggal saja
                if (!groupedData[date]) {
                    groupedData[date] = [];
                }
                groupedData[date].push(item);
            });
        });

        // Tampilkan data cuaca per hari
        let html = '';
        for (const date in groupedData) {
            html += `
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Tanggal: ${date}</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            ${groupedData[date].map((item) => `
                                <div class="col-md-6 mb-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <table class="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>Waktu</strong></td>
                                                        <td>:</td>
                                                        <td>${item.local_datetime.split(' ')[1]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Cuaca</strong></td>
                                                        <td>:</td>
                                                        <td>${item.weather_desc} 
                                                            <img src="${item.image}" alt="${item.weather_desc}" class="img-fluid" style="width: 50px; height: 50px;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Suhu</strong></td>
                                                        <td>:</td>
                                                        <td>${item.t}°C</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Kelembaban</strong></td>
                                                        <td>:</td>
                                                        <td>${item.hu}%</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Kecepatan Angin</strong></td>
                                                        <td>:</td>
                                                        <td>${item.ws} km/jam (${item.wd})</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Visibilitas</strong></td>
                                                        <td>:</td>
                                                        <td>${item.vs_text}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        cuacaData.innerHTML = html;
    }

    // Panggil fungsi fetchCuaca saat halaman dimuat
    fetchCuaca();
});