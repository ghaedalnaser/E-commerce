DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."category"(
    id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('category','category_pk');

EXECUTE public.ensureTextFieldinTable('category','name');
ALTER TABLE public."category" ALTER COLUMN "name" SET NOT NULL ;
CREATE UNIQUE INDEX IF NOT EXISTS category_unique_idx ON public."category" (lower(name));

EXECUTE public.ensureTextFieldinTable('category','slug');
ALTER TABLE public."category" ALTER COLUMN "slug" SET NOT NULL ;



END$$