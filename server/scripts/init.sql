PRAGMA foreign_keys=OFF;

BEGIN TRANSACTION;

CREATE TABLE blogs (
    id          INTEGER NOT NULL
                        PRIMARY KEY,
    serialNo    INTEGER,
    title       TEXT    NOT NULL,
    intro       TEXT,
    content     TEXT,
    authorId    INTEGER REFERENCES users (id) ON DELETE CASCADE,
    author      TEXT    NOT NULL,
    categoryId  INTEGER REFERENCES categories (id) ON DELETE SET NULL,
    category    TEXT,
    attachments TEXT,
    likers      INTEGER NOT NULL
                        DEFAULT 0,
    views       INTEGER NOT NULL
                        DEFAULT 0,
    createTime  INTEGER NOT NULL
                        DEFAULT CURRENT_TIMESTAMP,
    updateTime  INTEGER,
    type        INTEGER NOT NULL
                        DEFAULT (1),
    slug        TEXT
);
CREATE INDEX i_blogs_author ON blogs (
    authorId
);

CREATE TABLE users (
    id            INTEGER NOT NULL
                          PRIMARY KEY,
    username      TEXT    NOT NULL,
    roles         TEXT    NOT NULL
                          DEFAULT 1,
    avatar        TEXT,
    email         TEXT,
    mobile        TEXT,
    password      TEXT    NOT NULL,
    createTime    INTEGER NOT NULL
                          DEFAULT CURRENT_TIMESTAMP,
    lastLoginTime INTEGER NOT NULL
                          DEFAULT 0
);
CREATE INDEX i_users_email ON users ("email");
CREATE INDEX i_users_mobile ON users ("mobile");

CREATE TABLE categories (
    id         INTEGER NOT NULL
                       PRIMARY KEY,
    serialNo   INTEGER,
    name       TEXT    NOT NULL,
    createTime INTEGER NOT NULL
                       DEFAULT CURRENT_TIMESTAMP,
    parentId   INTEGER REFERENCES categories (id) ON DELETE CASCADE,
    path       TEXT
);

CREATE TABLE comments (
    id         INTEGER NOT NULL
                       PRIMARY KEY,
    blogId     INTEGER NOT NULL
                       REFERENCES blogs (id) ON DELETE CASCADE,
    userId     INTEGER NOT NULL
                       REFERENCES users (id) ON DELETE CASCADE,
    username   TEXT    NOT NULL,
    content    TEXT    NOT NULL,
    createTime INTEGER NOT NULL
                       DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX i_comments_blog ON comments (
    blogId
);
CREATE INDEX i_comments_user ON comments (
    userId
);

CREATE TABLE replies (
    id         INTEGER NOT NULL
                       PRIMARY KEY,
    commentId  INTEGER NOT NULL
                       REFERENCES comments (id) ON DELETE CASCADE,
    userId     INTEGER NOT NULL
                       REFERENCES users (id) ON DELETE CASCADE,
    username   TEXT    NOT NULL,
    toUserId   INTEGER REFERENCES users (id) ON DELETE SET NULL,
    toUsername TEXT,
    content    TEXT    NOT NULL,
    createTime INTEGER NOT NULL
                       DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id         INTEGER NOT NULL
                       PRIMARY KEY,
    name       TEXT    NOT NULL,
    type       TEXT,
    hot        INTEGER NOT NULL
                       DEFAULT 0,
    color      TEXT,
    createTime INTEGER NOT NULL
                       DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "i_tags_name" ON "tags" (
  "name"
);

CREATE TABLE tagBlog (
    id     INTEGER NOT NULL
                   PRIMARY KEY,
    tagId  INTEGER NOT NULL
                   REFERENCES tags (id) ON DELETE CASCADE,
    blogId INTEGER NOT NULL
                   REFERENCES blogs (id) ON DELETE CASCADE
);
CREATE INDEX i_tagBlog_tag ON tagBlog ("tagId");
CREATE INDEX i_tagBlog_blog ON tagBlog ("blogId");

CREATE TABLE groups (
    id         INTEGER PRIMARY KEY
                       UNIQUE
                       NOT NULL,
    name       TEXT    UNIQUE
                       NOT NULL,
    parentId   INTEGER,
    createTime INTEGER DEFAULT (CURRENT_TIMESTAMP)
                       NOT NULL
);
CREATE INDEX i_groups_parentId ON groups (
    parentId
);

CREATE TABLE roles (
    id         INTEGER PRIMARY KEY
                       UNIQUE
                       NOT NULL,
    name       TEXT    NOT NULL
                       UNIQUE,
    createTime INTEGER NOT NULL
                       DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE permissions (
    id          INTEGER PRIMARY KEY
                        UNIQUE
                        NOT NULL,
    code        TEXT    UNIQUE
                        NOT NULL,
    type        TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT,
    createTime  INTEGER NOT NULL
                        DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX i_permissions_code ON permissions (
    code
);

CREATE TABLE groupPermission (
    id           INTEGER PRIMARY KEY
                         UNIQUE
                         NOT NULL,
    groupId      INTEGER NOT NULL,
    permissionId INTEGER NOT NULL,
    value        TEXT    NOT NULL,
    createTime   INTEGER NOT NULL
                         DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE userGroup (
    id      INTEGER PRIMARY KEY
                    UNIQUE
                    NOT NULL,
    userId  INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    groupId INTEGER NOT NULL REFERENCES groups (id) ON DELETE CASCADE
);

CREATE TABLE repos (
    id          INTEGER PRIMARY KEY
                        UNIQUE
                        NOT NULL,
    name        TEXT    NOT NULL,
    type        TEXT,
    description TEXT,
    isPrivate     INTEGER NOT NULL
                        DEFAULT (0),
    belong      INTEGER,
    slug        TEXT    NOT NULL
                        UNIQUE,
    toc         TEXT,
    creatorId   INTEGER NOT NULL,
    creator     TEXT    NOT NULL,
    createTime  INTEGER NOT NULL
                        DEFAULT (CURRENT_TIMESTAMP),
    updateTime  INTEGER,
    FOREIGN KEY (
        creatorId
    )
    REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX i_repos_creator ON repos (
    creatorId
);

CREATE UNIQUE INDEX i_repos_slug ON repos (
    slug
);

INSERT INTO users (username, roles, password) VALUES ("admin", "1,99", "dRl++VSOvT6R36C5HYGEMgplGaDuPIna+YHyFi/z8oH+zTiG100bXinvzkx/yeNUZMyGF4I3gYV9A6HrKyw0Rg==");

INSERT INTO permissions (code, name, type) VALUES
("GetAvailableCategories", "可获取版块", "string"),
("AddNewCategory", "新增版块", "boolean"),
("PostNewBlog", "发表文章", "boolean");

INSERT INTO groups (name) VALUES ("普通用户");

COMMIT;

PRAGMA foreign_keys=ON;
