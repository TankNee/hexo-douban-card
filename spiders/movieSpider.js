const { BaseSpider } = require("./baseSpider");

class MovieSpider extends BaseSpider {
    constructor(cookie) {
        super(cookie);
    }
    placeholder = "灯影绰约";
    /**
     *爬取电影内容
     * @param {number} subjectId
     */
    crawl(subjectId) {
        return new Promise((resolve, reject) => {
            this.superagent
                .get(this.ENDPOINT.MOVIE + subjectId)
                .set("Cookie", this.cookie)
                .then((res) => {
                    var movieInfo = this.parsePlainText(res.text);
                    resolve({ ...movieInfo, url: this.ENDPOINT.MOVIE + subjectId });
                })
                .catch((err) => {
                    if (err.status === 404) {
                        resolve({
                            url: this.ENDPOINT.MOVIE + subjectId,
                            title: "该卡片指向的电影需要登陆或您输入的id存在错误!",
                            img: "https://images.weserv.nl/?url=https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2221768894.webp",
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
        var movieInfo = $("#info").find(".pl").toArray();
        movieInfo.forEach((element) => {
            var itemName = $(element).text();
            if (itemName.indexOf("导演") !== -1) {
                var director = $(element).next().text();
                director = director.replace(/\s/g, "");
                info = {
                    ...info,
                    director: director,
                };
            } else if (itemName.indexOf("主演") !== -1) {
                var actors = $(element).next().text();
                actors = actors.replace(/\s/g, "").split("/");
                info = {
                    ...info,
                    actors: actors.slice(0, 2).join("/"),
                };
            } else if (itemName.indexOf("上映日期") !== -1) {
                var publishDate = $(element).next().text().replace(/\s/g, "");
                info = {
                    ...info,
                    publishDate: publishDate,
                };
            }
        });
        var status = $("#interest_sect_level > div > span.mr10").text() || this.placeholder;
        var bg = $("#mainpic").children(".nbgnbg");
        var bgUrl = $(bg).children("img")[0].attribs.src;
        info = {
            status,
            ...info,
            rate: $(".rating_num").text().replace(/\s/g, ""),
            img: "https://images.weserv.nl/?url=" + bgUrl,
        };
        return info;
    }
}

module.exports.MovieSpider = MovieSpider;
