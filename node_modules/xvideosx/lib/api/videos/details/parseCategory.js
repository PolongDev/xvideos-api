const parseCategory = ($) => {
    const metadata = $('.video-metadata .is-keyword');
    const keywordTexts = metadata.map((index, element) => {
        return $(element).text();
    }).get();

    return keywordTexts;

}
module.exports = parseCategory