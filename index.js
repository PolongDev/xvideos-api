const express = require('express');
const xvideos = require('xvideosx');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
let totalRequest = 0;

require('events').EventEmitter.defaultMaxListeners = 15;

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds cooldown
  max: 1, // Max 1 request per windowMs
  keyGenerator: function (req /*, res*/) {
    return req.ip + req.query.link; // Using IP address and link as identifiers
  },
  handler: function (req, res) {
    res
      .status(429)
      .json({ status: 'failed', error: 'In cooldown, please wait' });
  },
});

app.use(helmet());
app.use(cors());
app.use(compression());

const jsonFilePath = 'responses.json';

// Function to fetch and save response
const fetchAndSaveResponse = async () => {
  try {
    // Read existing responses from file
    let responses = [];
    if (fs.existsSync(jsonFilePath)) {
      const data = fs.readFileSync(jsonFilePath);
      responses = JSON.parse(data);
    }

    // Only fetch new response if responses array length is less than 10 or if it's empty
    if (responses.length === 0 || responses.length < 10) {
      const page = Math.floor(Math.random() * 100) + 1;
      const freshList = await xvideos.videos.fresh({ page });

      const randomVideo =
        freshList.videos[Math.floor(Math.random() * freshList.videos.length)];
      const videoDetails = await xvideos.videos.details(randomVideo);

      const { title, url, duration, files } = videoDetails;

      const response = {
        title: title || 'No Title',
        url,
        duration,
        thumbnail: files.thumb,
        video: files.low || null,
      }; // video_hd: files.high || null,

      // Add new response to responses array
      responses.push(response);

      // Limit the responses array to 10 items
      if (responses.length > 10) {
        responses.shift(); // Remove the oldest response
      }

      // Write responses back to file
      fs.writeFileSync(jsonFilePath, JSON.stringify(responses, null, 2));
    }
  } catch (error) {
    console.error('Error fetching and saving response:', error);
  }
};

// Fetch and save response initially
fetchAndSaveResponse();

// Fetch and save response every 10 seconds
setInterval(fetchAndSaveResponse, 10 * 1000);

app.get('/', (req, res) => {
  res.send('Hello, malibogz!');
});

app.get('/api/xvideos/get', limiter, async (req, res) => {
  try {
    // Read responses from file
    const data = fs.readFileSync(jsonFilePath);
    let responses = JSON.parse(data);

    // If responses array is empty, directly fetch a response from xvideos API
    if (responses.length === 0) {
      const page = Math.floor(Math.random() * 100) + 1;
      const freshList = await xvideos.videos.fresh({ page });

      const randomVideo =
        freshList.videos[Math.floor(Math.random() * freshList.videos.length)];
      const videoDetails = await xvideos.videos.details(randomVideo);

      const { title, url, duration, files } = videoDetails;

      totalRequest++;
      console.log(`Total Request: ${totalRequest}`);
      return res.json({
        status: 'success',
        title: title || 'No Title',
        url,
        duration,
        thumbnail: files.thumb,
        video: files.low || null,
      }); // ideo_hd: files.high || null,
    }

    // Select a random response
    const randomIndex = Math.floor(Math.random() * responses.length);
    const randomResponse = responses[randomIndex];

    // Remove the served response from the responses array
    responses.splice(randomIndex, 1);

    // Write updated responses back to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(responses, null, 2));

    totalRequest++;
    console.log(`Total Request: ${totalRequest}`);
    res.json({ status: 'success', ...randomResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
});

app.get('/api/xvideos', limiter, async (req, res) => {
  const search = req.query.search;

  try {
    if (!search) {
      return res
        .status(400)
        .json({ status: 'failed', error: 'Search term is required' });
    }

    const page = Math.floor(Math.random() * 100) + 1;
    const searchList = await xvideos.videos.search({ k: search, page });

    const randomVideo =
      searchList.videos[Math.floor(Math.random() * searchList.videos.length)];
    const videoDetails = await xvideos.videos.details(randomVideo);

    const { title, url, duration, files } = videoDetails;

    const response = {
      title: title || 'No Title',
      url,
      duration,
      thumbnail: files.thumb,
      video: files.low || null,
    };
    // video_hd: files.high || null,

    totalRequest++;
    console.log(`Total Request: ${totalRequest}`);
    res.json({ status: 'success', ...response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
