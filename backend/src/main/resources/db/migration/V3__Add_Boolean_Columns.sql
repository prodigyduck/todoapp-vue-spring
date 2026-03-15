-- V3__Add_Boolean_Columns.sql
-- Safely add boolean columns 'important' and 'my_day' to todos
-- Strategy:
-- 1) Add column with DEFAULT false if it doesn't exist
-- 2) Backfill NULLs to false
-- 3) Make column NOT NULL

-- Add 'important'
ALTER TABLE todos
    ADD COLUMN IF NOT EXISTS important boolean DEFAULT false;
UPDATE todos SET important = false WHERE important IS NULL;
ALTER TABLE todos ALTER COLUMN important SET NOT NULL;

-- Add 'my_day'
ALTER TABLE todos
    ADD COLUMN IF NOT EXISTS my_day boolean DEFAULT false;
UPDATE todos SET my_day = false WHERE my_day IS NULL;
ALTER TABLE todos ALTER COLUMN my_day SET NOT NULL;

-- End of migration
