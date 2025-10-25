--
-- PostgreSQL database dump
--

\restrict 3lFnvBAsTYr62U9xdLM5eCjOQgJZK5JshaWhscWnLSn2SuTGEQuUYUMhgYoNFns

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-25 21:37:33

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16597)
-- Name: bufe; Type: TABLE; Schema: public; Owner: bufe
--

CREATE TABLE public.bufe (
    id integer NOT NULL,
    nev character varying(100) NOT NULL,
    aktiv character(1) DEFAULT '1'::bpchar NOT NULL
);


ALTER TABLE public.bufe OWNER TO bufe;

--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE bufe; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON TABLE public.bufe IS 'Büfé';


--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bufe.id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe.id IS 'Azonosító';


--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bufe.nev; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe.nev IS 'Felhasználói név';


--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bufe.aktiv; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe.aktiv IS 'Aktív-e';


--
-- TOC entry 218 (class 1259 OID 16601)
-- Name: bufe_forgalom; Type: TABLE; Schema: public; Owner: bufe
--

CREATE TABLE public.bufe_forgalom (
    id integer NOT NULL,
    bufe_id integer NOT NULL,
    muvelet integer NOT NULL,
    termek_id integer NOT NULL,
    ear integer NOT NULL,
    mennyiseg integer NOT NULL,
    valtozas integer NOT NULL,
    bufe_usr_id integer,
    usr_valtozas integer,
    at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.bufe_forgalom OWNER TO bufe;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE bufe_forgalom; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON TABLE public.bufe_forgalom IS 'Büfé forgalma';


--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.id IS 'Azonosító';


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.bufe_id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.bufe_id IS 'Büfé';


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.muvelet; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.muvelet IS 'Művelet:   1: +tagi betét  2: -tagi kivét  3: +vásárlói befizetés  4: -vásárlás  5: +árubeszerzés  6: +árubeszerzés ára  7: +leltár többlet  8: -leltár hiány';


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.termek_id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.termek_id IS 'Érintett termék. Pénz: id=1';


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.ear; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.ear IS 'Egységár. Pénznél 1';


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.mennyiseg; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.mennyiseg IS 'Változás mennyisége (előjeles)';


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.valtozas; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.valtozas IS 'Változás értéke (ear*mennyiseg)';


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.bufe_usr_id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.bufe_usr_id IS 'Érintett felhasználó (csak 3, 4 műveletnél.';


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.usr_valtozas; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.usr_valtozas IS 'A felhasználó számláján a változás értéke. Csak 3, 4 műveleteknél.';


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN bufe_forgalom.at; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_forgalom.at IS 'A változás időpontja.';


--
-- TOC entry 219 (class 1259 OID 16605)
-- Name: bufe_forgalom_id_seq; Type: SEQUENCE; Schema: public; Owner: bufe
--

CREATE SEQUENCE public.bufe_forgalom_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bufe_forgalom_id_seq OWNER TO bufe;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 219
-- Name: bufe_forgalom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bufe
--

ALTER SEQUENCE public.bufe_forgalom_id_seq OWNED BY public.bufe_forgalom.id;


--
-- TOC entry 220 (class 1259 OID 16606)
-- Name: bufe_id_seq; Type: SEQUENCE; Schema: public; Owner: bufe
--

CREATE SEQUENCE public.bufe_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bufe_id_seq OWNER TO bufe;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 220
-- Name: bufe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bufe
--

ALTER SEQUENCE public.bufe_id_seq OWNED BY public.bufe.id;


--
-- TOC entry 221 (class 1259 OID 16607)
-- Name: bufe_usr; Type: TABLE; Schema: public; Owner: bufe
--

CREATE TABLE public.bufe_usr (
    id integer NOT NULL,
    bufe_id integer NOT NULL,
    usr_id integer NOT NULL,
    penztaros character(1) NOT NULL,
    hitel_keret integer NOT NULL,
    plus_arres integer NOT NULL,
    minus_arres integer NOT NULL,
    aktiv character(1) DEFAULT '1'::bpchar NOT NULL
);


ALTER TABLE public.bufe_usr OWNER TO bufe;

--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE bufe_usr; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON TABLE public.bufe_usr IS 'Büfé felhasználói';


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.id IS 'Azonosító';


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.bufe_id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.bufe_id IS 'Büfé';


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.usr_id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.usr_id IS 'Felhasználó';


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.penztaros; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.penztaros IS 'Pénztáros-e';


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.hitel_keret; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.hitel_keret IS 'Ennyire mehet mínuszba';


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.plus_arres; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.plus_arres IS 'Árrés, ha pluszban van';


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.minus_arres; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.minus_arres IS 'Árrés, ha mínuszban van';


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN bufe_usr.aktiv; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.bufe_usr.aktiv IS 'Aktív-e';


--
-- TOC entry 222 (class 1259 OID 16611)
-- Name: bufe_usr_id_seq; Type: SEQUENCE; Schema: public; Owner: bufe
--

CREATE SEQUENCE public.bufe_usr_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bufe_usr_id_seq OWNER TO bufe;

--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 222
-- Name: bufe_usr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bufe
--

ALTER SEQUENCE public.bufe_usr_id_seq OWNED BY public.bufe_usr.id;


--
-- TOC entry 223 (class 1259 OID 16618)
-- Name: termek; Type: TABLE; Schema: public; Owner: bufe
--

CREATE TABLE public.termek (
    id integer NOT NULL,
    nev character varying(100) NOT NULL,
    vonal_kod character varying(100) NOT NULL,
    aktiv character(1) DEFAULT '1'::bpchar NOT NULL
);


ALTER TABLE public.termek OWNER TO bufe;

--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE termek; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON TABLE public.termek IS 'Terméktörzs. A pénz is egy speciális termék - id=1.';


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN termek.id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.termek.id IS 'Azonosító';


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN termek.nev; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.termek.nev IS 'Termék név';


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN termek.vonal_kod; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.termek.vonal_kod IS 'Vonalkód';


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN termek.aktiv; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.termek.aktiv IS 'Aktív-e';


--
-- TOC entry 224 (class 1259 OID 16622)
-- Name: termek_id_seq; Type: SEQUENCE; Schema: public; Owner: bufe
--

CREATE SEQUENCE public.termek_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.termek_id_seq OWNER TO bufe;

--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 224
-- Name: termek_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bufe
--

ALTER SEQUENCE public.termek_id_seq OWNED BY public.termek.id;


--
-- TOC entry 225 (class 1259 OID 16623)
-- Name: usr; Type: TABLE; Schema: public; Owner: bufe
--

CREATE TABLE public.usr (
    id integer NOT NULL,
    nev character varying(100) NOT NULL,
    teljes_nev character varying(100) DEFAULT 'Unknown'::character varying NOT NULL,
    jelszo character varying(100) NOT NULL,
    email character varying(255),
    admin character(1) NOT NULL,
    aktiv character(1) DEFAULT '1'::bpchar NOT NULL
);


ALTER TABLE public.usr OWNER TO bufe;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE usr; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON TABLE public.usr IS 'Felhasználó';


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.id; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.id IS 'Azonosító';


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.nev; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.nev IS 'Felhasználói név';


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.teljes_nev; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.teljes_nev IS 'Teljes név';


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.jelszo; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.jelszo IS 'Jelszó';


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.email; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.email IS 'E-mail cím';


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.admin; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.admin IS 'Admin-e';


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN usr.aktiv; Type: COMMENT; Schema: public; Owner: bufe
--

COMMENT ON COLUMN public.usr.aktiv IS 'Aktív-e';


--
-- TOC entry 226 (class 1259 OID 16630)
-- Name: usr_id_seq; Type: SEQUENCE; Schema: public; Owner: bufe
--

CREATE SEQUENCE public.usr_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usr_id_seq OWNER TO bufe;

--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 226
-- Name: usr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bufe
--

ALTER SEQUENCE public.usr_id_seq OWNED BY public.usr.id;


--
-- TOC entry 4656 (class 2604 OID 16631)
-- Name: bufe id; Type: DEFAULT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe ALTER COLUMN id SET DEFAULT nextval('public.bufe_id_seq'::regclass);


--
-- TOC entry 4658 (class 2604 OID 16632)
-- Name: bufe_forgalom id; Type: DEFAULT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_forgalom ALTER COLUMN id SET DEFAULT nextval('public.bufe_forgalom_id_seq'::regclass);


--
-- TOC entry 4660 (class 2604 OID 16633)
-- Name: bufe_usr id; Type: DEFAULT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_usr ALTER COLUMN id SET DEFAULT nextval('public.bufe_usr_id_seq'::regclass);


--
-- TOC entry 4662 (class 2604 OID 16635)
-- Name: termek id; Type: DEFAULT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.termek ALTER COLUMN id SET DEFAULT nextval('public.termek_id_seq'::regclass);


--
-- TOC entry 4664 (class 2604 OID 16636)
-- Name: usr id; Type: DEFAULT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.usr ALTER COLUMN id SET DEFAULT nextval('public.usr_id_seq'::regclass);


--
-- TOC entry 4839 (class 0 OID 16597)
-- Dependencies: 217
-- Data for Name: bufe; Type: TABLE DATA; Schema: public; Owner: bufe
--

COPY public.bufe (id, nev, aktiv) FROM stdin;
20001	Teszt büfé	1
\.


--
-- TOC entry 4840 (class 0 OID 16601)
-- Dependencies: 218
-- Data for Name: bufe_forgalom; Type: TABLE DATA; Schema: public; Owner: bufe
--

COPY public.bufe_forgalom (id, bufe_id, muvelet, termek_id, ear, mennyiseg, valtozas, bufe_usr_id, usr_valtozas, at) FROM stdin;
20001	20001	3	1	1	1000	1000	20001	1000	2025-10-15 21:11:07.449
20002	20001	3	1	1	500	500	20002	500	2025-10-15 21:11:26.465
20003	20001	5	20004	199	5	995	\N	\N	2025-10-15 21:13:08.499
20004	20001	5	20005	329	3	987	\N	\N	2025-10-15 21:13:08.499
20005	20001	5	20003	439	5	2195	\N	\N	2025-10-15 21:13:08.499
20006	20001	4	20004	199	-1	-199	20001	-199	2025-10-20 21:17:15.519
20007	20001	4	20004	199	-1	-199	20002	-219	2025-10-23 21:18:30.918
\.


--
-- TOC entry 4843 (class 0 OID 16607)
-- Dependencies: 221
-- Data for Name: bufe_usr; Type: TABLE DATA; Schema: public; Owner: bufe
--

COPY public.bufe_usr (id, bufe_id, usr_id, penztaros, hitel_keret, plus_arres, minus_arres, aktiv) FROM stdin;
20001	20001	20001	1	1000	0	10	1
20002	20001	20002	0	0	10	20	1
\.


--
-- TOC entry 4845 (class 0 OID 16618)
-- Dependencies: 223
-- Data for Name: termek; Type: TABLE DATA; Schema: public; Owner: bufe
--

COPY public.termek (id, nev, vonal_kod, aktiv) FROM stdin;
1	KP	0	1
20003	Sport kókusz duo	7622210954343	1
20004	Balaton szelet ét	8445290860668	1
20005	Mogyi crash hagymás-tejfölös mogyoró	5997347542902	1
\.


--
-- TOC entry 4847 (class 0 OID 16623)
-- Dependencies: 225
-- Data for Name: usr; Type: TABLE DATA; Schema: public; Owner: bufe
--

COPY public.usr (id, nev, teljes_nev, jelszo, email, admin, aktiv) FROM stdin;
20001	tesztadmin	Teszt Admin	E28E631B79673C675B46CEB178996F13D57B94A8F24C323DFF5B8D05B14D8D70	tesztadmin@tesztadmin.teszt	1	1
20002	tesztuser	Teszt User	E28E631B79673C675B46CEB178996F13D57B94A8F24C323DFF5B8D05B14D8D70	tesztuser@tesztuser.teszt	0	1
\.


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 219
-- Name: bufe_forgalom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bufe
--

SELECT pg_catalog.setval('public.bufe_forgalom_id_seq', 20007, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 220
-- Name: bufe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bufe
--

SELECT pg_catalog.setval('public.bufe_id_seq', 20001, true);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 222
-- Name: bufe_usr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bufe
--

SELECT pg_catalog.setval('public.bufe_usr_id_seq', 20002, true);


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 224
-- Name: termek_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bufe
--

SELECT pg_catalog.setval('public.termek_id_seq', 20005, true);


--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 226
-- Name: usr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bufe
--

SELECT pg_catalog.setval('public.usr_id_seq', 20005, true);


--
-- TOC entry 4672 (class 2606 OID 16638)
-- Name: bufe_forgalom bufe_forgalom_pk; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_forgalom
    ADD CONSTRAINT bufe_forgalom_pk PRIMARY KEY (id);


--
-- TOC entry 4668 (class 2606 OID 16640)
-- Name: bufe bufe_pk; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe
    ADD CONSTRAINT bufe_pk PRIMARY KEY (id);


--
-- TOC entry 4670 (class 2606 OID 16642)
-- Name: bufe bufe_uq1; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe
    ADD CONSTRAINT bufe_uq1 UNIQUE (nev);


--
-- TOC entry 4674 (class 2606 OID 16644)
-- Name: bufe_usr bufe_usr_pk; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_usr
    ADD CONSTRAINT bufe_usr_pk PRIMARY KEY (id);


--
-- TOC entry 4676 (class 2606 OID 16646)
-- Name: bufe_usr bufe_usr_uq1; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_usr
    ADD CONSTRAINT bufe_usr_uq1 UNIQUE (bufe_id, usr_id);


--
-- TOC entry 4678 (class 2606 OID 16650)
-- Name: termek termek_pk; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.termek
    ADD CONSTRAINT termek_pk PRIMARY KEY (id);


--
-- TOC entry 4680 (class 2606 OID 16652)
-- Name: termek termek_uq1; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.termek
    ADD CONSTRAINT termek_uq1 UNIQUE (nev);


--
-- TOC entry 4682 (class 2606 OID 16654)
-- Name: termek termek_uq2; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.termek
    ADD CONSTRAINT termek_uq2 UNIQUE (vonal_kod);


--
-- TOC entry 4684 (class 2606 OID 16656)
-- Name: usr usr_pk; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.usr
    ADD CONSTRAINT usr_pk PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16658)
-- Name: usr usr_uq1; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.usr
    ADD CONSTRAINT usr_uq1 UNIQUE (nev);


--
-- TOC entry 4688 (class 2606 OID 16660)
-- Name: usr usr_uq2; Type: CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.usr
    ADD CONSTRAINT usr_uq2 UNIQUE (email);


--
-- TOC entry 4689 (class 2606 OID 16661)
-- Name: bufe_forgalom bufe_forgalom_fk1; Type: FK CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_forgalom
    ADD CONSTRAINT bufe_forgalom_fk1 FOREIGN KEY (bufe_id) REFERENCES public.bufe(id);


--
-- TOC entry 4690 (class 2606 OID 16666)
-- Name: bufe_forgalom bufe_forgalom_fk2; Type: FK CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_forgalom
    ADD CONSTRAINT bufe_forgalom_fk2 FOREIGN KEY (termek_id) REFERENCES public.termek(id);


--
-- TOC entry 4691 (class 2606 OID 16671)
-- Name: bufe_forgalom bufe_forgalom_fk3; Type: FK CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_forgalom
    ADD CONSTRAINT bufe_forgalom_fk3 FOREIGN KEY (bufe_usr_id) REFERENCES public.bufe_usr(id);


--
-- TOC entry 4692 (class 2606 OID 16676)
-- Name: bufe_usr bufe_usr_fk1; Type: FK CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_usr
    ADD CONSTRAINT bufe_usr_fk1 FOREIGN KEY (bufe_id) REFERENCES public.bufe(id);


--
-- TOC entry 4693 (class 2606 OID 16681)
-- Name: bufe_usr bufe_usr_fk2; Type: FK CONSTRAINT; Schema: public; Owner: bufe
--

ALTER TABLE ONLY public.bufe_usr
    ADD CONSTRAINT bufe_usr_fk2 FOREIGN KEY (usr_id) REFERENCES public.usr(id);


-- Completed on 2025-10-25 21:37:33

--
-- PostgreSQL database dump complete
--

\unrestrict 3lFnvBAsTYr62U9xdLM5eCjOQgJZK5JshaWhscWnLSn2SuTGEQuUYUMhgYoNFns

