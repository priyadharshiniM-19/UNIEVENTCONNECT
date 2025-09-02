// Full stack server implementation
import { createServer } from 'http';

// Create a simple HTTP server
const server = createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Set content type based on the request path
  const isApi = req.url.startsWith('/api/');
  if (isApi) {
    res.setHeader('Content-Type', 'application/json');
  } else {
    res.setHeader('Content-Type', 'text/html');
  }

  // Handle API routes
  if (req.url === '/api/test') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'API is working!' }));
    return;
  }
  
  if (req.url === '/api/students') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, name: 'John Doe', reg_number: 'S12345' },
      { id: 2, name: 'Jane Smith', reg_number: 'S67890' },
    ]));
    return;
  }
  
  if (req.url === '/api/colleges') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, name: 'Engineering College' },
      { id: 2, name: 'Business School' },
    ]));
    return;
  }
  
  if (req.url === '/api/events') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, title: 'Tech Conference', date: '2023-06-15' },
      { id: 2, title: 'Career Fair', date: '2023-07-20' },
    ]));
    return;
  }

  // Serve the main HTML page for all other routes
  if (req.url === '/' || !isApi) {
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>UniRepo - Full Stack Project</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            header { background: #4a6da7; color: white; padding: 1rem; }
            nav { background: #f4f4f4; padding: 1rem; }
            nav a { margin-right: 15px; text-decoration: none; color: #333; }
            .card { background: white; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
            table { width: 100%; border-collapse: collapse; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <header>
            <div class="container">
              <h1>UniRepo - University Management System</h1>
            </div>
          </header>
          <nav>
            <div class="container">
              <a href="#">Dashboard</a>
              <a href="#students">Students</a>
              <a href="#colleges">Colleges</a>
              <a href="#events">Events</a>
              <a href="/api/test">API Test</a>
            </div>
          </nav>
          <div class="container">
            <div class="card">
              <h2>Welcome to UniRepo</h2>
              <p>This is a full stack application for university management.</p>
              <p>The backend is running with Node.js and simulated database.</p>
            </div>
            
            <h2 id="students">Students</h2>
            <div class="card">
              <table id="students-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Registration Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan="3">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            
            <h2 id="colleges">Colleges</h2>
            <div class="card">
              <table id="colleges-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan="2">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            
            <h2 id="events">Upcoming Events</h2>
            <div class="card">
              <table id="events-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan="3">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <script>
            // Function to fetch data and update table
            function fetchAndDisplayData(endpoint, tableId, columns) {
              fetch('/api/' + endpoint)
                .then(response => response.json())
                .then(data => {
                  const tbody = document.querySelector('#' + tableId + ' tbody');
                  tbody.innerHTML = '';
                  
                  if (data.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.setAttribute('colspan', columns.length);
                    cell.textContent = 'No data available';
                    row.appendChild(cell);
                    tbody.appendChild(row);
                    return;
                  }
                  
                  data.forEach(item => {
                    const row = document.createElement('tr');
                    
                    columns.forEach(column => {
                      const cell = document.createElement('td');
                      cell.textContent = item[column];
                      row.appendChild(cell);
                    });
                    
                    tbody.appendChild(row);
                  });
                })
                .catch(error => {
                  console.error('Error fetching ' + endpoint + ':', error);
                  const tbody = document.querySelector('#' + tableId + ' tbody');
                  tbody.innerHTML = '';
                  
                  const row = document.createElement('tr');
                  const cell = document.createElement('td');
                  cell.setAttribute('colspan', columns.length);
                  cell.textContent = 'Error loading data';
                  row.appendChild(cell);
                  tbody.appendChild(row);
                });
            }
            
            // Fetch and display data for each table
            fetchAndDisplayData('students', 'students-table', ['id', 'name', 'reg_number']);
            fetchAndDisplayData('colleges', 'colleges-table', ['id', 'name']);
            fetchAndDisplayData('events', 'events-table', ['id', 'title', 'date']);
          </script>
        </body>
      </html>
    `);
    return;
  }

  // Handle 404 for unknown routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Full stack server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});