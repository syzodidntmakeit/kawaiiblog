import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
    const posts = await getCollection("posts", ({ data }) => {
        return (import.meta.env.PROD ? !data.draft : true) && data.featured === true;
    });

    return rss({
        title: "KawaiiBlog - Featured Posts",
        description: "Curated selection of the best posts from KawaiiBlog",
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.excerpt,
            link: `/posts/${post.slug}/`,
        })),
        customData: `<language>en-us</language>`,
    });
}
