const { BaseSpider } = require("./baseSpider");

class BookSpider extends BaseSpider {
    constructor(logger, cookie, imgProxy) {
        super("book", logger, cookie, imgProxy);
    }
    placeholder = "见字如晤";
    /**
     *爬取书本内容
     * @param {number} subjectId
     */
    crawl(subjectId) {
        return new Promise((resolve, reject) => {
            const cached = this.getCache(subjectId);
            if (cached) {
                this.logger.info(`书籍 ${cached.title} (${subjectId}) 已被缓存，直接使用缓存数据`);
                resolve(cached);
                return;
            }
            this.logger.info(`正在爬取书籍 ${subjectId}`);
            this.superagent
                .get(this.ENDPOINT.BOOK + subjectId)
                .set("Cookie", this.cookie)
                .then((res) => {
                    var bookInfo = this.parsePlainText(res.text);
                    var payload = { ...bookInfo, url: this.ENDPOINT.BOOK + subjectId };
                    this.cache(payload);
                    resolve(payload);
                })
                .catch((err) => {
                    if (err.status === 404) {
                        this.logger.error(`书籍 ${subjectId} 不存在或指向的书籍需要登陆`);
                        resolve({
                            url: this.ENDPOINT.MOVIE + subjectId,
                            title: "该卡片指向的书籍需要登陆或您输入的id存在错误!",
                            img: "https://images.weserv.nl/?url=https://img1.doubanio.com/view/subject/s/public/s33309978.jpg",
                            status: this.placeholder,
                        });
                    }
                    reject(err);
                });
        });
    }
    /**
     * 解析文本数据
     * @param {string} plainText
     */
    parsePlainText(plainText) {
        var $ = this.cheerio.load(plainText);
        var info = {
            title: $("h1").text().replace(/\s/g, ""),
        };
        var bookInfo = $("#info").find(".pl").toArray();
        bookInfo.forEach((element) => {
            var itemName = $(element).text();
            if (itemName.indexOf("作者") !== -1) {
                var author = $(element).next().text();
                author = author.replace(/\s/g, "");
                info = {
                    ...info,
                    author: author,
                };
            } else if (itemName.indexOf("出版年") !== -1) {
                var publishDate = element.next.data.replace(/\s/g, "");
                info = {
                    ...info,
                    publishDate: publishDate,
                };
            }
        });
        var status = $("#interest_sect_level > div > span.mr10").text() || this.placeholder;
        status = status.replace(/\s/g, "").replace(/\n/g, "");
        var bgUrl = $("#mainpic img").attr("src");
        info = {
            status,
            ...info,
            rate: $(".rating_num").text().replace(/\s/g, ""),
            img: this.imgProxy + bgUrl,
        };
        return info;
    }
}

module.exports.BookSpider = BookSpider;
