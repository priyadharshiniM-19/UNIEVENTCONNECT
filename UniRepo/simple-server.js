// Simple HTTP server to demonstrate the project
import http from 'http';

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  
  if (req.url === '/api/test') {
    // API endpoint
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'API is working!' }));
  } else {
    // Main page
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Full Stack Project</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .card { background: #f4f4f4; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Full Stack Project</h1>
            <div class="card">
              <h2>Welcome to the Demo Server</h2>
              <p>This is a simple HTTP server running your full stack project.</p>
              <p>The API is available at <a href="/api/test">/api/test</a></p>
            </div>
            <div class="card">
              <h2>Project Structure</h2>
              <p>Your project includes:</p>
              <ul>
                <li>React frontend in the client directory</li>
                <li>Node.js backend in the server directory</li>
                <li>PostgreSQL database configured in .env</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});