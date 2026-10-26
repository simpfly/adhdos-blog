import { blogPath } from '../utils/urls.js';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'ADHD OS Blog',
    description: '写给神经多样性大脑的自救指南：ADHD / ASD 的执行功能、时间盲、情绪调节与科学糊弄哲学。',
    site: new URL(blogPath(), context.site),
    trailingSlash: false,
    items: blog.map((post) => {
      const [lang, ...slugParts] = post.id.split('/');
      const slug = slugParts.join('/');
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: new URL(blogPath(slug, lang), context.site).href,
      };
    }),
    customData: `<language>zh-cn</language>`,
  });
}
