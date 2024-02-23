CREATE KEYSPACE IF NOT EXISTS EventHorizon
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE EventHorizon;

CREATE TABLE IF NOT EXISTS events (
                                      id UUID PRIMARY KEY,
                                      name TEXT,
                                      date_time TIMESTAMP,
                                      description TEXT
);

CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY,
                                     username TEXT,
                                     password_hash TEXT,
                                     email TEXT
);
