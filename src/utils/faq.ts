import fs from 'fs';
import path from 'path';

// 定义 FAQ 对象的 TypeScript 接口
export interface FAQItem {
  question: string;
  answer: string;
  articleTitle: string;
  articleHref: string;
  tag: string;
  pubDate?: string; // 关联文章的发布日期，用于全局排序
}

// 解析 Frontmatter 提取 title、第一个 tag 和发布日期
function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  let title = '';
  let tags: string[] = [];
  let pubDate = '';
  
  if (match) {
    const fmText = match[1];
    
    // 提取标题
    const titleMatch = fmText.match(/title:\s*["']?([^"'\n]+)["']?/);
    if (titleMatch) title = titleMatch[1];
    
    // 提取发布日期
    const pubDateMatch = fmText.match(/pubDate:\s*["']?([^"'\n]+)["']?/);
    if (pubDateMatch) pubDate = pubDateMatch[1];
    
    // 支持 tags: ["A", "B"] 或者 yaml 列表格式
    const tagsMatch = fmText.match(/tags:\s*\[\s*([^\]]*)\s*\]/);
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.replace(/["']/g, '').trim()).filter(Boolean);
    } else {
      const tagsListMatch = fmText.match(/tags:([\s\S]*?)(?:\n[a-zA-Z]+:|$)/);
      if (tagsListMatch) {
        const lines = tagsListMatch[1].split('\n');
        lines.forEach(line => {
          const m = line.match(/^\s*-\s*(.+)/);
          if (m) tags.push(m[1].replace(/["']/g, '').trim());
        });
      }
    }
  }
  return { title, tags, pubDate };
}

// 提取 Q&A 数据
function parseFAQs(content: string, isZh: boolean, slug: string, defaultTag: string, lang: 'zh' | 'en'): FAQItem[] {
  const faqs: FAQItem[] = [];
  const { title, tags, pubDate } = parseFrontmatter(content);
  const tag = tags[0] || defaultTag;
  const href = isZh ? `/${slug}/` : `/${lang}/${slug}/`;
  
  // 1. 优先提取 FAQSchema
  const schemaRegex = /<FAQSchema\s+questions=\{\[\s*([\s\S]*?)\s*\]\}\s*\/>/;
  const match = content.match(schemaRegex);
  if (match) {
    const arrayStr = match[1];
    const itemRegex = /\{\s*question:\s*(["'])([\s\S]*?)\1,\s*answer:\s*(["'])([\s\S]*?)\3\s*\}/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(arrayStr)) !== null) {
      faqs.push({
        question: itemMatch[2].trim(),
        answer: itemMatch[4].trim(),
        articleTitle: title,
        articleHref: href,
        tag: tag,
        pubDate: pubDate
      });
    }
  }

  // 2. 如果无 FAQSchema 或者是 Markdown 标题格式
  if (faqs.length === 0) {
    const heading = isZh ? '## 快速问答' : '## Quick Q&A';
    const index = content.indexOf(heading);
    if (index !== -1) {
      const section = content.substring(index + heading.length);
      const nextH2 = section.indexOf('\n## ');
      const faqText = nextH2 !== -1 ? section.substring(0, nextH2) : section;

      const qaRegex = /###\s+([^\n]+)\n+([\s\S]*?)(?=(?:\n+###\s+)|$)/g;
      let qaMatch;
      while ((qaMatch = qaRegex.exec(faqText)) !== null) {
        const q = qaMatch[1].trim();
        const a = qaMatch[2].replace(/<[^>]*>/g, '').trim();
        if (q && a) {
          faqs.push({
            question: q,
            answer: a,
            articleTitle: title,
            articleHref: href,
            tag: tag,
            pubDate: pubDate
          });
        }
      }
    }
  }

  return faqs;
}

// 递归获取目录下所有 md/mdx 文件
function walkDir(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

// 获取全部问答并按照关联文章日期降序排列
export function getAllFAQs(lang: 'zh' | 'en', defaultTag: string): FAQItem[] {
  const blogDir = path.join(process.cwd(), 'src/content/blog', lang);
  const files = walkDir(blogDir);
  let allFAQs: FAQItem[] = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const filename = path.basename(file);
    const slug = filename.replace(/\.(md|mdx)$/, '');
    const faqs = parseFAQs(content, lang === 'zh', slug, defaultTag, lang);
    allFAQs = allFAQs.concat(faqs);
  });

  // 全局排序：让最新发布文章的问答卡片排在最前面
  allFAQs.sort((a, b) => {
    const dateA = a.pubDate || '1970-01-01';
    const dateB = b.pubDate || '1970-01-01';
    return dateB.localeCompare(dateA);
  });

  // 如果没有问答，降级处理避免报错
  if (allFAQs.length === 0) {
    allFAQs.push({
      question: lang === 'zh' ? '今天感到注意力无法集中？' : 'Trouble focusing today?',
      answer: lang === 'zh' ? '允许自己先做 10 秒钟简单的物理动作（例如起立喝杯水），这能有效降低前额叶的启动阻力。' : 'Allow yourself to start with a simple 10-second physical movement like standing up to grab water. This lowers activation barriers.',
      articleTitle: lang === 'zh' ? '返回首页' : 'Home',
      articleHref: '/',
      tag: lang === 'zh' ? '脑力建议' : 'Insight',
      pubDate: '2026-06-30'
    });
  }

  return allFAQs;
}
