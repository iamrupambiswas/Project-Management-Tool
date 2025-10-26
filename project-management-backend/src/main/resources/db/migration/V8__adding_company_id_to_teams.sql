-- Add company_id to teams
ALTER TABLE teams
ADD COLUMN company_id BIGINT NOT NULL;

ALTER TABLE teams
ADD CONSTRAINT fk_team_company
FOREIGN KEY (company_id)
REFERENCES companies(id);

-- Ensure project.company_id is NOT NULL
ALTER TABLE project
ALTER COLUMN company_id SET NOT NULL;

-- Fix foreign key reference
ALTER TABLE project
ADD CONSTRAINT fk_project_company
FOREIGN KEY (company_id)
REFERENCES companies(id);