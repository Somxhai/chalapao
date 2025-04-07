export const CREATE_UPDATE_AT_TRIGGER = `
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
`;

export const createUpdateAtTrigger = (table: string) => `
  DROP TRIGGER IF EXISTS update_${table} ON "${table}";
  CREATE TRIGGER update_${table}
  BEFORE UPDATE ON "${table}"
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
`;
