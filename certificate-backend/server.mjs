// certificate-backend/server.js
import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import axios from 'axios';

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

app.post('/generate-certificate', async (req, res) => {
  const data = req.body;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const htmlTemplate = fs.readFileSync(path.resolve(__dirname, `${data.documentType}.html`), 'utf8');

  const html = htmlTemplate
    .replace('{{dateOfIssue}}', getCurrentDate())
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

    // console.log(buffer)
    // console.log("hello")

    // res.set('Content-Type', 'image/png');
    // res.set('Content-Disposition', 'attachment; filename=certificate.png');
    // res.send(buffer);
    const uniqueId = uuidv4();
    const filePath = path.join(__dirname, `certificate-${uniqueId}.png`);
    fs.writeFileSync(filePath, buffer);

    // Step 3: Upload the file to Pinata using FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), `certificate-${uniqueId}.png`);

    const pinataApiKey = '44b8116655500ad9dbfc';
    const pinataSecretApiKey = '50109d2afc19a6e0e5d0443058289373a1a767fa2cec5e08ae209377624e4491';

    const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    const imageIpfsHash = pinataResponse.data.IpfsHash;
    console.log('Image uploaded to IPFS:', `https://shoulder-possible-can.quicknode-ipfs.com/ipfs/${imageIpfsHash}`);

    // Step 4 (Optional): Delete the file after successful upload
    fs.unlinkSync(filePath);

    // Step 5: Send the IPFS URL back to the client
    res.json({ hash: imageIpfsHash });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error generating certificate');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
