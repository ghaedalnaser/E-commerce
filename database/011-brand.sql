DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."brand" (
    id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE  public.checkPrimaryKey('brand','brand_fk');

EXECUTE public.ensureTextFieldinTable('brand','name');
ALTER TABLE public."brand" ALTER COLUMN "name" SET NOT NULL ;

EXECUTE public.ensureTextFieldinTable('brand','slug');
ALTER TABLE public."brand" ALTER COLUMN "slug" SET NOT NULL ;

EXECUTE public.ensureTextFieldinTable('brand','image');

END$$