DO  $$  BEGIN 

CREATE TABLE IF NOT EXISTS public."user"(
 id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('user','user_pk');

EXECUTE public.ensureTextFieldinTable('user', 'name');
ALTER TABLE public."user" ALTER COLUMN "name" SET NOT NULL;

EXECUTE public.ensureTextFieldinTable('user', 'email');
ALTER TABLE public."user" ALTER COLUMN "email" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_lower_case_email_idx ON public."user" (lower(email));

EXECUTE public.ensureTextFieldinTable('user', 'password');

EXECUTE public.ensureBooleanFieldinTable('user','isAdmin');

EXECUTE public.ensureTextFieldinTable('user', 'sex');
ALTER TABLE public."user"  ALTER COLUMN "sex" SET DEFAULT 'male';

EXECUTE public.ensureTextFieldinTable('user', 'birth');

END $$
