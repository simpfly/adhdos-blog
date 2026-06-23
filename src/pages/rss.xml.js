import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'ADHD OS Blog',
    description: '探索神经多样性，分享前端开发与 ADHD 的故事。',
    site: context.site,
    items: blog.map((post) => {
      const [lang, ...slugParts] = post.id.split('/');
      const slug = slugParts.join('/');
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: lang === 'zh' ? `/${slug}/` : `/${lang}/${slug}/`,
      };
    }),
    customData: `<language>zh-cn</language>`,
  });
}
