const fs = require('fs');
const path = require('path');

function getDb() {
  const tmpPath = '/tmp/db.json';
  const localPath = path.join(process.cwd(), 'db.json');
  
  if (fs.existsSync(tmpPath)) {
    return JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
  } else if (fs.existsSync(localPath)) {
    return JSON.parse(fs.readFileSync(localPath, 'utf8'));
  }
  return { students: [], bookings: [] };
}

function saveDb(data) {
  const tmpPath = '/tmp/db.json';
  const localPath = path.join(process.cwd(), 'db.json');
  
  try {
    fs.writeFileSync(localPath, JSON.stringify(data, null, 2));
  } catch(e) {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const booking = req.body;
    const db = getDb();
    
    db.bookings.push(booking);
    saveDb(db);
    
    return res.status(200).json({ success: true, booking });
  } else if (req.method === 'GET') {
    return res.status(200).json({ success: true, bookings: getDb().bookings });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
