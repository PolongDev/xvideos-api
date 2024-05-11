const base = require('../../base');

const extractorUrl = (imageUrl) => {
  const regex = /\/thumbs169ll(\/(?:[0-9a-f]{2}\/){3}[0-9a-f]{32})\//i;
  const match = imageUrl.match(regex);
  if (match && match[1]) {
    const extractedPart = match[1];
    const newUrl = `https://gcore-pic.xvideos-cdn.com/videos/videopreview${extractedPart}_169.mp4`;
    return newUrl;
  } return null;
};
const viewsExtractor = (views) => {
  const regex = /(\d+(?:[,.]\d+)?[MK])/i;
  const match = views.match(regex);
  if (match && match[1]) {
    const views = match[1];
    return views;
  } return null;
};

const parseVideo = ($, video) => {
  const $video = $(video);
  const title = $video.find('.title a').attr('title');
  const path = $video.find('.thumb > a').attr('href');
  const url = `${base.BASE_URL}${path}`;
  const thumbNail = $video.find('div.thumb img').attr('data-src');
  const preview = extractorUrl(thumbNail);
  const duration = $video.find('p.metadata > span.bg > span.duration').text();
  const channel = $video.find('.metadata .name').text();
  const viewsData = $video.find('p.metadata > span.bg > span:nth-child(2)').text().trim();
  const views = viewsExtractor(viewsData);

  return {
    title,
    url,
    thumbNail,
    preview,
    path,
    duration,
    channel,
    views,
  };
};

module.exports = parseVideo;
