// certificate-backend/server.js
import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-certificate', async (req, res) => {
  const data = req.body;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const htmlTemplate = fs.readFileSync(path.resolve(__dirname, `${data.documentType}.html`), 'utf8');

  const html = htmlTemplate
    .replace('{{dateOfIssue}}', data.dateOfIssue)
    .replace('{{recipientName}}', data.recipientName)
    .replace('{{course}}', data.course)
    .replace('{{department}}', data.department)
    .replace('{{duration}}', data.duration)
    .replace('{{reason}}', data.reason)
    .replace('{{field}}', data.field)
    .replace('{{position}}', data.position)
    .replace('{{purpose}}', data.purpose)
    .replace('{{authorizedName}}', data.authorizedName)
    .replace('{{jobTitle}}', data.jobTitle)

  try {
    const buffer = await nodeHtmlToImage({
      html: html,
      type: 'png',
    });

    console.log(buffer)
    console.log("hello")

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename=certificate.png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Error generating certificate');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
