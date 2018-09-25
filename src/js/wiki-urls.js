/**
 * created by zhangzihao on 2018/9/25
 */
const glob = require('glob');
const path = require('path');
const $ = require('cheerio');
const fs = require('fs-extra');
const { dir } = require('./utils');

const htmlPath = dir('./src/views/**/**/*.html');
const wikiPath = dir('./wiki/docs/urls/index.md');

const wikiBaseMarkdown = `##基线通用规则：
- 通用域名 http://cms.ptqy.gitv.tv/common/tv
- 以下url省略.html后缀
- （m-xxx|user）为手机页面，其余均为TV端页面

> 以下为脚本自动生成，如有错漏，请联系本人（张子豪）

`;

/**
 * 生成全量页面wiki所需数据
 * @returns {Array}
 */
const genPagesData = () => {
  const pages = [];
  const htmlList = glob.sync(htmlPath);
  htmlList.forEach((htmlPath) => {
    let url = path.dirname(htmlPath).split('/');
    url = url.slice(-2);
    if (url.length !== 2) {
      console.log(`Error path: ${htmlPath}`);
      return;
    }
    const html = fs.readFileSync(htmlPath, 'UTF-8');
    const dom = $.load(html);
    const title = dom('meta[name=subtitle]').attr('content') || dom('title').text() || 'NA';
    pages.push({
      url: url.join('/'),
      title,
    });
  });
  console.log(pages);
  return pages;
};

/**
 * 创建文件
 * @param filePath
 * @param content
 */
const createFile = (filePath, content) => {
  fs.outputFileSync(wikiPath, content);
};

const genWikiMarkdown = (pagesData) => {
  let table = '|名称|url|\n' +
    '|:----|:----|';
  pagesData.forEach((data) => {
    table = `${table}\n|${data.title}|${data.url}|`;
  });
  return wikiBaseMarkdown + table;
};

const main = () => {
  const pagesData = genPagesData();
  const wikiMarkdown = genWikiMarkdown(pagesData);
  createFile(wikiPath, wikiMarkdown);
};

main();
