## HEXO-DOUBAN-CARD

一个 HEXO 插件,实现了用 HEXO 语法来在博客中插入一个豆瓣读书卡片的功能,现在实现了读书和电影两个板块

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

https://www.tanknee.cn