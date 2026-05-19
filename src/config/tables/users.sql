CREATE TABLE IF NOT EXISTS tblUsers (
    id          SERIAL PRIMARY KEY,
    photo       TEXT,
    username    VARCHAR(30) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) ,
    active      BOOLEAN DEFAULT TRUE,
    role_id     INT NOT NULL,
    google_id   VARCHAR UNIQUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES tblRoles(id)
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON tblUsers;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON tblUsers
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE INDEX IF NOT EXISTS idx_users_username ON tblUsers(username);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON tblUsers(deleted_at);

-- ─── Profile ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tblUser_profiles (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL,
    first_name  VARCHAR(30) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    birth_date  DATE NOT NULL,
    gender      VARCHAR(20),
    phone       VARCHAR(20),
    country     VARCHAR(60),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES tblUsers(id) ON DELETE CASCADE
);

DROP TRIGGER IF EXISTS trg_profile_updated_at ON tblUser_profiles;
CREATE TRIGGER trg_profile_updated_at
BEFORE UPDATE ON tblUser_profiles
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE INDEX IF NOT EXISTS idx_profile_user_id ON tblUser_profiles(user_id);

-- ─── Devices ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tblDevices (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL,
    device      VARCHAR(30) NOT NULL,
    device_type VARCHAR(30) NOT NULL,
    browser     TEXT NOT NULL,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_device_user FOREIGN KEY (user_id) REFERENCES tblUsers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_devices_user_id ON tblDevices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_type    ON tblDevices(device_type);
