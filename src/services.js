const readXlsxFile = require('read-excel-file/node');
const { basic, opinions } = require('./pdfGenerator/schemas');

const readExcel = async (filePath) => {
  const [basicData, opinionsData] = await Promise.all([
    readXlsxFile(filePath, { schema: basic, sheet: 1 }),
    readXlsxFile(filePath, { schema: opinions, sheet: 2 }),
  ]);

  return {
    basic: basicData.rows,
    opinions: opinionsData.rows,
  };
};

module.exports = {
  readExcel,
};
