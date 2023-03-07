require('dotenv').config();
const express = require('express');
const filmRouter = require('./routes/film.routes');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/api', filmRouter);

app.listen(PORT, () => console.log(`server start on port ${PORT}`)); 