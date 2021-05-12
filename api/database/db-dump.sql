DROP TABLE IF EXISTS public.logins, public.users;

CREATE TABLE public.logins (
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    email_address text,
    modified_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    scopes text[],
    first_name text,
    family_name text
);
