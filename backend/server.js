const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execSync } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  let childProcess = null;
  let currentTmpDir = null;

  socket.on('run_code', ({ code, language }) => {
    // Kill existing process if any
    if (childProcess) {
      childProcess.kill();
      childProcess = null;
    }
    if (currentTmpDir) {
      try { fs.rmSync(currentTmpDir, { recursive: true, force: true }); } catch (e) {}
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandbox-'));
    currentTmpDir = tmpDir;
    let command = '';
    let args = [];
    
    if (language === 'python') {
      const filePath = path.join(tmpDir, 'script.py');
      fs.writeFileSync(filePath, code);
      command = 'python3';
      args = ['-u', filePath]; // -u forces unbuffered stdout/stderr
    } else if (language === 'c' || language === 'cpp') {
      const ext = language === 'c' ? 'c' : 'cpp';
      const compiler = language === 'c' ? 'gcc' : 'g++';
      const filePath = path.join(tmpDir, `main.${ext}`);
      const outPath = path.join(tmpDir, 'main.out');
      fs.writeFileSync(filePath, code);
      
      try {
        // Compile synchronously before executing
        execSync(`${compiler} "${filePath}" -o "${outPath}"`, { stdio: 'pipe' });
        command = outPath;
        args = [];
      } catch (err) {
        socket.emit('output', `\x1b[31mCompilation Error:\n${err.stderr ? err.stderr.toString() : err.message}\x1b[0m\n`);
        socket.emit('exit', { exitCode: 1 });
        return;
      }
    } else {
      socket.emit('output', `\x1b[31mUnsupported language: ${language}\x1b[0m\n`);
      return;
    }

    // Start process
    childProcess = spawn(command, args, { cwd: tmpDir });

    childProcess.stdout.on('data', (data) => {
      socket.emit('output', data.toString());
    });

    childProcess.stderr.on('data', (data) => {
      socket.emit('output', `\x1b[31m${data.toString()}\x1b[0m`);
    });

    childProcess.on('close', (code) => {
      socket.emit('exit', { exitCode: code });
      childProcess = null;
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
      currentTmpDir = null;
    });

    childProcess.on('error', (err) => {
      socket.emit('output', `\x1b[31mFailed to start process: ${err.message}\x1b[0m\n`);
    });
  });

  // Receive keystrokes from frontend terminal
  socket.on('input', (data) => {
    if (childProcess && childProcess.stdin && childProcess.stdin.writable) {
      // If the user presses 'Enter' in xterm, it sends '\r'. 
      // standard child_process stdin usually expects '\n' for line buffering.
      const normalizedData = data.replace(/\r/g, '\n');
      childProcess.stdin.write(normalizedData);
      
      // Echo the input back to the terminal so the user sees what they typed
      // Convert \r to \r\n so the terminal moves to the next line when Enter is pressed
      socket.emit('output', data.replace(/\r/g, '\r\n'));
    }
  });

  socket.on('disconnect', () => {
    if (childProcess) {
      childProcess.kill();
    }
    if (currentTmpDir) {
      try { fs.rmSync(currentTmpDir, { recursive: true, force: true }); } catch (e) {}
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend Execution Server running on port ${PORT}`);
});
