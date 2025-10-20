CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
);


INSERT INTO user_roles (user_id, role_id)
SELECT
    u.id,
    r.id
FROM users u
JOIN roles r ON u.role = r.name;


ALTER TABLE users DROP COLUMN role;


ALTER TABLE teams
ADD COLUMN team_lead_id BIGINT REFERENCES users(id);


ALTER TABLE project
ADD COLUMN project_manager_id BIGINT REFERENCES users(id);