--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: server
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO server;

--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: server
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.update_timestamp() OWNER TO server;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    access_token text,
    refresh_token text,
    access_token_expires_at timestamp without time zone,
    refresh_token_expires_at timestamp without time zone,
    scope text,
    id_token text,
    password text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.account OWNER TO server;

--
-- Name: address; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.address (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    residence_info text NOT NULL,
    sub_district text NOT NULL,
    district text NOT NULL,
    province text NOT NULL,
    postal_code text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.address OWNER TO server;

--
-- Name: category; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.category (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.category OWNER TO server;

--
-- Name: item; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    item_name text NOT NULL,
    description text,
    rental_terms text NOT NULL,
    penalty_terms text NOT NULL,
    item_status text NOT NULL,
    price_per_day numeric NOT NULL,
    category_id uuid,
    item_rating integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT item_item_rating_check CHECK (((item_rating >= 0) AND (item_rating <= 5))),
    CONSTRAINT item_item_status_check CHECK ((item_status = ANY (ARRAY['available'::text, 'rented'::text, 'unavailable'::text])))
);


ALTER TABLE public.item OWNER TO server;

--
-- Name: item_image; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.item_image (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    path text NOT NULL
);


ALTER TABLE public.item_image OWNER TO server;

--
-- Name: keyword; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.keyword (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    keyword text NOT NULL
);


ALTER TABLE public.keyword OWNER TO server;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.payment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    renter_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    total_price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text])))
);


ALTER TABLE public.payment OWNER TO server;

--
-- Name: rental; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.rental (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    renter_id uuid NOT NULL,
    item_id uuid NOT NULL,
    delivery_address uuid NOT NULL,
    return_address uuid NOT NULL,
    payment_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rental_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'paid'::text, 'completed'::text, 'cancelled'::text])))
);


ALTER TABLE public.rental OWNER TO server;

--
-- Name: rental_address; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.rental_address (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    residence_info text NOT NULL,
    sub_district text NOT NULL,
    district text NOT NULL,
    province text NOT NULL,
    postal_code character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rental_address OWNER TO server;

--
-- Name: review_item; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.review_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reviewer_id uuid NOT NULL,
    item_id uuid NOT NULL,
    rating integer,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_item_rating_check CHECK (((rating >= 0) AND (rating <= 5)))
);


ALTER TABLE public.review_item OWNER TO server;

--
-- Name: review_item_image; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.review_item_image (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    path text NOT NULL
);


ALTER TABLE public.review_item_image OWNER TO server;

--
-- Name: review_user; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.review_user (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reviewer_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating integer,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_user_rating_check CHECK (((rating >= 0) AND (rating <= 5)))
);


ALTER TABLE public.review_user OWNER TO server;

--
-- Name: review_user_image; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.review_user_image (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    path text NOT NULL
);


ALTER TABLE public.review_user_image OWNER TO server;

--
-- Name: session; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.session OWNER TO server;

--
-- Name: user; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean DEFAULT false,
    user_image text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_type text DEFAULT 'renter'::text NOT NULL,
    CONSTRAINT user_user_type_check CHECK ((user_type = ANY (ARRAY['renter'::text, 'lessor'::text, 'admin'::text])))
);


ALTER TABLE public."user" OWNER TO server;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.user_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    gender character varying(1),
    birth_date date NOT NULL,
    citizen_id character varying(13) NOT NULL,
    phone_number character varying(10),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_info_gender_check CHECK (((gender)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying, 'O'::character varying])::text[])))
);


ALTER TABLE public.user_info OWNER TO server;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.verification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.verification OWNER TO server;

--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.account (id, user_id, account_id, provider_id, access_token, refresh_token, access_token_expires_at, refresh_token_expires_at, scope, id_token, password, created_at, updated_at) FROM stdin;
315f0a75-6072-4651-a5a9-f2a072d7f620	1051d31f-19d2-4bae-bb9c-ccc706640688	1051d31f-19d2-4bae-bb9c-ccc706640688	credential	\N	\N	\N	\N	\N	\N	1152d6cdc74b4d91b6fefdfaf312f761:8e579b4c7c000c4f1eb1204a531ffda8d03e44d23d8bbb43193e81cd755d73a2589b598eb410ce900c154d133519d0286225629315706aa66fa85731838a75cb	2025-04-26 21:59:08.04	2025-04-26 21:59:08.04
b2467959-4685-4164-87c0-63e9976e686a	36128b7f-da99-4e10-9f4d-605b1abb61b2	36128b7f-da99-4e10-9f4d-605b1abb61b2	credential	\N	\N	\N	\N	\N	\N	1152d6cdc74b4d91b6fefdfaf312f761:8e579b4c7c000c4f1eb1204a531ffda8d03e44d23d8bbb43193e81cd755d73a2589b598eb410ce900c154d133519d0286225629315706aa66fa85731838a75cb	2025-04-28 12:37:18.781	2025-04-28 12:37:18.781
9af834a5-0af9-4f06-9f12-f84d491da006	287bfcfd-eb5a-43e8-9543-f4553b24a1c8	287bfcfd-eb5a-43e8-9543-f4553b24a1c8	credential	\N	\N	\N	\N	\N	\N	be9d8b49f10f2514bd860ea7aa5484af:8055a6f2ad9e009dc06bac0d903f39bbf2ea6a6e07a14baaa19fc459cee30da90dfcbc22d2064a80e246f9ce401af83c42ca655b443e644a2ec550e3d4056f3f	2025-05-09 18:03:07.108	2025-05-09 18:03:07.108
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.address (id, user_id, is_primary, residence_info, sub_district, district, province, postal_code, created_at, updated_at) FROM stdin;
55555555-5555-4555-b555-555555555555	1051d31f-19d2-4bae-bb9c-ccc706640688	t	123 Main St	Sub1	Dist1	Bangkok	10100	2025-04-26 04:37:43.791412+00	2025-04-27 06:02:48.011516+00
66666666-6666-4666-b666-666666666666	36128b7f-da99-4e10-9f4d-605b1abb61b2	t	456 Second St	Sub2	Dist2	Chiang Mai	50200	2025-04-26 04:37:43.791412+00	2025-04-28 05:40:53.31076+00
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.category (id, name, created_at, updated_at) FROM stdin;
77777777-7777-4777-b777-777777777777	Camera	2025-04-26 04:37:43.791412+00	2025-04-26 04:37:43.791412+00
88888888-8888-4888-b888-888888888888	Camping Gear	2025-04-26 04:37:43.791412+00	2025-04-26 04:37:43.791412+00
77777777-7777-7777-b777-777777777777	Books	2025-04-26 04:37:43.791412+00	2025-04-26 04:37:43.791412+00
77777777-7777-6777-b777-777777777777	Clothing	2025-04-26 04:37:43.791412+00	2025-04-26 04:37:43.791412+00
77777777-7777-5777-b777-777777777777	Technology	2025-04-26 04:37:43.791412+00	2025-04-26 04:37:43.791412+00
\.


--
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.item (id, owner_id, item_name, description, rental_terms, penalty_terms, item_status, price_per_day, category_id, item_rating, created_at, updated_at) FROM stdin;
99999999-9999-4999-b999-999999999999	36128b7f-da99-4e10-9f4d-605b1abb61b2	Canon DSLR	A nice camera.	Return in 3 days.	Damage costs 500.	available	100	77777777-7777-4777-b777-777777777777	3	2025-04-26 04:37:43.791412+00	2025-04-28 06:46:36.330726+00
11111111-aaaa-4bbb-b111-aaaaaaaaaaaa	36128b7f-da99-4e10-9f4d-605b1abb61b2	Canon EOS 90D	High-quality DSLR camera.	Return in 3 days.	Damage costs 1000.	available	150	77777777-7777-4777-b777-777777777777	4	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
11111111-aaab-4bbb-b111-aaaaaaaaaaab	36128b7f-da99-4e10-9f4d-605b1abb61b2	Nikon D5600	Lightweight and powerful DSLR.	Return in 3 days.	Damage costs 800.	available	120	77777777-7777-4777-b777-777777777777	5	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
22222222-bbbb-4ccc-b222-bbbbbbbbbbbb	36128b7f-da99-4e10-9f4d-605b1abb61b2	MacBook Pro 16"	Powerful laptop for work.	Return in 5 days.	Damage costs 3000.	available	500	77777777-7777-5777-b777-777777777777	5	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
22222222-bbbc-4ccc-b222-bbbbbbbbbbbc	36128b7f-da99-4e10-9f4d-605b1abb61b2	iPad Air 5th Gen	Portable and fast tablet.	Return in 5 days.	Damage costs 1000.	available	250	77777777-7777-5777-b777-777777777777	4	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
33333333-cccc-4ddd-b333-cccccccccccc	36128b7f-da99-4e10-9f4d-605b1abb61b2	North Face Jacket	Warm and waterproof.	Return in 2 days.	Damage costs 500.	available	50	77777777-7777-6777-b777-777777777777	4	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
33333333-cccd-4ddd-b333-cccccccccccd	36128b7f-da99-4e10-9f4d-605b1abb61b2	Adidas Sneakers	Comfortable running shoes.	Return in 2 days.	Damage costs 300.	available	40	77777777-7777-6777-b777-777777777777	5	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
44444444-dddd-4eee-b444-dddddddddddd	36128b7f-da99-4e10-9f4d-605b1abb61b2	The Great Gatsby	Classic novel by F. Scott Fitzgerald.	Return in 7 days.	Damage costs 200.	available	10	77777777-7777-7777-b777-777777777777	5	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
44444444-ddde-4eee-b444-ddddddddddde	36128b7f-da99-4e10-9f4d-605b1abb61b2	Sapiens: A Brief History	Bestselling book by Yuval Noah Harari.	Return in 7 days.	Damage costs 200.	available	15	77777777-7777-7777-b777-777777777777	4	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
55555555-eeee-4fff-b555-eeeeeeeeeeee	36128b7f-da99-4e10-9f4d-605b1abb61b2	Coleman Tent	Spacious 4-person camping tent.	Return in 5 days.	Damage costs 1500.	available	200	88888888-8888-4888-b888-888888888888	5	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
55555555-eeef-4fff-b555-eeeeeeeeeeef	36128b7f-da99-4e10-9f4d-605b1abb61b2	Camping Stove	Portable gas stove.	Return in 5 days.	Damage costs 500.	available	80	88888888-8888-4888-b888-888888888888	4	2025-04-28 11:22:14.151304+00	2025-04-28 11:22:14.151304+00
\.


--
-- Data for Name: item_image; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.item_image (id, item_id, path) FROM stdin;
aaaaaaa1-aaaa-4aaa-baaa-aaaaaaaaaaa2	11111111-aaab-4bbb-b111-aaaaaaaaaaab	image/item/3d520586-459b-4a22-81c6-3eacfe0cc49f.jpg
aaaaaaa3-aaaa-4aaa-baaa-aaaaaaaaaaa1	22222222-bbbc-4ccc-b222-bbbbbbbbbbbc	image/item/6g850586-789e-4a55-84c6-3eacfe0ff52c.jpg
aaaaaaa4-aaaa-4aaa-baaa-aaaaaaaaaaa1	33333333-cccc-4ddd-b333-cccccccccccc	image/item/8i070586-9a20-4a77-86c6-3eacfe11054e.jpg
aaaaaaa5-aaaa-4aaa-baaa-aaaaaaaaaaa1	33333333-cccd-4ddd-b333-cccccccccccd	image/item/ak290586-bc42-4a99-88c6-3eacfe130560.jpg
aaaaaaa6-aaaa-4aaa-baaa-aaaaaaaaaaa1	44444444-dddd-4eee-b444-dddddddddddd	image/item/cm4b0586-de64-4abb-8ac6-3eacfe150582.jpg
aaaaaaa7-aaaa-4aaa-baaa-aaaaaaaaaaa1	44444444-ddde-4eee-b444-ddddddddddde	image/item/eo6d0586-f086-4add-8cc6-3eacfe1705a4.jpg
aaaaaaa8-aaaa-4aaa-baaa-aaaaaaaaaaa1	55555555-eeee-4fff-b555-eeeeeeeeeeee	image/item/gq8f0586-12a8-4aff-8ec6-3eacfe1905c6.jpg
aaaaaaa8-aaaa-4aaa-baaa-aaaaaaaaaaa2	55555555-eeee-4fff-b555-eeeeeeeeeeee	image/item/hr9g0586-23b9-4b00-8fc6-3eacfe1a05d7.jpg
aaaaaaa9-aaaa-4aaa-baaa-aaaaaaaaaaa1	55555555-eeef-4fff-b555-eeeeeeeeeeef	image/item/is0h0586-34ca-4b11-90c6-3eacfe1b05e8.jpg
aaaaaaa0-aaaa-4aaa-baaa-aaaaaaaaaaaa	99999999-9999-4999-b999-999999999999	image/item/8a210586-249c-4a37-90c6-3eacfe0ae48g.jpg
aaaaaaa0-aaaa-4aaa-baaa-aaaaaaaaaaa1	11111111-aaaa-4bbb-b111-aaaaaaaaaaaa	image/item/8a210586-249c-4a37-90c6-3eacfe0ae48e.png
aaaaaaa0-aaaa-4aaa-baaa-aaaaaaaaaaa2	11111111-aaaa-4bbb-b111-aaaaaaaaaaaa	image/item/9b310586-159c-4a12-80c6-3eacfe0ab47f.png
aaaaaaa1-aaaa-4aaa-baaa-aaaaaaaaaaa1	11111111-aaab-4bbb-b111-aaaaaaaaaaab	image/item/2c410586-378a-4a11-80c6-3eacfe0bb48e.png
aaaaaaa2-aaaa-4aaa-baaa-aaaaaaaaaaa1	22222222-bbbb-4ccc-b222-bbbbbbbbbbbb	image/item/4e630586-569c-4a33-82c6-3eacfe0dd50a.png
\.


--
-- Data for Name: keyword; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.keyword (id, item_id, keyword) FROM stdin;
bbbbbbb1-bbbb-4bbb-bbbb-bbbbbbbbbbbb	99999999-9999-4999-b999-999999999999	camera
ccccccc2-cccc-4ccc-bccc-cccccccccccc	99999999-9999-4999-b999-999999999999	dslr
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.payment (id, renter_id, status, total_price, created_at, updated_at) FROM stdin;
beef826f-e449-44c7-a941-95e45bd4fc63	1051d31f-19d2-4bae-bb9c-ccc706640688	pending	1350	2025-05-06 16:08:16.961801+00	2025-05-06 16:08:16.961801+00
98814bef-b1e8-476b-a37f-933355deafa2	1051d31f-19d2-4bae-bb9c-ccc706640688	pending	600	2025-05-09 11:06:07.630516+00	2025-05-09 11:06:07.630516+00
\.


--
-- Data for Name: rental; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.rental (id, renter_id, item_id, delivery_address, return_address, payment_id, status, start_date, end_date, created_at, updated_at) FROM stdin;
3de14f95-20e5-44e4-9e21-a2e80ecd7d7d	1051d31f-19d2-4bae-bb9c-ccc706640688	11111111-aaaa-4bbb-b111-aaaaaaaaaaaa	33626507-3a02-42a0-8bae-e302ba4a4a08	8cd83ebf-2226-4e03-98df-e0be06d79b4d	beef826f-e449-44c7-a941-95e45bd4fc63	completed	2025-05-01	2025-05-10	2025-05-06 16:08:16.964829+00	2025-05-06 16:23:31.972623+00
838af9b6-2554-4f51-af72-d46c2a2e2d1a	1051d31f-19d2-4bae-bb9c-ccc706640688	11111111-aaaa-4bbb-b111-aaaaaaaaaaaa	5a261a0e-b09a-4840-8301-30801e9d4ebe	63b71139-f04a-4957-95db-3770494a1371	98814bef-b1e8-476b-a37f-933355deafa2	paid	2025-05-12	2025-05-16	2025-05-09 11:06:07.636873+00	2025-05-09 11:08:12.576106+00
\.


--
-- Data for Name: rental_address; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.rental_address (id, residence_info, sub_district, district, province, postal_code, created_at, updated_at) FROM stdin;
33626507-3a02-42a0-8bae-e302ba4a4a08	123 Main St	Sub1	Dist1	Bangkok	10100	2025-05-06 16:08:16.948835+00	2025-05-06 16:08:16.948835+00
8cd83ebf-2226-4e03-98df-e0be06d79b4d	456 Second St	Sub2	Dist2	Chiang Mai	50200	2025-05-06 16:08:16.952388+00	2025-05-06 16:08:16.952388+00
5a261a0e-b09a-4840-8301-30801e9d4ebe	123 Main St	Sub1	Dist1	Bangkok	10100	2025-05-09 11:06:07.602465+00	2025-05-09 11:06:07.602465+00
63b71139-f04a-4957-95db-3770494a1371	456 Second St	Sub2	Dist2	Chiang Mai	50200	2025-05-09 11:06:07.607746+00	2025-05-09 11:06:07.607746+00
\.


--
-- Data for Name: review_item; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.review_item (id, reviewer_id, item_id, rating, comment, created_at, updated_at) FROM stdin;
22222220-2222-4222-b222-222222222220	1051d31f-19d2-4bae-bb9c-ccc706640688	99999999-9999-4999-b999-999999999999	5	Very good camera!	2025-04-26 04:37:43.791412+00	2025-04-27 06:03:40.74354+00
\.


--
-- Data for Name: review_item_image; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.review_item_image (id, review_id, path) FROM stdin;
33333330-3333-4333-b333-333333333330	22222220-2222-4222-b222-222222222220	image/review/8a210586-249c-4a37-90c6-3eacfe0ae48e-e1bca8ce-5487-4613-9848-82c5f27bb6c2.png
\.


--
-- Data for Name: review_user; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.review_user (id, reviewer_id, user_id, rating, comment, created_at, updated_at) FROM stdin;
44444440-4444-4444-b444-444444444440	1051d31f-19d2-4bae-bb9c-ccc706640688	36128b7f-da99-4e10-9f4d-605b1abb61b2	5	Great service!	2025-04-26 04:37:43.791412+00	2025-04-28 05:42:00.164888+00
\.


--
-- Data for Name: review_user_image; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.review_user_image (id, review_id, path) FROM stdin;
55555550-5555-4555-b555-555555555550	44444440-4444-4444-b444-444444444440	/review_images/great_service.jpg
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.session (id, user_id, token, expires_at, ip_address, user_agent, created_at, updated_at) FROM stdin;
064319c7-1287-47bc-be3c-3d745d0b3e4c	1051d31f-19d2-4bae-bb9c-ccc706640688	f4ldpR3jFkONpLRxPcBHx0nduYJAnd33	2025-05-03 21:59:08.049	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 21:59:08.049	2025-04-26 21:59:08.049
e0f7cd5d-3ec3-4db8-91b8-e59072311505	1051d31f-19d2-4bae-bb9c-ccc706640688	tbq3mTCSwWZV7nmSHWyzLrKTaXLeNcFL	2025-04-27 22:12:31	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:12:31.001	2025-04-26 22:12:31.001
437410cd-e4c0-4f97-aa87-bb9cec5bc94c	1051d31f-19d2-4bae-bb9c-ccc706640688	ae6E52ncchgoNv4zNIerh3RUnwi7XD3X	2025-04-27 22:13:03.662	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:13:03.662	2025-04-26 22:13:03.662
48ebe347-c07b-43a5-954a-8e355ebd862b	1051d31f-19d2-4bae-bb9c-ccc706640688	td8nXm08dLVte668Zm7x3k8SmmiHdVdU	2025-05-03 22:14:28.974	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:13:19.64	2025-04-26 22:13:19.64
d124799b-8c13-4c8c-8ad1-e72c6ebf73c9	1051d31f-19d2-4bae-bb9c-ccc706640688	MQwUGIcIFl0Xl36HNApfu0cowloTbDUN	2025-04-27 22:58:10.919	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:58:10.921	2025-04-26 22:58:10.921
80bc3c51-7eda-4895-815d-06c12d0c6f7e	1051d31f-19d2-4bae-bb9c-ccc706640688	qfnIWz2seXWE9GPpNopwWSke2lnKnft2	2025-04-27 22:59:11.664	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:59:11.664	2025-04-26 22:59:11.664
b355d038-3f61-4645-9d84-d432082b7d9a	1051d31f-19d2-4bae-bb9c-ccc706640688	OXvX7NohzJ3ECVPRfCeeMeuUWC8Kt2uf	2025-04-27 22:59:18.239	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:59:18.239	2025-04-26 22:59:18.239
27ad16aa-620b-42d0-b5e1-33658d321b94	1051d31f-19d2-4bae-bb9c-ccc706640688	EuErwYDVczGoTQ4QMRDthOCyQw4B1LEK	2025-04-27 22:59:33.745	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-26 22:59:33.745	2025-04-26 22:59:33.745
92517e84-8e9d-46bc-ae4e-3646cb44b6c1	1051d31f-19d2-4bae-bb9c-ccc706640688	6umQnAUiQXCSGww8f6X2L7iHYtw2SOtJ	2025-04-28 14:43:47.6	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36	2025-04-27 14:43:47.603	2025-04-27 14:43:47.603
7cdeba48-100a-4f61-a18c-7183b1e12fb9	1051d31f-19d2-4bae-bb9c-ccc706640688	feB4HCJIMIMJFQtNAbclSOABKeVudmPL	2025-04-28 14:43:49.958	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36	2025-04-27 14:43:49.958	2025-04-27 14:43:49.958
02253981-4793-4add-9464-5147e2edd74b	36128b7f-da99-4e10-9f4d-605b1abb61b2	JhHGPUQuseX0yaKVn2jWKL83ZH6XWkPb	2025-05-05 12:37:18.788	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-28 12:37:18.788	2025-04-28 12:37:18.788
68a06c61-b304-4182-bec3-6638c8a28e89	1051d31f-19d2-4bae-bb9c-ccc706640688	jfHhzVgfOIlqIgvrljHZdvfZY8hv7Dit	2025-04-29 12:47:13.243	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-28 12:47:13.243	2025-04-28 12:47:13.243
a966171d-f35b-4ee4-bb1d-ad102a0551a0	36128b7f-da99-4e10-9f4d-605b1abb61b2	2G1kjuHMUCYr442fyn48qzlH0qvEkB4U	2025-04-29 12:47:33.711	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-28 12:47:33.711	2025-04-28 12:47:33.711
f0437d32-1189-4ea6-a1b6-d75a87486aec	1051d31f-19d2-4bae-bb9c-ccc706640688	Gjg7n3fZfOD0rLcanuGeVyf8L2BIPqEN	2025-04-29 12:48:51.718	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-28 12:48:51.718	2025-04-28 12:48:51.718
2d45c2f5-cf0e-49d9-9820-d6538ca1aacd	36128b7f-da99-4e10-9f4d-605b1abb61b2	koPGuN8dakNXnIuFtpG0g0j8ScCDxE5v	2025-04-29 19:14:34.87	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-28 19:14:34.87	2025-04-28 19:14:34.87
be85dd6c-ba98-4c68-bf25-fa9b6cdb844b	36128b7f-da99-4e10-9f4d-605b1abb61b2	yz8XQnKm3uwfURBrvf697BDLeBgYzrgN	2025-04-29 19:14:36.179	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-04-28 19:14:36.179	2025-04-28 19:14:36.179
d57c246b-ee3b-430e-86cb-aa083c5c5952	1051d31f-19d2-4bae-bb9c-ccc706640688	2o0EKWpEzf2Olks3YJJnpV9PIl1SFiUa	2025-04-29 19:17:15.178	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36	2025-04-28 19:17:15.178	2025-04-28 19:17:15.178
a9d50a81-1fee-477c-9005-a2aea2a9621c	36128b7f-da99-4e10-9f4d-605b1abb61b2	PdAh2SrV4JmiyAqqtFjSP8xXW6Zu6y1O	2025-05-07 22:47:22.862	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	2025-05-06 22:47:22.862	2025-05-06 22:47:22.862
cab4faea-3f25-45bd-be4e-cee804f858fc	1051d31f-19d2-4bae-bb9c-ccc706640688	wR1EyKqH0nIeNJ8k0OIuAXc7lcV0WUER	2025-05-05 14:33:36.556	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36	2025-05-04 14:33:36.556	2025-05-04 14:33:36.556
c9c1408a-f84c-45d8-bc45-1e64028cb2c7	1051d31f-19d2-4bae-bb9c-ccc706640688	v2cIxjpm6uW8YnmgbaZqPWfZDQ5TNPcd	2025-05-07 22:49:18.954	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0	2025-05-06 22:49:18.954	2025-05-06 22:49:18.954
1a2974a4-0442-4be6-9fea-a24e8ce2b663	36128b7f-da99-4e10-9f4d-605b1abb61b2	955dMOT5EiMZj5qW3yub4UrrPHeuCPdW	2025-05-10 16:21:10.015	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0	2025-05-09 16:21:10.016	2025-05-09 16:21:10.016
108e3c2a-0b31-47eb-ba45-289d2f0a42a8	1051d31f-19d2-4bae-bb9c-ccc706640688	2QcynDcFL6dxcCy4HxTTjFuqhzT2mOQ2	2025-05-10 18:04:31.296	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36	2025-05-09 18:04:31.296	2025-05-09 18:04:31.296
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public."user" (id, name, email, email_verified, user_image, created_at, updated_at, user_type) FROM stdin;
1051d31f-19d2-4bae-bb9c-ccc706640688	John Doe	john@example.com	f	\N	2025-04-26 21:59:07.867	2025-04-27 06:08:00.581636	renter
36128b7f-da99-4e10-9f4d-605b1abb61b2	Jane Smith	jane@example.com	f	\N	2025-04-28 12:37:18.377	2025-04-28 05:42:57.305647	lessor
\.


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.user_info (id, user_id, first_name, last_name, gender, birth_date, citizen_id, phone_number, created_at, updated_at) FROM stdin;
d32d88dc-2d9e-4a20-a007-c63e8f16fd75	1051d31f-19d2-4bae-bb9c-ccc706640688	John	Doe	M	1992-01-25	9876543210988	0897654320	2025-04-27 13:57:55.837885+00	2025-04-27 13:58:52.415945+00
c5ec1ea3-8041-479d-b57d-4634ffb3cd24	36128b7f-da99-4e10-9f4d-605b1abb61b2	Jane	Smith	F	1992-02-02	9876543210987	0897654321	2025-04-28 06:21:43.138748+00	2025-04-28 06:21:43.138748+00
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.verification (id, identifier, value, expires_at, created_at, updated_at) FROM stdin;
88888880-8888-4888-b888-888888888880	john@example.com	123456	2025-05-01 23:59:59	2025-04-26 04:40:58.107182	2025-04-26 04:40:58.107182
\.


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: item_image item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.item_image
    ADD CONSTRAINT item_image_pkey PRIMARY KEY (id);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: keyword keyword_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.keyword
    ADD CONSTRAINT keyword_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: rental_address rental_address_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental_address
    ADD CONSTRAINT rental_address_pkey PRIMARY KEY (id);


--
-- Name: rental rental_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_pkey PRIMARY KEY (id);


--
-- Name: review_item_image review_item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_item_image
    ADD CONSTRAINT review_item_image_pkey PRIMARY KEY (id);


--
-- Name: review_item review_item_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_item
    ADD CONSTRAINT review_item_pkey PRIMARY KEY (id);


--
-- Name: review_user_image review_user_image_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_user_image
    ADD CONSTRAINT review_user_image_pkey PRIMARY KEY (id);


--
-- Name: review_user review_user_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_user
    ADD CONSTRAINT review_user_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user_info user_info_citizen_id_key; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_citizen_id_key UNIQUE (citizen_id);


--
-- Name: user_info user_info_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_phone_number_key UNIQUE (phone_number);


--
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: address update_address; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_address BEFORE UPDATE ON public.address FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: category update_category; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_category BEFORE UPDATE ON public.category FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: item update_item; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_item BEFORE UPDATE ON public.item FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: payment update_payment; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_payment BEFORE UPDATE ON public.payment FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: rental update_rental; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_rental BEFORE UPDATE ON public.rental FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: review_item update_review_item; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_review_item BEFORE UPDATE ON public.review_item FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: review_item_image update_review_item_image; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_review_item_image BEFORE UPDATE ON public.review_item_image FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: review_user update_review_user; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_review_user BEFORE UPDATE ON public.review_user FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: review_user_image update_review_user_image; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_review_user_image BEFORE UPDATE ON public.review_user_image FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: user update_user; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_user BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: user_info update_user_info; Type: TRIGGER; Schema: public; Owner: server
--

CREATE TRIGGER update_user_info BEFORE UPDATE ON public.user_info FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: account account_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: rental delivery; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT delivery FOREIGN KEY (delivery_address) REFERENCES public.rental_address(id) ON DELETE CASCADE;


--
-- Name: address has; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT has FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: review_item_image image_for; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_item_image
    ADD CONSTRAINT image_for FOREIGN KEY (review_id) REFERENCES public.review_item(id) ON DELETE CASCADE;


--
-- Name: item_image image_for; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.item_image
    ADD CONSTRAINT image_for FOREIGN KEY (item_id) REFERENCES public.item(id) ON DELETE CASCADE;


--
-- Name: review_user_image image_for; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_user_image
    ADD CONSTRAINT image_for FOREIGN KEY (review_id) REFERENCES public.review_user(id) ON DELETE CASCADE;


--
-- Name: item in_category; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT in_category FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: rental involves; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT involves FOREIGN KEY (item_id) REFERENCES public.item(id) ON DELETE CASCADE;


--
-- Name: keyword keyword_for; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.keyword
    ADD CONSTRAINT keyword_for FOREIGN KEY (item_id) REFERENCES public.item(id) ON DELETE CASCADE;


--
-- Name: payment make; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT make FOREIGN KEY (renter_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: item owns; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT owns FOREIGN KEY (owner_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: rental payment_by; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT payment_by FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE CASCADE;


--
-- Name: rental rents; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rents FOREIGN KEY (renter_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: rental return; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT return FOREIGN KEY (return_address) REFERENCES public.rental_address(id) ON DELETE CASCADE;


--
-- Name: review_user review_by; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_user
    ADD CONSTRAINT review_by FOREIGN KEY (reviewer_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: review_item review_by; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_item
    ADD CONSTRAINT review_by FOREIGN KEY (reviewer_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: session session_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: review_item target_item_review; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_item
    ADD CONSTRAINT target_item_review FOREIGN KEY (item_id) REFERENCES public.item(id) ON DELETE CASCADE;


--
-- Name: review_user target_user_review; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.review_user
    ADD CONSTRAINT target_user_review FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_info user_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

