CREATE OR REPLACE FUNCTION checkPrimaryKey(tableName TEXT,constraintName TEXT, fkcolumnname TEXT,reftablename TEXT,refcolumnname TEXT) RETURNS void AS $$
	BEGIN
		IF NOT EXISTS (
			SELECT constraint_name
			FROM information_schema.table_constraints
			WHERE table_name = tableName AND constraint_type = 'FOREIGN KEY'
		) THEN
			EXECUTE 'ALTER TABLE public."' || tableName || '" ADD CONSTRAINT "' || constraintName || '" FOREIGN KEY ('||fkcolumnname||')  REFERENCES public."'||reftablename||'"('||refcolumnname||') ;';
		END IF;
	END;
$$ LANGUAGE plpgsql;

