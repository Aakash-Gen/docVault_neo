import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';




const app = express();
const port = 5002;
app.use(cors());


// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle image upload and detection
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    // Run the Python script to check for blurriness
    exec(`python3 detect_blur.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${stderr}`);
            return res.status(500).send(`Error: ${stderr}`);
        }
        const result = stdout.trim();
        console.log(`Python script output: ${stdout}`);
        res.json({ result });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// C:\\Python312\\python.exe detect_blur.py