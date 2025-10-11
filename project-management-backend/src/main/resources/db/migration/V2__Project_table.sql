-- 1️⃣ Remove the old CHECK constraint (since we’ll store strings now)
ALTER TABLE project DROP CONSTRAINT IF EXISTS project_status_check;

-- 2️⃣ Change the column type from SMALLINT → VARCHAR
ALTER TABLE project ALTER COLUMN status TYPE VARCHAR(50) USING status::text;

-- 3️⃣ Convert existing numeric values to enum names
UPDATE project SET status = 'PLANNING' WHERE status = '0';
UPDATE project SET status = 'ACTIVE' WHERE status = '1';
UPDATE project SET status = 'ON_HOLD' WHERE status = '2';

-- 4️⃣ (Optional) For future safety, you can re-add a constraint to allow only valid enum names:
ALTER TABLE project
  ADD CONSTRAINT project_status_check
  CHECK (status IN ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'));
