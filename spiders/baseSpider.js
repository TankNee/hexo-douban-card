const cheerio = require('cheerio');
const superagent = require('superagent');
class BaseSpider {
	constructor() {
		this.cheerio = cheerio;
		this.superagent = superagent;
		this.ENDPOINT = {
			BOOK: 'https://book.douban.com/subject/',
			MOVIE: 'https://movie.douban.com/subject/',
			MUSIC: 'https://music.douban.com/subject/',
        };
	}
	/**
	 * 爬取内容,评价等
	 * @param {number} subjectId 书籍的id
	 */
	crawl(subjectId) {}
	/**
	 * 解析文本数据
	 * @param {string} plainText
	 */
	parsePlainText(plainText) {}
}
module.exports.BaseSpider = BaseSpider;
