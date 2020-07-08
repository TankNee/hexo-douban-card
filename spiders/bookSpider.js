const cheerio = require('cheerio');
const superagent = require('superagent');
/**
 * 豆瓣读书爬虫
 */
const BOOK_ENDPOINT = 'https://book.douban.com/subject/';
/**
 * 爬取书本内容,评价等
 * @param {number} subjectId 书籍的id
 */
const crawl = (subjectId) => {
	return new Promise((resolve, reject) => {
		superagent
			.get(BOOK_ENDPOINT + subjectId)
			.then((res) => {
				var bookInfo = parsePlainText(res.text);
				resolve(bookInfo);
			})
			.catch(reject);
	});
};
/**
 * 解析文本数据
 * @param {string} plainText
 */
const parsePlainText = (plainText) => {
	var $ = cheerio.load(plainText);
	var info = {
		title: $('h1').text().replace(/\s/g, ''),
	};
	var bookInfo = $('#info').find('.pl').toArray();
	bookInfo.forEach((element) => {
		var itemName = $(element).text();
		if (itemName.indexOf('作者') !== -1) {
			var author = $(element).next().text();
			author = author.replace(/\s/g, '');
			info = {
				...info,
				author: author,
			};
		} else if (itemName.indexOf('出版年') !== -1) {
			var publishDate = element.next.data.replace(/\s/g, '');
			info = {
				...info,
				publishDate: publishDate,
			};
		}
	});
	info = {
		...info,
		rate: $('.rating_num').text().replace(/\s/g, ''),
	};
	return info;
};

module.exports = {
	crawl: crawl,
};
