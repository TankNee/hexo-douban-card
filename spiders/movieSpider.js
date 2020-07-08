const cheerio = require('cheerio');
const superagent = require('superagent');
/**
 * 豆瓣电影爬虫
 */
const MOVIE_ENDPOINT = 'https://movie.douban.com/subject/';
/**
 * 爬取电影内容,评价等
 * @param {number} subjectId 书籍的id
 */
const crawl = (subjectId) => {
	return new Promise((resolve, reject) => {
		superagent
			.get(MOVIE_ENDPOINT + subjectId)
			.then((res) => {
				var movieInfo = parsePlainText(res.text);
				resolve(movieInfo);
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
	var movieInfo = $('#info').find('.pl').toArray();
	movieInfo.forEach((element) => {
		var itemName = $(element).text();
		if (itemName.indexOf('导演') !== -1) {
			var director = $(element).next().text();
			director = director.replace(/\s/g, '');
			info = {
				...info,
				director: director,
			};
		} else if (itemName.indexOf('主演') !== -1) {
			var actors = $(element).next().text();
			// actors = actors.replace(/\s/g, '').split('/');
			info = {
				...info,
				actors: actors.join(''),
			};
		} else if (itemName.indexOf('上映日期') !== -1) {
			var publishDate = $(element).next().text().replace(/\s/g, '');
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
