import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import matter from "gray-matter";

export async function listPosts() {
  const postsDir = path.join(process.cwd(), "src", "content", "posts");

  try {
    const dirs = await fs.readdir(postsDir);
    console.log(chalk.bold.cyan(`\n📚 Found ${dirs.length} posts:\n`));

    for (const dir of dirs) {
      const filePath = path.join(postsDir, dir, "index.md");
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const { data } = matter(content);

        console.log(`${chalk.green("●")} ${chalk.bold(data.title)}`);
        console.log(
          `  ${chalk.dim(dir)} | ${chalk.yellow(data.category)} | ${chalk.blue(data.date)}`,
        );
        console.log("");
      } catch (e) {
        // Skip if not a valid post dir
      }
    }
  } catch (error) {
    console.error(chalk.red("Error listing posts:"), error);
  }
}
