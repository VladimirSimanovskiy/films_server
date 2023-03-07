const db = require('../db');

class FilmController {
  async createFilm(req, res) {
    const { film_name, release_year, genres } = req.body;
    const newFilm = await db.query(
      `INSERT INTO film (film_name, release_year)
       VALUES ($1, $2) RETURNING *`, [film_name, release_year]
      );
    const newFilmID = newFilm.rows[0].film_id;
    if (Array.isArray(genres)) {
      for (let genre of genres) {
        try {
          let g_id = await db.query(
            `SELECT genre_id FROM genre WHERE genre_name = '${genre}'`);
          g_id = g_id.rows[0].genre_id;
          await db.query(
            `INSERT INTO film_genre
             VALUES
             (${+newFilmID}, ${+g_id})`
          );
        } catch (err) {
          let newGenre = await db.query(
            `INSERT INTO genre(genre_name)
             VALUES ('${genre}')
             RETURNING *`
          );
          let g_id = newGenre.rows[0].genre_id;
          await db.query(
            `INSERT INTO film_genre
             VALUES
             (${+newFilmID}, ${+g_id})`
          );
        }
      }
    };
    const newFilmGenre = await db.query(
        `SELECT film.film_name, film.release_year, array_agg(genre_name) genre
        FROM film
        LEFT JOIN film_genre ON film_genre.film_id = film.film_id
        LEFT JOIN genre ON genre.genre_id = film_genre.genre_id
        WHERE film.film_id = ${+newFilmID}
        GROUP BY film_name, release_year
        ORDER BY film_name`
    );
    res.json(newFilmGenre.rows);
  }

  async getFilm(req, res) {
    const films = await db.query(
    `SELECT film.film_id, film.film_name, film.release_year, array_agg(genre_name) genre
     FROM film
     LEFT JOIN film_genre ON film_genre.film_id = film.film_id
     LEFT JOIN genre ON genre.genre_id = film_genre.genre_id
     GROUP BY film.film_id, film_name, release_year
	   ORDER BY film_id`
    );
    res.json(films.rows);
  }

  async getOneFilm(req, res) {
    const id = req.params.id;
    const film = await db.query(
      `SELECT film.film_name, film.release_year, array_agg(genre_name) genre
       FROM film
       LEFT JOIN film_genre ON film_genre.film_id = film.film_id
       LEFT JOIN genre ON genre.genre_id = film_genre.genre_id
       WHERE film.film_id = ${id}
       GROUP BY film_name, release_year
       ORDER BY film_name`
      );
    res.json(film.rows[0]);
  }

  async updateFilm(req, res) {
    const { film_id, film_name, release_year, genres } = req.body;
    await db.query(
      `UPDATE film 
       SET film_name = $1, release_year = $2
       WHERE film_id = $3
       RETURNING *`, 
       [film_name, release_year, film_id]
    );
    if (Array.isArray(genres)) {
      await db.query(
        'DELETE FROM film_genre WHERE film_id = $1', [film_id]);
      for (let genre of genres) {
        try {
          let g_id = await db.query(
            `SELECT genre_id FROM genre WHERE genre_name = '${genre}'`);
          g_id = g_id.rows[0].genre_id;
          await db.query(
            `INSERT INTO film_genre
             VALUES
             (${+film_id}, ${+g_id})`
          );

        } catch (err) {
          let newGenre = await db.query(
            `INSERT INTO genre(genre_name)
             VALUES ('${genre}')
             RETURNING *`
          );
          let g_id = newGenre.rows[0].genre_id;
          await db.query(
            `INSERT INTO film_genre
             VALUES
             (${+film_id}, ${+g_id})`
          );
        }
      }
    };
    const updFilm = await db.query(
      `SELECT film.film_name, film.release_year, array_agg(genre_name) genre
       FROM film
       LEFT JOIN film_genre ON film_genre.film_id = film.film_id
       LEFT JOIN genre ON genre.genre_id = film_genre.genre_id
       WHERE film.film_id = ${film_id}
       GROUP BY film_name, release_year
       ORDER BY film_name`
    );
    res.json(updFilm.rows);
  }

  async deleteFilm(req, res) {
    const id = req.params.id;
    //const filmName = await db.query(
    //  `SELECT film_name FROM film WHERE film_id = ${id}`);
    const film = await db.query(
      'DELETE FROM film WHERE film_id = $1 RETURNING *', [id]);
    res.json(film.rows[0]);
  }
};

module.exports = new FilmController();