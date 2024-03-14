CREATE OR REPLACE FUNCTION checkPrimaryKey(tableName TEXT, constraintName TEXT) RETURNS void AS $$
	BEGIN
		IF NOT EXISTS (
			SELECT constraint_name
			FROM information_schema.table_constraints
			WHERE table_name = tableName AND constraint_type = 'PRIMARY KEY'
		) THEN
			EXECUTE 'ALTER TABLE public."' || tableName || '" ADD CONSTRAINT "' || constraintName || '" PRIMARY KEY (id);';
		END IF;
	END;
$$ LANGUAGE plpgsql;
