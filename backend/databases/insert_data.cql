USE EventHorizon;

INSERT INTO events (id, name, date_time, description)
VALUES (uuid(), 'New Year Celebration', '2024-01-01 00:00:00', 'Celebrating the New Year');

/* Users info are not published here for security reasons */
INSERT INTO users (id, username, password_hash, email)
VALUES (uuid(), 'john_doe', 'somesecuredhash', 'john@example.com');
