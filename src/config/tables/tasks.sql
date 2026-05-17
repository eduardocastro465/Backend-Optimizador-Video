DO $$ BEGIN
    CREATE TYPE enum_task_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE enum_task_status AS ENUM ('pending', 'in_progress', 'completed', 'not_completed', 'deleted');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS tblTasks (
    id                   SERIAL PRIMARY KEY,
    title                VARCHAR(50) NOT NULL,
    description          VARCHAR(500),
    priority             enum_task_priority DEFAULT 'medium',
    created_by           INT NOT NULL,
    assigned_to          INT,
    start_time           TIMESTAMP NOT NULL,
    end_time             TIMESTAMP NOT NULL,
    status               enum_task_status DEFAULT 'pending',
    not_completed_reason VARCHAR(500),
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at           TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_task_creator  FOREIGN KEY (created_by) REFERENCES tblUsers(id),
    CONSTRAINT fk_task_assignee FOREIGN KEY (assigned_to) REFERENCES tblUsers(id)
);

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON tblTasks;
CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tblTasks
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ─── Comments ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tblTask_comments (
    id         SERIAL PRIMARY KEY,
    task_id    INT NOT NULL,
    user_id    INT NOT NULL,
    comment    VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES tblTasks(id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES tblUsers(id)
);

DROP TRIGGER IF EXISTS trg_comments_updated_at ON tblTask_comments;
CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON tblTask_comments
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
