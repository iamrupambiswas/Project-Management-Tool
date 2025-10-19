ALTER TABLE users
ADD COLUMN role VARCHAR(50);

DROP TABLE IF EXISTS user_roles;

ALTER TABLE project DROP CONSTRAINT IF EXISTS fk_project_created_by_id;

ALTER TABLE project DROP COLUMN IF EXISTS created_by_id;

ALTER TABLE project ADD COLUMN created_by_id BIGINT NOT NULL;

ALTER TABLE project DROP CONSTRAINT IF EXISTS fk_project_company_id;

ALTER TABLE project DROP COLUMN IF EXISTS company_id;

ALTER TABLE project ADD COLUMN company_id BIGINT;