const fs = require("hexo-fs");
module.exports = {
    /**
     *
     * @param {string} templatePath 模板
     * @param {Object} data 数据
     * @param {Function} callback 回调函数
     */
    render(templatePath, data, callback) {
        try {
            let template = fs.readFileSync(templatePath, { encoding: "utf8" });
            Object.keys(data).forEach((key) => {
                template = template.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
            });
            callback(null, template);
        } catch (error) {
            callback(error, null);
        }
    },
};
