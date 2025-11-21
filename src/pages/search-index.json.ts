import { getCollection } from 'astro:content';

export async function GET() {
    const posts = await getCollection('posts', ({ data }) => {
        return import.meta.env.PROD ? !data.draft : true;
    });

    const searchIndex = posts.map((post) => ({
        title: post.data.title,
        date: post.data.date instanceof Date ? post.data.date.toISOString() : String(post.data.date),
        slug: post.slug,
        category: post.data.category,
        tags: post.data.tags ?? [],
        excerpt: post.data.excerpt,
        // We strip markdown for content search to keep index size down
        content: (post.body ?? '').replace(/[#*`]/g, '').substring(0, 5000), // Limit content length
    }));

    return new Response(JSON.stringify(searchIndex), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
