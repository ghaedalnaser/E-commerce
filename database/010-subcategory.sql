DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."subcategory"(
     id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('subcategory','subcategory_pk');

EXECUTE public.ensureTextFieldinTable('subcategory','name');
ALTER TABLE public."subcategory" ALTER COLUMN "name" SET NOT NULL ;
CREATE UNIQUE INDEX IF NOT EXISTS subcategory_unique_idx ON public."subcategory" (lower(name));

EXECUTE public.ensureTextFieldinTable('subcategory','slug');
ALTER TABLE public."subcategory" ALTER COLUMN "slug" SET NOT NULL ;

EXECUTE  public.ensureTextFieldinTable('subcategory' , 'category');
ALTER TABLE public."subcategory" ALTER COLUMN "category" SET NOT NULL ;
EXECUTE public.checkForeignKey('subcategory','subcategory_fk','category','category','id');

END$$