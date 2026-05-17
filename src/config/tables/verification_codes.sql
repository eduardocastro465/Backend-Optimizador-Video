CREATE TABLE IF NOT EXISTS tblVerification_codes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email      VARCHAR(255) NOT NULL,
    code       VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_code_email ON tblVerification_codes (email, expires_at);
