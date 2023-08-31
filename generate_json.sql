DROP TABLE IF EXISTS ##table_columns;
GO

CREATE TABLE ##table_columns
(
    columnId int IDENTITY PRIMARY KEY,
    TABLE_SCHEMA varchar(80),
	TABLE_NAME varchar(180),
	COLUMN_NAME varchar(180),
	COLUMN_DEFAULT varchar(80),
	IS_NULLABLE varchar(80),
	DATA_TYPE varchar(80),
	CHARACTER_MAXIMUM_LENGTH varchar(80)
);
GO


INSERT INTO ##table_columns (TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH)
	SELECT
		ISC.TABLE_SCHEMA, 
		ISC.TABLE_NAME, 
		ISC.COLUMN_NAME, 
		ISC.COLUMN_DEFAULT, 
		ISC.IS_NULLABLE, 
		ISC.DATA_TYPE, 
		ISC.CHARACTER_MAXIMUM_LENGTH 
		FROM information_schema.columns ISC with(nolock)

	INNER JOIN information_schema.tables IST with(nolock)
	ON ISC.TABLE_NAME = IST.TABLE_NAME
	WHERE IST.TABLE_TYPE = 'BASE TABLE'
	

SELECT '{' 
		+ '"TABLE_SCHEMA'					+ '":' + '"' + (CASE WHEN c.TABLE_SCHEMA				IS NULL THEN 'NULL' ELSE c.TABLE_SCHEMA					END) +'", '
		+ '"TABLE_NAME'						+ '":' + '"' + (CASE WHEN c.TABLE_NAME					IS NULL THEN 'NULL' ELSE c.TABLE_NAME					END) +'", '
		+ '"COLUMN_NAME'					+ '":' + '"' + (CASE WHEN c.COLUMN_NAME					IS NULL THEN 'NULL' ELSE c.COLUMN_NAME					END) +'", '
		+ '"COLUMN_DEFAULT'					+ '":' + '"' + (CASE WHEN c.COLUMN_DEFAULT				IS NULL THEN 'NULL' ELSE c.COLUMN_DEFAULT				END) +'", '
		+ '"IS_NULLABLE'					+ '":' + '"' + (CASE WHEN c.IS_NULLABLE					IS NULL THEN 'NULL' ELSE c.IS_NULLABLE					END) +'", '
		+ '"DATA_TYPE'						+ '":' + '"' + (CASE WHEN c.DATA_TYPE					IS NULL THEN 'NULL' ELSE c.DATA_TYPE					END) +'", '
		+ '"CHARACTER_MAXIMUM_LENGTH'		+ '":' + '"' + (CASE WHEN c.CHARACTER_MAXIMUM_LENGTH	IS NULL THEN 'NULL' ELSE c.CHARACTER_MAXIMUM_LENGTH		END) +'"'
	+ '},'	
	
	FROM ##table_columns c with (nolock)

