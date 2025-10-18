ALTER TABLE users ADD COLUMN company_id BIGINT;
ALTER TABLE project ADD COLUMN company_id BIGINT;
ALTER TABLE task ADD COLUMN company_id BIGINT;

ALTER TABLE users
    ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id)
    REFERENCES companies (id);

ALTER TABLE project
    ADD CONSTRAINT fk_projects_company FOREIGN KEY (company_id)
    REFERENCES companies (id);

ALTER TABLE task
    ADD CONSTRAINT fk_tasks_company FOREIGN KEY (company_id)
    REFERENCES companies (id);
