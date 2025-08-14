#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting DuoTime development servers...');
console.log('📱 Backend server will start in a new terminal tab');
console.log('📱 Mobile server will start in another terminal tab');
console.log('');

// Function to run a command in a new VS Code terminal
function runInNewTerminal(command, title) {
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    // For Windows, use PowerShell to open new terminal
    const psCommand = `Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "${process.cwd()}"; Write-Host "${title}" -ForegroundColor Yellow; ${command}'`;
    spawn('powershell', ['-Command', psCommand], { stdio: 'inherit' });
  } else {
    // For Unix-like systems, use terminal emulator
    const terminalCommand = process.env.TERM_PROGRAM || 'gnome-terminal';

    if (terminalCommand === 'gnome-terminal') {
      spawn(
        'gnome-terminal',
        [
          '--',
          'bash',
          '-c',
          `cd "${process.cwd()}"; echo "${title}"; ${command}; exec bash`,
        ],
        { stdio: 'inherit' }
      );
    } else if (terminalCommand === 'iTerm.app') {
      spawn(
        'osascript',
        [
          '-e',
          `tell application "iTerm2" to create window with default profile`,
          '-e',
          `tell application "iTerm2" to tell current window to tell current session to write text "cd \\"${process.cwd()}\\"; echo \\"${title}\\"; ${command}"`,
        ],
        { stdio: 'inherit' }
      );
    } else {
      // Fallback for other terminals
      spawn(
        'xterm',
        ['-e', `cd "${process.cwd()}"; echo "${title}"; ${command}; exec bash`],
        { stdio: 'inherit' }
      );
    }
  }
}

// Start backend server in new terminal
setTimeout(() => {
  runInNewTerminal('npm run dev:backend', '🚀 DuoTime Backend Server');
}, 1000);

// Start mobile server in new terminal
setTimeout(() => {
  runInNewTerminal('npm run dev:mobile', '📱 DuoTime Mobile Server');
}, 2000);

console.log('✅ Development servers are starting in separate terminals...');
console.log(
  '💡 You can now switch between terminal tabs to monitor each server'
);
