const { BaseSpider } = require("./baseSpider");

class MusicSpider extends BaseSpider {
    constructor(cookie) {
        super(cookie);
    }
    placeholder = "余音绕梁";
    /**
     *爬取书本内容
     * @param {number} subjectId
     */
    crawl(subjectId) {
        return new Promise((resolve, reject) => {
            this.superagent
                .get(this.ENDPOINT.MUSIC + subjectId)
                .set("Cookie", this.cookie)
                .then((res) => {
                    var musicInfo = this.parsePlainText(res.text);
                    resolve({ ...musicInfo, url: this.ENDPOINT.MUSIC + subjectId });
                })
                .catch((err) => {
                    if (err.status === 404) {
                        resolve({
                            url: this.ENDPOINT.MOVIE + subjectId,
                            title: "该卡片指向的音乐需要登陆或您输入的id存在错误!",
                            img: "https://images.weserv.nl/?url=https://img3.doubanio.com/view/subject/m/public/s32295462.jpg",
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
        var musicInfo = $("#info").find(".pl").toArray();
        musicInfo.forEach((element) => {
            var itemName = $(element).text().replace(/\s/g, "");
            if (itemName.indexOf("表演者") !== -1) {
                var actors = itemName.replace("表演者:", "");
                actors = actors.replace(/\s/g, "").split("/");
                info = {
                    ...info,
                    actors: actors.slice(0, 2).join("/"),
                };
            } else if (itemName.indexOf("发行时间") !== -1) {
                var publishDate = element.next.data.replace(/\s/g, "");
                info = {
                    ...info,
                    publishDate: publishDate,
                };
            } else if (itemName.indexOf("流派") !== -1) {
                var genre = element.next.data.replace(/\s/g, "");
                info = {
                    ...info,
                    genre: genre,
                };
            }
        });
        var status = $("#interest_sect_level > div > span.mr10").text() || this.placeholder;
        var bg = $("#mainpic").children(".ckd-collect").children(".nbg");
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

module.exports.MusicSpider = MusicSpider;
