## HEXO-DOUBAN-CARD

一个 HEXO 插件,实现了用 HEXO 语法来在博客中插入一个豆瓣读书卡片的功能,现在实现了读书和电影两个板块

[![NPM version](https://badge.fury.io/js/hexo-douban-card.svg)](https://www.npmjs.com/package/hexo-douban-card)
[![npm](https://img.shields.io/npm/dt/hexo-douban-card.svg)](https://www.npmjs.com/package/hexo-douban-card)
[![GitHub license](https://img.shields.io/github/license/TankNee/hexo-douban-card.svg)](https://github.com/TankNee/hexo-douban-card/blob/master/LICENSE)
[![NPM](https://nodei.co/npm/hexo-douban-card.png)](https://nodei.co/npm/hexo-douban-card/)

### 用法

首先请安装插件

```bash
$ npm install hexo-douban-card --save
```

然后使用以下语法

```markdown
{% douban movie 24745500 %}

{% douban book 30376420 %}

{% douban music 35099703 %}
```

### 参数阐述

- 第一项`douban` 代表插件名

- 第二项可选:`movie`,`book`,`music`

- 第三项请填入对应的`id`例如:

![](https://img.tanknee.cn/blogpicbed/2020/07/2020070821522816eaefa.png)

填写subject后面的那串数字就好

### 示意图

![](https://img.tanknee.cn/blogpicbed/2020/07/20200708f878ac4cfa250.png)

### 作品站点

https://www.tanknee.cn/2020/07/08/Hexo%E8%B1%86%E7%93%A3%E6%96%87%E7%AB%A0%E6%8F%92%E4%BB%B6/


## 2022/02/13 更新

使用自己编写的渲染器替换 nunjucks 渲染器，理论上是不会出现 #3 那个报错了，如果还出错请清空缓存，重新安装 hexo-douban-card 试试，还不行的话我也无能为力了。

新增电影、书籍的阅读状态爬取，前提是你配置了 cookie，详情请参照 2020/09/17 更新的更新内容。

![](https://img.tanknee.cn/blogpicbed/2022/02/13/2022021364172833e27c9.png)

## 2020/09/17 更新

**修复1.2.1中不使用cookie时出现报错无法编译的问题，该问题较为严重，希望1.2.1及以下版本的用户尽快更新！！！！**

## 2020/09/01 更新

当前版本(1.2.0)中修复了部分电影，音乐无法正常爬取的问题，例如电影《天浴》，id：1302836。
无法爬取的原因在于电影需要登陆才可以正常爬取内容，因此当前版本添加了新的配置。如果你遇到了上述问题，请到hexo根目录下的`_config.yml`文件中，添加一项：

```yaml
doubanCard:
    cookie: xxxxx
```
然后将xxxx替换成你的cookie，cookie的获取办法是：

1. 打开豆瓣网页，登陆账号

2. 随便点击一个页面，然后打开控制台

![](https://img.tanknee.cn/img/20200901185319.png)

3. 将Cookie那一项的所有内容复制出来，放在配置文件中即可

## 2020/07/13 更新

某些特定的电影需要登陆才可以查看到对应的信息,1.1.8-c版本不做修改时会报生成错误,暂时只做冷处理,即显示一个提示图片,在下一个版本`1.2.0`中会做更优化的处理!

![](https://img.tanknee.cn/blogpicbed/2020/07/20200713875399cbbb527.png)