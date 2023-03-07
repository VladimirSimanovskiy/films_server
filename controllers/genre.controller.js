const db = require('../db');

class GenreController {
  async createGenre(req, res) {
    const { genre_name } = req.body;
    console.log(genre_name);
    const newGenre = await db.query(
      `INSERT INTO genre (genre_name)
       VALUES ($1) RETURNING *`,
       [genre_name]
    );
    res.json(newGenre.rows[0]);
  }

  async getGenre(req, res) {
    const genre = await db.query(
      `SELECT genre.genre_id, genre.genre_name, array_agg(film_name) film
       FROM genre
       LEFT JOIN film_genre USING (genre_id)
       LEFT JOIN film ON film.film_id = film_genre.film_id
       GROUP BY genre_id, genre_name
       ORDER BY genre_id`
    );
    res.json(genre.rows);
  }

  async getOneGenre(req, res) {
    const id = req.params.id;
    const genre = await db.query(
      `SELECT genre.genre_id, genre.genre_name, array_agg(film_name) film
       FROM genre
       LEFT JOIN film_genre USING (genre_id)
       LEFT JOIN film ON film.film_id = film_genre.film_id
       WHERE genre_id = ${id}
       GROUP BY genre_id, genre_name
       ORDER BY genre_id`
    )
    res.json(genre.rows[0]);
  }

  async updateGenre(req, res) {
    const { genre_id, genre_name } = req.body;
    const updGenre = await db.query(
      `UPDATE genre
       SET genre_name = $1
       WHERE genre_id = $2
       RETURNING *`,
       [genre_name, genre_id]
    );
    res.json(updGenre.rows[0]);
  }

  async deleteGenre(req, res) {
    const id = req.params.id;
    const genre = await db.query(
      'DELETE FROM genre WHERE genre_id = $1 RETURNING *', [id]);
    res.json(genre.rows[0]);
  }
};

module.exports = new GenreController();