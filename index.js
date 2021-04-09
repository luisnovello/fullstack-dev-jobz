const express = require('express');
const server = express();
const axios = require('axios');

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.static('public'));

// const bodyParser = require('body-parser');
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: false }));

server.post('/job-search', async (req, res) => {
  try {
    const { description, fulltime } = req.body;

    const URL = `https://jobs.github.com/positions.json?${
      description ? `description=${ description }&` : ''
    }${
      fulltime ? 'fulltime=true' : ''
    }`;

    const { data } = await axios.get(URL);

    res.send({ results: data });
  } catch (error) {
    res.send({ error });
  }
});

server.listen(3000, () => {
  console.log('I am listening...');
});