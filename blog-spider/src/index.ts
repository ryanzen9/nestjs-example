import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import TurndownService from 'turndown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const START_URL =
  'https://nest-docs.elias.ccwu.cc/1.%20%E5%BC%80%E7%AF%87%E8%AF%8D.html';

const ORIGIN = 'https://nest-docs.elias.ccwu.cc';
const OUT_DIR = path.resolve(__dirname, 'articles');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function safeFileName(name: string) {
  return name
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getArticleLinks(page: puppeteer.Page) {
  await page.goto(START_URL, {
    waitUntil: 'networkidle2',
    timeout: 60_000,
  });

  return await page.evaluate((origin) => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));

    const links = anchors
      .map((a) => {
        const href = a.getAttribute('href');
        const title = a.textContent.trim();

        if (!href || !title) return null;

        const url = new URL(href, location.href).href;

        if (!url.startsWith(origin)) return null;
        if (!url.endsWith('.html')) return null;
        if (!/^\d+\./.test(title)) return null;

        return { title, url };
      })
      .filter(Boolean);

    const map = new Map();

    for (const item of links) {
      map.set(item!.url, item);
    }

    return Array.from(map.values()).sort((a, b) => {
      const na = Number(a.title.match(/^(\d+)/)?.[1] || 0);
      const nb = Number(b.title.match(/^(\d+)/)?.[1] || 0);
      return na - nb;
    });
  }, ORIGIN);
}

async function scrapeArticle(page: puppeteer.Page, item: { title: string; url: string }) {
  await page.goto(item.url, {
    waitUntil: 'networkidle2',
    timeout: 60_000,
  });

  return await page.evaluate(() => {
    const candidates = [
      '.VPDoc .content',
      '.vp-doc',
      'main',
      '.content',
      'body',
    ];

    let root = null;

    for (const selector of candidates) {
      const el: any = document.querySelector(selector);

      if (el && el.innerText.trim().length > 200) {
        root = el;
        break;
      }
    }

    if (!root) {
      root = document.body;
    }

    const clone = root.cloneNode(true) as HTMLElement;

    clone
      .querySelectorAll(`
        script,
        style,
        nav,
        aside,
        header,
        footer,
        .VPNav,
        .VPSidebar,
        .VPDocAside,
        .pager,
        .edit-info,
        .outline,
        .outline-link,
        .prev-next,
        .container > .aside
      `)
      .forEach((el) => el.remove());

    const images = Array.from(clone.querySelectorAll('img'));
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        const absUrl = new URL(src, location.href).href;
        img.setAttribute('src', absUrl);
      }
    });

    const h1 = clone.querySelector('h1')?.textContent?.trim() || document.title;

    return {
      title: h1,
      html: clone.innerHTML,
      text: clone.innerText.trim(),
      images: images.map((img) => img.getAttribute('src')),
    };
  });
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: true,
  });

  const page: puppeteer.Page = await browser.newPage();

  await page.setViewport({
    width: 1440,
    height: 1000,
  });

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  try {
    const links = await getArticleLinks(page);

    console.log(`发现 ${links.length} 篇文章`);

    await fs.writeFile(
      path.join(OUT_DIR, 'index.json'),
      JSON.stringify(links, null, 2),
      'utf8'
    );

    for (const [index, item] of links.slice(0, 9).entries()) {
      console.log(`[${index + 1}/${links.length}] ${item.title}`);

      try {
        const article = await scrapeArticle(page, item);
        const markdown = turndown.turndown(article.html);

        const fileName = safeFileName(`${item.title}.md`);
        const filePath = path.join(OUT_DIR, fileName);

        const content = [
          `# ${item.title}`,
          '',
          `原文：${item.url}`,
          '',
          markdown,
          '',
        ].join('\n');

        await fs.writeFile(filePath, content, 'utf8');
        await sleep(500);
      } catch (err) {
        console.error(`抓取失败：${item.url}`);
        console.error(err);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
