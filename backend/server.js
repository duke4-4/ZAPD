const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.xlsx');

async function initExcel() {
    let workbook = new ExcelJS.Workbook();
    if (fs.existsSync(dbPath)) {
        await workbook.xlsx.readFile(dbPath);
    } else {
        const contactSheet = workbook.addWorksheet('Contacts');
        contactSheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Subject', key: 'subject', width: 30 },
            { header: 'Message', key: 'message', width: 50 }
        ];

        const newsletterSheet = workbook.addWorksheet('Newsletter');
        newsletterSheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Email', key: 'email', width: 30 }
        ];
        
        await workbook.xlsx.writeFile(dbPath);
    }
}
initExcel();

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(dbPath);
        const sheet = workbook.getWorksheet('Contacts');
        
        sheet.addRow({
            date: new Date().toISOString(),
            name, email, subject, message
        });
        
        await workbook.xlsx.writeFile(dbPath);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(dbPath);
        const sheet = workbook.getWorksheet('Newsletter');
        
        sheet.addRow({
            date: new Date().toISOString(),
            email
        });
        
        await workbook.xlsx.writeFile(dbPath);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
