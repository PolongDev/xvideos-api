const fs = require('fs')

const parseRelated = ($) =>{
    const scriptContent = $('#video-player-bg script').html();
    const startIndex =  scriptContent.indexOf('[');
    const endIndex = scriptContent.lastIndexOf(']');
    const jsonContent = scriptContent.substring(startIndex, endIndex + 1);

    const videoRelated = JSON.parse(jsonContent);

    return videoRelated.map(video => {
        return {
             title: video.tf,
             short_title: video.t,
             duration : video.d,
             channel: video.pn,
             thumbNail: video.i,
             poster: video.ip,
             url: video.u,
             views: video.n,
        }
    })   
}

module.exports = parseRelated