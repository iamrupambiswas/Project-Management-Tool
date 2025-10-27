ALTER TABLE users
ADD COLUMN last_active_date DATE;

UPDATE users
SET last_active_date = CURRENT_DATE
WHERE last_active_date IS NULL;
