DO $$ BEGIN
    CREATE TYPE enum_attachment_category AS ENUM ('evidence', 'documentation', 'correction', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS tblAttachments (
    id          SERIAL PRIMARY KEY,
    task_id     INT,
    comment_id  INT,
    uploaded_by INT NOT NULL,
    category    enum_attachment_category DEFAULT NULL,
    url         VARCHAR(500) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,
    size        INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_attachment_user    FOREIGN KEY (uploaded_by) REFERENCES tblUsers(id),
    CONSTRAINT fk_attachment_task    FOREIGN KEY (task_id)     REFERENCES tblTasks(id),
    CONSTRAINT fk_attachment_comment FOREIGN KEY (comment_id)  REFERENCES tblTask_comments(id)
);

DROP TRIGGER IF EXISTS trg_attachments_updated_at ON tblAttachments;
CREATE TRIGGER trg_attachments_updated_at
BEFORE UPDATE ON tblAttachments
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
