const {Client} = require('pg')
const http = require('http');
const querystring = require('querystring');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'db_dokar_testing',
    password: '    ',
    port: 5432
})

client.connect();

const server = http.createServer((req, res) => {
    if (req.method == 'GET' && req.url == '/api/employees') {
        client.query('SELECT * FROM admin_account', (err, result) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error fetching data from database' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows));
            }
        });
    }  else if (req.method === 'POST' && req.url === '/api/employees') {
    // Menangani permintaan POST untuk menambahkan data baru ke employee
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // INPUT DATA DENGAN MENGGUNAKAN FORM-URLENCODED
        const { employee_id, company_id, password } = querystring.parse(body);

        // Validasi input
        if (!employee_id ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Employee ID are required' }));
            return;
        }

        // Validasi input
        if (!company_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Company ID are required' }));
            return;
        }
        
        // Validasi input
        if (!password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Password are required' }));
            return;
        }
        

        // Masukkan data ke dalam database
        client.query(
            'INSERT INTO admin_account (employee_id, company_id, password) VALUES ($1, $2, $3)', 
            [employee_id, company_id, password], 
            (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error inserting data into database' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Data inserted successfully' }));
                }
            }
        ); 
    });
} else if (req.method === 'DELETE' && req.url === '/api/employees') {
    // Menangani permintaan DELETE untuk menghapus data employee berdasarkan employee_id, company_id, dan password
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Mengambil parameter dari body
        const { employee_id, company_id, password } = querystring.parse(body);

        // Validasi input
        if (!employee_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Employee ID is required' }));
            return;
        }

        if (!company_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Company ID is required' }));
            return;
        }

        
        // Masukkan data ke dalam database
        client.query(
            'DELETE FROM admin_account WHERE employee_id = $1 AND company_id = $2',
            [employee_id, company_id],
            (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error deleting data from database' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Data deleted successfully' }));
                }
            }
        );
    });
} else if (req.method === 'PUT' && req.url === '/api/employees') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { employee_id, company_id, password } = querystring.parse(body);

        // Validasi input
        if (!employee_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Employee ID is required' }));
            return;
        }

        if (!company_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Company ID is required' }));
            return;
        }

        if (!password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Password is required' }));
            return;
        }

        // Masukkan data ke dalam database
        client.query(
            'UPDATE admin_account SET password = $1 WHERE employee_id = $2 AND company_id = $3',
            [password, employee_id, company_id],
            (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error updating data in database' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Password updated successfully' }));
                }
            }
        );
    });
}else  if (req.method === 'POST' && req.url === '/api/companies') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, latitude, longitude, radius } = querystring.parse(body);

            // Masukkan data ke dalam database, tanpa id_company karena auto-increment
            client.query(
                'INSERT INTO company_test (name, latitude, longitude, radius) VALUES ($1, $2, $3, $4)',
                [name, latitude, longitude, radius],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error inserting data into database' }));
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Data inserted successfully' }));
                    }
                }
            );
        });
    } else  if (req.method === 'POST' && req.url === '/api/absensi') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { latitude, longitude, id_company } = querystring.parse(body);

            // Validasi input
            if (!latitude || !longitude || !id_company) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Latitude, longitude, and company ID are required' }));
                return;
            }

            // Ambil data company berdasarkan id_company
            client.query('SELECT latitude, longitude, radius FROM company_test WHERE id_company = $1', [id_company], (err, result) => {
                if (err) {
                    console.error('Error fetching company data:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error fetching company data from database' }));
                    return;
                }

                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Company not found' }));
                    return;
                }

                const company = result.rows[0];
                const companyLatLng = {
                    lat: parseFloat(company.latitude),
                    lng: parseFloat(company.longitude),
                };

                const employeeLatLng = {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                };

                // Hitung jarak menggunakan haversine
                const haversine = require('haversine-distance'); // Pastikan library haversine-distance sudah terinstall
                const distance = haversine(companyLatLng, employeeLatLng); // Jarak dalam meter
                const radius = parseFloat(company.radius);

                // Validasi jarak
                if (distance <= radius) {
                    // Absensi berhasil
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Attendance recorded successfully', distance: distance }));
                } else {
                    // Absensi gagal karena di luar radius
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Out of allowed radius', distance: distance }));
                }
            });
        });
    } else
    {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});



const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
