CREATE OR REPLACE FUNCTION ensureTextFieldinTable(tableName TEXT, fieldName TEXT) RETURNS void AS $$
	BEGIN
		EXECUTE 'ALTER TABLE public."' || tableName || '" ADD COLUMN IF NOT EXISTS "' || fieldName || '" TEXT';
		IF NOT EXISTS (
			SELECT data_type
			FROM information_schema.columns
			WHERE table_name = tableName
			AND column_name = fieldName AND data_type = 'text'
		) THEN
			EXECUTE 'ALTER TABLE public."' || tableName || '" ALTER COLUMN "' || fieldName || '" TYPE TEXT USING "' || fieldName || '"::TEXT;';
		END IF;
	END;
$$ LANGUAGE plpgsql;
