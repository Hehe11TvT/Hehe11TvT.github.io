const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const COUNT_FILE = path.join(DATA_DIR, 'count.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCount() {
  try {
    if (fs.existsSync(COUNT_FILE)) {
      const data = fs.readFileSync(COUNT_FILE, 'utf-8');
      return JSON.parse(data).count;
    }
  } catch (_) {}
  return 0;
}

function writeCount(count) {
  fs.writeFileSync(COUNT_FILE, JSON.stringify({ count }), 'utf-8');
}

app.get('/api/count', (_req, res) => {
  res.json({ count: readCount() });
});

app.post('/api/count', (req, res) => {
  const { value } = req.body;
  if (typeof value !== 'number') {
    return res.status(400).json({ error: 'value must be a number' });
  }
  writeCount(value);
  res.json({ count: value });
});

app.use(express.static(__dirname));

ensureDataDir();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
