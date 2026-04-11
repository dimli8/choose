// Script to find Node.js and start the project
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findNodeJS() {
  const possiblePaths = [
    'C:\\Program Files\\nodejs\\node.exe',
    'C:\\Program Files (x86)\\nodejs\\node.exe',
    process.env.USERPROFILE + '\\AppData\\Roaming\\nvm\\current\\node.exe',
    process.env.LOCALAPPDATA + '\\Programs\\nodejs\\node.exe'
  ];

  for (const nodePath of possiblePaths) {
    if (fs.existsSync(nodePath)) {
      return nodePath;
    }
  }

  // Try to use where command
  try {
    const result = execSync('where node', { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    return null;
  }
}

const nodePath = findNodeJS();

if (nodePath) {
  console.log('Found Node.js at:', nodePath);
  
  // Start backend
  console.log('Starting backend...');
  const backendPath = path.join(__dirname, 'backend');
  execSync(`"${nodePath}" "${path.join(__dirname, 'backend', 'node_modules', '.bin', 'tsx')}" watch server.ts`, {
    cwd: backendPath,
    stdio: 'inherit',
    detached: true
  });
  
  console.log('Backend started on http://localhost:3002');
  
  // Start frontend
  console.log('Starting frontend...');
  const frontendPath = path.join(__dirname, 'frontend');
  execSync(`"${nodePath}" "${path.join(__dirname, 'frontend', 'node_modules', '.bin', 'vite')}"`, {
    cwd: frontendPath,
    stdio: 'inherit',
    detached: true
  });
  
  console.log('Frontend started on http://localhost:5173');
} else {
  console.error('Node.js not found!');
  console.error('Please install Node.js from https://nodejs.org/');
}
