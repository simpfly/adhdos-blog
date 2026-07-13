import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  
  // 按发布日期降序排序
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  
  const zhPosts = sortedPosts.filter(p => p.id.startsWith('zh/'));
  const enPosts = sortedPosts.filter(p => p.id.startsWith('en/'));
  
  const getSlug = (id: string) => {
    const parts = id.split('/');
    return parts.slice(1).join('/');
  };

  let txt = `# ADHD OS Blog\n\n`;
  txt += `> Stories and research for the neurodivergent community.\n\n`;
  txt += `## Metadata\n`;
  txt += `- URL: https://blog.adhdos.app\n`;
  txt += `- Description: ADHD OS blog provides evidence-based guides, practical strategies, and personal stories designed for ADHD, ASD, AuDHD, and HSP individuals to navigate their lives and workplaces.\n\n`;
  
  txt += `## Core Pages\n`;
  txt += `- [Home](https://blog.adhdos.app) - Chinese main page\n`;
  txt += `- [English Home](https://blog.adhdos.app/en) - English main page\n`;
  txt += `- [Agent Guide](https://blog.adhdos.app/agent) - AI/Agent integration documentation\n\n`;
  
  txt += `## Chinese Articles (zh)\n`;
  for (const post of zhPosts) {
    const slug = getSlug(post.id);
    txt += `- [${post.data.title}](https://blog.adhdos.app/${slug}) - ${post.data.description}\n`;
  }
  
  txt += `\n## English Articles (en)\n`;
  for (const post of enPosts) {
    const slug = getSlug(post.id);
    txt += `- [${post.data.title}](https://blog.adhdos.app/en/${slug}) - ${post.data.description}\n`;
  }

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
