const { MusicSpider } = require('./musicSpider');
const { BookSpider } = require('./bookSpider');
const { MovieSpider } = require('./movieSpider');
module.exports = {
	BookSpider: BookSpider,
	MovieSpider: MovieSpider,
	MusicSpider: MusicSpider,
};
