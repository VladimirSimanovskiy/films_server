--
-- Create DB
--
CREATE DATABASE "Films"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

--
-- Create tables
--

CREATE TABLE genre (
  genre_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  genre_name text NOT NULL,

  CONSTRAINT pk_genre_genre_id PRIMARY KEY (genre_id),
  CONSTRAINT genre_name_unique UNIQUE (genre_name)
);

CREATE TABLE film (
  film_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  film_name text NOT NULL,
  release_year int NOT NULL CONSTRAINT chk_film_release_year CHECK (release_year >= 1895 AND release_year <= 2050),

  CONSTRAINT pk_film_film_id PRIMARY KEY (film_id),
  CONSTRAINT film_name_unique UNIQUE (film_name)
);

CREATE TABLE film_genre (
  film_id bigint REFERENCES film(film_id) ON DELETE CASCADE,
  genre_id bigint REFERENCES genre(genre_id) ON DELETE CASCADE,

  CONSTRAINT pk_film_genre PRIMARY KEY (film_id, genre_id),
  CONSTRAINT fk_film_id FOREIGN KEY (film_id) REFERENCES film(film_id),
  CONSTRAINT fk_genre_id FOREIGN KEY (genre_id) REFERENCES genre(genre_id)
);
