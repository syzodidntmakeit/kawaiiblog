import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const category = context.params.category;
  const posts = await getCollection("posts", ({ data }) => {
    return (
      (import.meta.env.PROD ? !data.draft : true) && data.category === category
    );
  });

  return rss({
    title: `KawaiiBlog - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: `Latest posts from the ${category} category`,
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

export function getStaticPaths() {
  return [
    { params: { category: "tech" } },
    { params: { category: "music" } },
    { params: { category: "games" } },
    { params: { category: "commentary" } },
  ];
}
