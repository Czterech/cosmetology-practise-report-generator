const path = require('path');
require('dotenv').config();
const { logSummary, generateDay, generateCalendar } = require('./src/helpers');
const { readExcel } = require('./src/services');
const generatePdf = require('./src/pdfGenerator');

const getData = async () => {
  const calendar = generateCalendar();
  const rows = await readExcel(path.join(__dirname, process.env.EXCEL_PATH));

  const data = {};
  for (const day of calendar.dates) {
    data[day.dateStr] = await generateDay(day.hours, rows);
  }

  logSummary(calendar, data);

  return data;
};

const generateReport = async () => {
  const data = await getData();
  await generatePdf(data);
};

generateReport();
