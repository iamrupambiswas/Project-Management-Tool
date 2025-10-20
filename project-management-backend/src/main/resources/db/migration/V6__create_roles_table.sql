DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

INSERT INTO roles (name, description) VALUES
('ADMIN', 'System administrator with full access'),
('USER', 'Regular team member'),
('PROJECT_MANAGER', 'Manages projects and teams'),
('TEAM_LEAD', 'Leads a specific team');