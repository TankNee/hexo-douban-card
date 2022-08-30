const { BookSpider, MovieSpider, MusicSpider } = require("./spiders");
const renderer = require("./renderer");
const path = require("path");
const fs = require("hexo-fs");
const HexoLog = require("hexo-log");
const { config } = hexo;
const { doubanCard } = config;

var cookie, imgProxy;
if (doubanCard) {
    cookie = doubanCard.cookie;
    imgProxy = doubanCard.imgProxy;
}

const DOUBAN_CARD_BOOK_TEMPLATE = path.resolve(__dirname, "./templates/bookCard.html");
const DOUBAN_CARD_MOVIE_TEMPLATE = path.resolve(__dirname, "./templates/movieCard.html");
const DOUBAN_CARD_MUSIC_TEMPLATE = path.resolve(__dirname, "./templates/musicCard.html");
const style = fs.readFileSync(path.resolve(__dirname, "./templates/assets/style.css"), { encoding: "utf8" });
var bookSpider = new BookSpider(HexoLog({ name: "douban-book-card" }), cookie, imgProxy);
var movieSpider = new MovieSpider(HexoLog({ name: "douban-movie-card" }), cookie, imgProxy);
var musicSpider = new MusicSpider(HexoLog({ name: "douban-music-card" }), cookie, imgProxy);
var logger = HexoLog({ name: "douban-card-index" });

hexo.extend.injector.register(
    "head_begin",
    () => {
        return `<style type="text/css">${style}</style>`;
    },
    "default"
);

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

            try {
                if (type === "book") {
                    bookSpider.crawl(subjectId).then((bookInfo) => {
                        renderer.render(DOUBAN_CARD_BOOK_TEMPLATE, { ...bookInfo }, (err, res) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(res);
                        });
                    });
                } else if (type === "movie") {
                    movieSpider.crawl(subjectId).then((movieInfo) => {
                        renderer.render(DOUBAN_CARD_MOVIE_TEMPLATE, { ...movieInfo }, (err, res) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(res);
                        });
                    });
                } else if (type === "music") {
                    musicSpider.crawl(subjectId).then((musicInfo) => {
                        renderer.render(DOUBAN_CARD_MUSIC_TEMPLATE, { ...musicInfo }, (err, res) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(res);
                        });
                    });
                }
            } catch (error) {
                logger.error(`爬取 ${type} ${subjectId} 失败：${error}`);
                reject(err);
            }
        });
    },
    {
        async: true,
    }
);
