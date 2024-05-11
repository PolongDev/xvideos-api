const parseModels = ($) => {
    const $metadata = $('.video-metadata');

    const mainUploader = $metadata.find('li.main-uploader a span.name').text();
    const mainUploaderCount = $metadata.find('li.main-uploader a span.count').text();

    const models = $metadata.find('li.model a span.name').map((index, element) => $(element).text()).get();
    const modelsCounts = $metadata.find('li.model a span.count').map((index, element) => $(element).text()).get();

    return {
        mainUploader: {
            name: mainUploader,
            count: mainUploaderCount
        },
        models: models.map((name, index) => ({
            name,
            count: modelsCounts[index]
        })),
    };
}

module.exports = parseModels