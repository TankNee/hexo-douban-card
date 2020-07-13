const {BookSpider, MovieSpider, MusicSpider} = require('./spiders');
const nunjucks = require('nunjucks');
const path = require('path');

const DOUBAN_CARD_BOOK_TEMPLATE = path.resolve(__dirname, 'bookCard.html');
const DOUBAN_CARD_MOVIE_TEMPLATE = path.resolve(__dirname, 'movieCard.html');
const DOUBAN_CARD_MUSIC_TEMPLATE = path.resolve(__dirname, 'musicCard.html');
var bookSpider = new BookSpider();
var movieSpider = new MovieSpider();
var musicSpider = new MusicSpider();
nunjucks.configure({
    watch: false,
});

/**
 * 注册标签渲染
 */
hexo.extend.tag.register(
	'douban',
	(args) => {
		return new Promise((resolve, reject) => {
			var type, subjectId;
			// 参数类型验证
			if (!args[0] || !args[1]) {
				return reject(args);
			}
			if (isNaN(args[0])) {
				type = args[0];
				subjectId = args[1];
			} else if (isNaN(args[1])) {
				type = args[1];
				subjectId = args[0];
			}
			if (!(isNaN(type) && !isNaN(subjectId))) return reject(args);
			if (type === 'book') {
				bookSpider.crawl(subjectId).then((bookInfo) => {
					nunjucks.render(DOUBAN_CARD_BOOK_TEMPLATE, bookInfo, (err, res) => {
						if (err) {
							return reject(err);
						}
						resolve(res);
					});
				});
			} else if (type === 'movie') {
				movieSpider.crawl(subjectId).then((movieInfo) => {
					nunjucks.render(DOUBAN_CARD_MOVIE_TEMPLATE, movieInfo, (err, res) => {
						if (err) {
							return reject(err);
						}
						resolve(res);
					});
				});
			} else if (type === 'music') {
				musicSpider.crawl(subjectId).then((musicInfo) => {
					nunjucks.render(DOUBAN_CARD_MUSIC_TEMPLATE, musicInfo, (err, res) => {
						if (err) {
							return reject(err);
						}
						resolve(res);
					});
				});
			}
		});
	},
	{
		async: true,
	}
);
