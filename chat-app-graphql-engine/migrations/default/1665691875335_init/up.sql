SET check_function_bodies = false;

CREATE TABLE users(
    userid serial PRIMARY KEY,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    token VARCHAR (255) UNIQUE NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    theme VARCHAR (20),
    avatarimage BYTEA,
    createdt TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE conversations(
    conversationid serial PRIMARY KEY,
    groupflag VARCHAR (1) NOT NULL,
    groupname VARCHAR (255),
    avatarimage BYTEA,
    adminid INT,
    createdt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (adminid) REFERENCES users (userid)
);
CREATE TABLE conversationusers(
    conversationuserid serial PRIMARY KEY,
    conversationid INT NOT NULL,
    userid INT NOT NULL,
    createdt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (conversationid) REFERENCES conversations (conversationid),
    FOREIGN KEY (userid) REFERENCES users (userid)
);
CREATE TABLE messages(
    messageid serial PRIMARY KEY,
    conversationid INT NOT NULL,
    userid INT NOT NULL,
    message TEXT,
    createdt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (conversationid) REFERENCES conversations (conversationid),
    FOREIGN KEY (userid) REFERENCES users (userid)
);

CREATE INDEX idx_messages_conversations
ON messages (conversationid);
