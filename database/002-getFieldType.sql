CREATE OR REPLACE FUNCTION getFieldType(tableName TEXT, columnName TEXT)
RETURNS TEXT
LANGUAGE plpgsql
as
$getFieldType$
DECLARE
		res TEXT;
BEGIN
		SELECT data_type INTO res FROM information_schema.columns WHERE table_name = tableName AND column_name = columnName;
		RETURN res;
END
$getFieldType$
