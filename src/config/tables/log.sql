DO $$ BEGIN
    CREATE TYPE enum_log_level AS ENUM ('error', 'warn', 'info', 'http', 'sql');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE enum_log_method AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE TABLE IF NOT EXISTS tblLogs (
    id          SERIAL PRIMARY KEY,
    level       enum_log_level DEFAULT 'error',
    message     VARCHAR(500) NOT NULL,
    path        VARCHAR(255),
    method      enum_log_method,
    status_code INT,
    user_id     INT,
    ip          VARCHAR(45),
    user_agent  TEXT,
    body        JSONB,
    query       JSONB,
    params      JSONB,
    stack       TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_level      ON tblLogs(level);
CREATE INDEX IF NOT EXISTS idx_logs_path       ON tblLogs(path);
CREATE INDEX IF NOT EXISTS idx_logs_method     ON tblLogs(method);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON tblLogs(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_user_id    ON tblLogs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_status_code ON tblLogs(status_code);

DROP TRIGGER IF EXISTS trg_logs_updated_at ON tblLogs;
CREATE TRIGGER trg_logs_updated_at
BEFORE UPDATE ON tblLogs
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();