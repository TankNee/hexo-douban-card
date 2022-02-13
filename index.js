const { BookSpider, MovieSpider, MusicSpider } = require("./spiders");
const renderer = require("./renderer");
const path = require("path");
const fs = require("hexo-fs");
const { config } = hexo;
const { doubanCard } = config;
var cookie;
if (doubanCard) {
    cookie = doubanCard.cookie;
}

const DOUBAN_CARD_BOOK_TEMPLATE = path.resolve(__dirname, "./templates/bookCard.html");
const DOUBAN_CARD_MOVIE_TEMPLATE = path.resolve(__dirname, "./templates/movieCard.html");
const DOUBAN_CARD_MUSIC_TEMPLATE = path.resolve(__dirname, "./templates/musicCard.html");
const style = fs.readFileSync(path.resolve(__dirname, "./templates/assets/style.css"), { encoding: "utf8" });
var bookSpider = new BookSpider(cookie);
var movieSpider = new MovieSpider(cookie);
var musicSpider = new MusicSpider(cookie);

/**
 * 注册标签渲染
 */
hexo.extend.tag.register(
    "douban",
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

            if (type === "book") {
                bookSpider.crawl(subjectId).then((bookInfo) => {
                    renderer.render(DOUBAN_CARD_BOOK_TEMPLATE, { style, ...bookInfo }, (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(res);
                    });
                });
            } else if (type === "movie") {
                movieSpider.crawl(subjectId).then((movieInfo) => {
                    renderer.render(DOUBAN_CARD_MOVIE_TEMPLATE, { style, ...movieInfo }, (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(res);
                    });
                });
            } else if (type === "music") {
                musicSpider.crawl(subjectId).then((musicInfo) => {
                    renderer.render(DOUBAN_CARD_MUSIC_TEMPLATE, { style, ...musicInfo }, (err, res) => {
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
