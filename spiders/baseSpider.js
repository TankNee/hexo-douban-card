const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("hexo-fs");

const fileName = "DoubanCard.json";
class BaseSpider {
    type;
    constructor(type, logger, cookie, imgProxy) {
        this.cheerio = cheerio;
        this.superagent = superagent;
        this.logger = logger;
        this.imgProxy = imgProxy || "https://images.weserv.nl/?url=";
        // 爬取节点
        this.ENDPOINT = {
            BOOK: "https://book.douban.com/subject/",
            MOVIE: "https://movie.douban.com/subject/",
            MUSIC: "https://music.douban.com/subject/",
        };
        // 用户传入的cookie
        this.cookie = cookie || "";
        this.type = type;
    }
    cache(data) {
        let oldData = { movie: [], book: [], music: [] };
        if (fs.existsSync(fileName)) {
            oldData = fs.readFileSync(fileName);
            oldData = JSON.parse(oldData);
        } else {
            fs.writeFileSync(fileName, JSON.stringify(oldData));
        }
        // replace the same subject id object
        const oldIdx = oldData[this.type].findIndex((item) => item.url === data.url);
        if (oldIdx !== -1) {
            oldData[this.type][oldIdx] = data;
        } else {
            oldData[this.type].push(data);
        }
        fs.writeFileSync(fileName, JSON.stringify(oldData, null, 2));
    }
    /**
     *
     * @param {string} subjectId
     * @returns
     */
    getCache(subjectId) {
        let oldData = { movie: [], book: [], music: [] };
        if (fs.existsSync(fileName)) {
            oldData = fs.readFileSync(fileName);
            oldData = JSON.parse(oldData);
        } else {
            fs.writeFileSync(fileName, JSON.stringify(oldData));
        }
        return oldData[this.type].find((item) => item.url === this.ENDPOINT[this.type.toUpperCase()] + subjectId);
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
