const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, full_name TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, topic TEXT, start_time DATETIME DEFAULT CURRENT_TIMESTAMP, status TEXT DEFAULT 'completed', FOREIGN KEY(user_id) REFERENCES users(id))");
    db.run("CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INTEGER, overall_score INTEGER, pronunciation_score INTEGER, fluency_score INTEGER, vocabulary_score INTEGER, feedback_text TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(session_id) REFERENCES sessions(id))");
    db.run("CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, mentor_id INTEGER, slot_time TEXT, status TEXT DEFAULT 'confirmed', meet_link TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(mentor_id) REFERENCES mentors(id))");

    db.run(`CREATE TABLE IF NOT EXISTS mentors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, specialty TEXT, rating REAL, available_slots TEXT)`);
    db.get("SELECT count(*) as count FROM mentors", (err, row) => {
        if (row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO mentors (name, specialty, rating, available_slots) VALUES (?, ?, ?, ?)");
            stmt.run("Ms. Sarah", "IELTS Speaking", 4.9, JSON.stringify(["09:00", "14:00", "16:00"]));
            stmt.run("Mr. John", "Business English", 4.7, JSON.stringify(["10:00", "15:00"]));
            stmt.finalize();
        }
    });

    db.run("INSERT OR IGNORE INTO users (username, full_name) VALUES ('student01', 'Nguyen Van A')");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

const speakingRouter = express.Router();

speakingRouter.post('/start', (req, res) => {
    const { userId, topic } = req.body;
    db.run("INSERT INTO sessions (user_id, topic) VALUES (?, ?)", [userId || 1, topic || 'General'], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Session started", sessionId: this.lastID, topic, ai_greeting: `Hello! Let's talk about ${topic}.` });
    });
});

speakingRouter.post('/:id/analyze', upload.single('audio'), (req, res) => {
    const sessionId = req.params.id;
    setTimeout(() => {
        const overall = Math.floor(Math.random() * (95 - 60) + 60);
        const feedback = "Good effort! Pay attention to your intonation.";

        db.run("INSERT INTO scores (session_id, overall_score, pronunciation_score, fluency_score, vocabulary_score, feedback_text) VALUES (?, ?, ?, ?, ?, ?)",
            [sessionId, overall, 80, 75, 70, feedback], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ sessionId, scoreId: this.lastID, results: { overall, feedback } });
            });
    }, 1000);
});

const scoresRouter = express.Router();

scoresRouter.get('/session/:sessionId', (req, res) => {
    db.get("SELECT * FROM scores WHERE session_id = ?", [req.params.sessionId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || { error: "Not found" });
    });
});

scoresRouter.get('/history', (req, res) => {
    const userId = req.query.userId || 1;
    db.all("SELECT s.topic, s.start_time, sc.overall_score FROM sessions s JOIN scores sc ON s.id = sc.session_id WHERE s.user_id = ? ORDER BY s.start_time DESC", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ userId, history: rows });
    });
});

const bookingRouter = express.Router();

bookingRouter.get('/mentors', (req, res) => {
    db.all("SELECT * FROM mentors", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const mentors = rows.map(m => ({ ...m, available_slots: JSON.parse(m.available_slots || "[]") }));
        res.json(mentors);
    });
});

bookingRouter.post('/book', (req, res) => {
    const { userId, mentorId, slotTime } = req.body;
    const meetLink = `https://meet.mock.com/${Date.now()}`;
    db.run("INSERT INTO bookings (user_id, mentor_id, slot_time, meet_link) VALUES (?, ?, ?, ?)", [userId || 1, mentorId, slotTime, meetLink], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Booking confirmed!", bookingId: this.lastID, meetLink });
    });
});

const reportRouter = express.Router();

reportRouter.get('/overview', (req, res) => {
    const userId = req.query.userId || 1;
    db.get("SELECT count(*) as total FROM sessions WHERE user_id = ?", [userId], (err, countRow) => {
        db.get("SELECT AVG(overall_score) as avg FROM sessions s JOIN scores sc ON s.id = sc.session_id WHERE s.user_id = ?", [userId], (err, avgRow) => {
            res.json({ totalSessions: countRow.total, averageScore: Math.round(avgRow.avg || 0) });
        });
    });
});

app.use('/api/speaking', speakingRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/reports', reportRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
