dotenv.config();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = new Pool();

// --- Analytics ---
// Overall analytics for MAIN_ADMIN
app.get('/api/analytics/overall', async (req, res) => {
  try {
    // Get total reports and status breakdown
    const totalResult = await pool.query('SELECT COUNT(*) FROM reports');
    const resolvedCountResult = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'Resolved'");
    const statusResult = await pool.query('SELECT status, COUNT(*) FROM reports GROUP BY status');
    const categoryResult = await pool.query('SELECT category, COUNT(*) FROM reports GROUP BY category');
    const resolvedResult = await pool.query("SELECT AVG(EXTRACT(EPOCH FROM (updated_at - submitted_at))/86400) AS avg_resolution_days FROM reports WHERE status = 'Resolved'");

    res.json({
      totalReports: parseInt(totalResult.rows[0].count),
      totalResolved: parseInt(resolvedCountResult.rows[0].count),
      reportsByStatus: statusResult.rows.map(r => ({ name: r.status, value: parseInt(r.count) })),
      reportsByCategory: categoryResult.rows.map(r => ({ name: r.category, value: parseInt(r.count) })),
  avgResolutionTimeDays: resolvedResult.rows[0].avg_resolution_days ? parseFloat(resolvedResult.rows[0].avg_resolution_days).toFixed(4) : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Department analytics for MAIN_ADMIN
app.get('/api/analytics/department/:department', async (req, res) => {
  try {
    const dept = req.params.department;
    const totalResult = await pool.query('SELECT COUNT(*) FROM reports WHERE category = $1', [dept]);
    const statusResult = await pool.query('SELECT status, COUNT(*) FROM reports WHERE category = $1 GROUP BY status', [dept]);
    const resolvedResult = await pool.query("SELECT AVG(EXTRACT(EPOCH FROM (updated_at - submitted_at))/86400) AS avg_resolution_days FROM reports WHERE category = $1 AND status = 'Resolved'", [dept]);

    // Extract counts for each status
    let resolved = 0, pending = 0, inProgress = 0;
    statusResult.rows.forEach(r => {
      if (r.status === 'Resolved') resolved = parseInt(r.count);
      if (r.status === 'Pending') pending = parseInt(r.count);
      if (r.status === 'In Progress') inProgress = parseInt(r.count);
    });

    res.json({
      department: dept,
      total: parseInt(totalResult.rows[0].count),
      resolved,
      pending,
      inProgress,
      resolutionRate: (resolved && totalResult.rows[0].count) ? (resolved / parseInt(totalResult.rows[0].count)) : 0,
      avgResolutionTimeDays: resolvedResult.rows[0].avg_resolution_days ? parseFloat(resolvedResult.rows[0].avg_resolution_days) : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Health check

app.get('/', (req, res) => {
  res.send('CivicLink backend is running');
});

// Seed admin users if not present
const seedAdmins = async () => {
  const admins = [
    { name: 'Alice Smith', email: 'alice@potholes.gov', password: 'adminpassword', role: 'DEPT_ADMIN', department: 'Potholes' },
    { name: 'Bob Johnson', email: 'bob@streetlights.gov', password: 'adminpassword', role: 'DEPT_ADMIN', department: 'Streetlights' },
    { name: 'Carol White', email: 'carol@admin.gov', password: 'adminpassword', role: 'MAIN_ADMIN', department: null },
    { name: 'David Green', email: 'david@garbage.gov', password: 'adminpassword', role: 'DEPT_ADMIN', department: 'Garbage' },
    { name: 'Eve Blue', email: 'eve@waterworks.gov', password: 'adminpassword', role: 'DEPT_ADMIN', department: 'Water Works' },
    { name: 'Frank Park', email: 'frank@parks.gov', password: 'adminpassword', role: 'DEPT_ADMIN', department: 'Parks & Recreation' }
  ];
  for (const admin of admins) {
    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [admin.email]);
    if (exists.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role, department) VALUES ($1, $2, $3, $4, $5)',
        [admin.name, admin.email, admin.password, admin.role, admin.department]
      );
    }
  }
};

seedAdmins();

// --- Users ---
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, department } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, role, department || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND password_hash = $2`,
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Reports ---
app.post('/api/reports', async (req, res) => {
  const { title, description, category, imageUrl, location, userId } = req.body;
  console.log('Received report payload:', req.body);
  try {
    const result = await pool.query(
      `INSERT INTO reports (user_id, title, description, category, status, image_url, latitude, longitude) VALUES ($1, $2, $3, $4, 'Pending', $5, $6, $7) RETURNING *`,
      [userId, title, description, category, imageUrl, location?.lat, location?.lng]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reports/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reports WHERE user_id = $1 ORDER BY submitted_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reports/department/:department', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reports WHERE category = $1 ORDER BY submitted_at DESC`,
      [req.params.department]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/reports/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CivicLink backend running on port ${PORT}`);
});
