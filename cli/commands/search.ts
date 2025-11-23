import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import matter from "gray-matter";
import Fuse from "fuse.js";
import inquirer from "inquirer";

interface Post {
  title: string;
  excerpt: string;
  category: string;
  date: string | Date;
  body: string;
  dir: string;
  [key: string]: unknown;
}

export async function searchPosts(query?: string) {
  const postsDir = path.join(process.cwd(), "src", "content", "posts");
  const posts: Post[] = [];

  try {
    const dirs = await fs.readdir(postsDir);

    for (const dir of dirs) {
      const filePath = path.join(postsDir, dir, "index.md");
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const { data, content: body } = matter(content);
        posts.push({ ...data, body, dir } as Post);
      } catch {
        // Skip
      }
    }

    const fuse = new Fuse(posts, {
      keys: ["title", "excerpt", "body", "category"],
      threshold: 0.4,
      includeScore: true,
    });

    const q =
      query ??
      (
        await inquirer.prompt([
          { type: "input", name: "q", message: "Enter search query:" },
        ])
      ).q;
    if (!q) {
      console.log(chalk.yellow("No query provided."));
      return;
    }

    const results = fuse.search(q);

    console.log(chalk.bold.magenta(`\n🔍 Search results for "${q}":\n`));

    if (results.length === 0) {
      console.log(chalk.yellow("No posts found."));
      return;
    }

    results.forEach(({ item }) => {
      console.log(`${chalk.green("●")} ${chalk.bold(item.title)}`);
      console.log(`  ${chalk.dim(item.dir)}`);
      console.log(`  ${chalk.italic(item.excerpt)}`);
      console.log("");
    });
  } catch (error: unknown) {
    const err = error as { message?: string; name?: string };
    if (
      err.message?.includes("User force closed the prompt") ||
      err.name === "ExitPromptError"
    ) {
      throw error;
    }
    console.error(chalk.red("Error searching posts:"), error);
  }
}
