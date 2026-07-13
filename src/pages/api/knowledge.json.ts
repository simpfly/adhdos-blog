import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  
  // 按发布日期降序排序
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  
  const getSlug = (id: string) => {
    const parts = id.split('/');
    return parts.slice(1).join('/');
  };

  const knowledge = sortedPosts.map(post => {
    const isEn = post.id.startsWith('en/');
    const slug = getSlug(post.id);
    const url = isEn ? `https://blog.adhdos.app/en/${slug}` : `https://blog.adhdos.app/${slug}`;
    
    return {
      title: post.data.title,
      description: post.data.description,
      url: url,
      lang: isEn ? 'en' : 'zh',
      tags: post.data.tags || [],
      pubDate: post.data.pubDate.toISOString().split('T')[0],
      content: post.body
    };
  });

  return new Response(JSON.stringify(knowledge), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
