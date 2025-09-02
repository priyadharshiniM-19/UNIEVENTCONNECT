// Simple script to start the server
require('dotenv').config();

const { exec } = require('child_process');

console.log('Starting the server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Database URL:', process.env.DATABASE_URL ? 'Configured' : 'Not configured');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Start the server based on environment
if (process.env.NODE_ENV === 'development') {
  console.log('Starting in development mode...');
  const server = exec('node server/index.js', { cwd: __dirname });
  
  server.stdout.on('data', (data) => {
    console.log(data);
  });
  
  server.stderr.on('data', (data) => {
    console.error(data);
  });
  
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
} else {
  console.log('Starting in production mode...');
  require('./dist/index.js');
}