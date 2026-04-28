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
    // Works locally during development
    fs.writeFileSync(localPath, JSON.stringify(data, null, 2));
  } catch(e) {
    // Fallback for Vercel production read-only filesystem
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, payload } = req.body;
    const db = getDb();
    
    if (action === 'register') {
      // Check if email exists
      if (db.students.find(s => s.email.toLowerCase() === payload.email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      db.students.push(payload);
      saveDb(db);
      return res.status(200).json({ success: true, user: payload });
    } 
    
    else if (action === 'login') {
      const user = db.students.find(
        s => s.email.toLowerCase() === payload.email.toLowerCase() && s.password === payload.password
      );
      if (user) {
        return res.status(200).json({ success: true, user });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } else if (req.method === 'GET') {
    return res.status(200).json({ success: true, students: getDb().students });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
