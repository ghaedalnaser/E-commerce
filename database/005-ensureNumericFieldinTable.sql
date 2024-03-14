CREATE OR REPLACE FUNCTION ensureNumericFieldinTable(tableName TEXT, fieldName TEXT) RETURNS void AS $$
	BEGIN
		EXECUTE 'ALTER TABLE public."' || tableName || '" ADD COLUMN IF NOT EXISTS "' || fieldName || '" NUMERIC';
		IF NOT EXISTS (
			SELECT data_type
			FROM information_schema.columns
			WHERE table_name = tableName
			AND column_name = fieldName AND data_type = 'numeric'
		) THEN
			EXECUTE 'ALTER TABLE public."' || tableName || '" ALTER COLUMN "' || fieldName || '" TYPE NUMERIC USING "' || fieldName || '"::NUMERIC;';
		END IF;
	END;
$$ LANGUAGE plpgsql;
