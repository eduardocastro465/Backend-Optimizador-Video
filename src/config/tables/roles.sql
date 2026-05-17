CREATE TABLE IF NOT EXISTS tblRoles (
    id          SERIAL PRIMARY KEY,
    role        VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(250),
    active      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS trg_roles_updated_at ON tblRoles;
CREATE TRIGGER trg_roles_updated_at
BEFORE UPDATE ON tblRoles
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();