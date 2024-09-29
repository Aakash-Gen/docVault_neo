// // certificate-backend/server.js
// import express from 'express';
// import puppeteer from 'puppeteer';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import nodeHtmlToImage from 'node-html-to-image';

// const app = express();
// const port = 5001;

// app.use(cors());
// app.use(bodyParser.json());

// app.post('/generate-certificate', async (req, res) => {
//   const data = req.body;

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   let htmlTemplate;
//   try {
//     htmlTemplate = fs.readFileSync(path.resolve(__dirname, `${data.documentType}.html`), 'utf8');
//   } catch (error) {
//     console.error('Error reading the HTML template:', error);
//     return res.status(500).send('Error reading the HTML template');
//   }

//   // Replace placeholders in the HTML template with actual data
//   const html = htmlTemplate
//     .replace('{{dateOfIssue}}', data.dateOfIssue)
//     .replace('{{recipientName}}', data.recipientName)
//     .replace('{{course}}', data.course)
//     .replace('{{department}}', data.department)
//     .replace('{{duration}}', data.duration)
//     .replace('{{reason}}', data.reason)
//     .replace('{{field}}', data.field)
//     .replace('{{position}}', data.position)
//     .replace('{{authorizedName}}', data.authorizedName)
//     .replace('{{jobTitle}}', data.jobTitle);

//   // Launch Puppeteer and create a screenshot of the generated HTML
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true, // Change to false if you want to see the browser action
//     });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0' }); // Use setContent to load the HTML

//     // Generate the image buffer
//     const buffer = await nodeHtmlToImage({
//       type: 'png',
//     });


//     // Set the response headers and send the image
//     res.set('Content-Type', 'image/png');
//     res.set('Content-Disposition', 'attachment; filename=certificate.png');
//     res.send(buffer);
//   } catch (error) {
//     console.error('Error generating certificate:', error);
//     res.status(500).send('Error generating certificate');
//   } finally {
//     if (browser) {
//       await browser.close(); // Ensure the browser is closed
//     }
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodeHtmlToImage from 'node-html-to-image';

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-certificate', async (req, res) => {
  const data = req.body;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let htmlTemplate;
  try {
    htmlTemplate = fs.readFileSync(path.resolve(__dirname, `${data.documentType}.html`), 'utf8');
  } catch (error) {
    console.error('Error reading the HTML template:', error);
    return res.status(500).send('Error reading the HTML template');
  }

  // Replace placeholders in the HTML template with actual data
  const html = htmlTemplate
    .replace('{{dateOfIssue}}', data.dateOfIssue)
    .replace('{{recipientName}}', data.recipientName)
    .replace('{{course}}', data.course)
    .replace('{{department}}', data.department)
    .replace('{{duration}}', data.duration)
    .replace('{{reason}}', data.reason)
    .replace('{{field}}', data.field)
    .replace('{{position}}', data.position)
    .replace('{{authorizedName}}', data.authorizedName)
    .replace('{{jobTitle}}', data.jobTitle);

  // Use node-html-to-image to generate an image from the HTML string
  try {
    const buffer = await nodeHtmlToImage({
      output: './certificate.png', // If you want to save the file, or use buffer for sending directly
      html, // Pass the HTML content here
      type: 'png', // Set the image type
    });

    // Set the response headers and send the image
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename=certificate.png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).send('Error generating certificate');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
