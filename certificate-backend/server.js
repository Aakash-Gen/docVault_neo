// certificate-backend/server.js
import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';


const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-certificate', async (req, res) => {
  const data = req.body;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const htmlTemplate = fs.readFileSync(path.resolve(__dirname, 'Medical.html'), 'utf8');
  console.log('template loaded')

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

  try {

    const imageFile = await htmlToImage.toPng(html)
    // const buffer = await nodeHtmlToImage({
    //   html: html,
    //   type: 'png',
    // });
    console.log('image created')

    console.log(imageFile)
    console.log("hello")

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename=certificate.png');
    console.log('sending image')
    res.send(imageFile);
  } catch (error) {
    res.status(500).send('Error generating certificate');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});