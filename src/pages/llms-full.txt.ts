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

  let txt = `# ADHD OS Blog - Full Knowledge Base\n\n`;
  txt += `This file contains the complete content of all blog posts for ADHD OS, optimized for LLM/Agent retrieval and context window inclusion.\n\n`;
  txt += `---\n\n`;

  txt += `# CHINESE ARTICLES (zh)\n\n`;
  for (const post of zhPosts) {
    const slug = getSlug(post.id);
    const url = `https://blog.adhdos.app/${slug}`;
    txt += `## [ZH] [${post.data.title}](${url})\n`;
    txt += `- Published: ${post.data.pubDate.toISOString().split('T')[0]}\n`;
    if (post.data.tags && post.data.tags.length > 0) {
      txt += `- Tags: ${post.data.tags.join(', ')}\n`;
    }
    txt += `- Description: ${post.data.description}\n\n`;
    txt += `### Content\n\n`;
    txt += `${post.body}\n\n`;
    txt += `---\n\n`;
  }

  txt += `# ENGLISH ARTICLES (en)\n\n`;
  for (const post of enPosts) {
    const slug = getSlug(post.id);
    const url = `https://blog.adhdos.app/en/${slug}`;
    txt += `## [EN] [${post.data.title}](${url})\n`;
    txt += `- Published: ${post.data.pubDate.toISOString().split('T')[0]}\n`;
    if (post.data.tags && post.data.tags.length > 0) {
      txt += `- Tags: ${post.data.tags.join(', ')}\n`;
    }
    txt += `- Description: ${post.data.description}\n\n`;
    txt += `### Content\n\n`;
    txt += `${post.body}\n\n`;
    txt += `---\n\n`;
  }

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
