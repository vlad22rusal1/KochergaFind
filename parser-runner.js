const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const INTERVAL_MINUTES = 120;
const LOG_DIR = path.join(__dirname, 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

function getCurrentLogFile() {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  return path.join(LOG_DIR, `parser_${dateString}.log`);
}

function runParser() {
  const startTime = new Date();
  const logFile = getCurrentLogFile();
  const timestamp = startTime.toISOString();
  
  console.log(`[${timestamp}] Запуск парсера...`);
  
  const child = exec('node main.js', (error, stdout, stderr) => {
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    const logEntry = [
      `==== [${timestamp}] ====`,
      `Длительность: ${duration} сек`,
      stdout,
      stderr,
      error ? `ОШИБКА: ${error.message}` : 'Успешно завершён',
      `\n`
    ].join('\n');
    
    fs.appendFileSync(logFile, logEntry, 'utf-8');
    
    if (error) {
      console.error(`[${timestamp}] Ошибка: ${error.message}`);
    } else {
      console.log(`[${timestamp}] Парсер успешно выполнен за ${duration} сек`);
    }
  });

  process.on('SIGINT', () => {
    child.kill();
    process.exit();
  });
}

function startScheduler() {
  runParser();
  
  const intervalMs = INTERVAL_MINUTES * 60 * 1000;
  setInterval(runParser, intervalMs);
  
  console.log(`Парсер будет запускаться каждые ${INTERVAL_MINUTES} минут`);
}

startScheduler();