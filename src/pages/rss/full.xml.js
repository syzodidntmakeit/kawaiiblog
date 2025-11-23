import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context) {
    const posts = await getCollection("posts", ({ data }) => {
        return import.meta.env.PROD ? !data.draft : true;
    });

    return rss({
        title: "KawaiiBlog - Full Feed",
        description: "A lightweight blog about tech, music, and commentary (Full Text)",
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.excerpt,
            link: `/posts/${post.slug}/`,
            content: sanitizeHtml(parser.render(post.body), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
            }),
        })),
        customData: `<language>en-us</language>`,
    });
}
