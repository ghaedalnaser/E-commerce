CREATE OR REPLACE FUNCTION ensureBooleanFieldinTable(tableName TEXT, fieldName TEXT) RETURNS void AS $$
	BEGIN
		EXECUTE 'ALTER TABLE public."' || tableName || '" ADD COLUMN IF NOT EXISTS "' || fieldName || '" BOOLEAN';
		IF NOT EXISTS (
			SELECT data_type
			FROM information_schema.columns
			WHERE table_name = tableName
			AND column_name = fieldName AND data_type = 'boolean'
		) THEN
			EXECUTE 'ALTER TABLE public."' || tableName || '" ALTER COLUMN ' || fieldName || ' TYPE BOOLEAN USING "' || fieldName || '"::BOOLEAN;';
		END IF;
	END;
$$ LANGUAGE plpgsql;
