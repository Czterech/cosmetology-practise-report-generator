const { readFile } = require('fs/promises');
const path = require('path');
const puppeteer = require('puppeteer');
const hb = require('handlebars');

const getTemplateHtml = async () => {
  console.log('Loading template file in memory');
  try {
    const invoicePath = path.resolve('src/pdfGenerator/template.html');
    return await readFile(invoicePath, 'utf8');
  } catch (err) {
    throw new Error({ message: 'Could not load html template', error: err });
  }
};

const generatePdf = async (data = {}) => {
  try {
    const res = await getTemplateHtml();
    console.log('Compiling the template with handlebars');
    const template = hb.compile(res, { strict: true });
    const html = template({ data });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMediaType('print');
    await page.addStyleTag({ content: '@page { size: auto; }' });

    await page.pdf({
      path: process.env.RES_FILE_PATH,
      format: 'A4',
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });
    await browser.close();
    console.log('PDF Generated');
  } catch (err) {
    console.error(err);
  }
};

module.exports = generatePdf;
