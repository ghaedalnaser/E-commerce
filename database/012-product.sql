DO $$ BEGIN 

CREATE TABLE IF NOT EXISTS public."product"(
  id TEXT DEFAULT uuid_generate_v1()
  );
EXECUTE public.checkPrimaryKey('product', 'product_pk');

EXECUTE public.ensureTextFieldinTable('product', 'title');
ALTER TABLE public."product" ALTER COLUMN "title" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS category_unique_idxt ON public."product" (lower(title));

EXECUTE public.ensureTextFieldinTable('product', 'slug');
ALTER TABLE public."product" ALTER COLUMN "slug" SET NOT NULL;

EXECUTE public.ensureTextFieldinTable('product', 'description');
ALTER TABLE public."product" ALTER COLUMN "description" SET NOT NULL;

EXECUTE public.ensureNumericFieldinTable('product', 'price');
ALTER TABLE public."product" ALTER COLUMN "price" SET NOT NULL;

EXECUTE public.ensureNumericFieldinTable('product', 'quantity');
ALTER TABLE public."product" ALTER COLUMN "quantity" SET NOT NULL;

EXECUTE public.ensureNumericFieldinTable('product', 'sold');
-- ALTER TABLE public."product"ALTER COLUMN "sold" SET NOT NULL;
EXECUTE public.ensureNumericFieldinTable('product', 'priceAfterDiscount');
EXECUTE public.ensureNumericFieldinTable('product', 'ratingsAverage');
EXECUTE public.ensureNumericFieldinTable('product', 'ratingsQuantity');

EXECUTE public.ensureTextFieldinTable('product', 'category');
ALTER TABLE public."product" ALTER COLUMN "category" SET NOT NULL; 
EXECUTE public.checkForeignKey('product', 'product_fk1','category','category', 'id');

EXECUTE public.ensureTextFieldinTable('product', 'brand');
ALTER TABLE public."product" ALTER COLUMN "brand" SET NOT NULL;

EXECUTE public.checkForeignKey('product', 'product_fk2', 'brand', 'brand', 'id');
EXECUTE public.ensureTextFieldinTable('product', 'colors');
IF public.getFieldType('product', 'colors') != 'ARRAY' THEN
ALTER TABLE public."product"
ALTER COLUMN "colors" TYPE JSON [] USING "colors"::JSON [];
END IF;
EXECUTE public.ensureTextFieldinTable('product', 'imgColors');
IF public.getFieldType('product', 'imgColors') != 'ARRAY' THEN
ALTER TABLE public."product"
ALTER COLUMN "imgColors" TYPE JSON [] USING "imgColors"::JSON [];
END IF;

EXECUTE public.ensureTextFieldinTable('product', 'images');
IF public.getFieldType('product', 'images') != 'ARRAY' THEN
ALTER TABLE public."product"
ALTER COLUMN "images" TYPE JSON [] USING "images"::JSON [];

EXECUTE public.ensureTextFieldinTable('product', 'subCategory');
IF public.getFieldType('product', 'subCategory')  != 'ARRAY' THEN
ALTER TABLE public."product"
ALTER COLUMN "subCategory" TYPE JSON [] USING "subCategory"::JSON [];
END IF;

END $$