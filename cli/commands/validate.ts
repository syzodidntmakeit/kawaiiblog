import fs from "fs";
import path from "path";
import matter from "gray-matter";
import chalk from "chalk";
import ora from "ora";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function validateContent() {
  const spinner = ora("Validating content...").start();
  let issues = 0;

  try {
    const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(POSTS_DIR, entry.name);
        const mdPath = path.join(dirPath, "index.md");

        if (!fs.existsSync(mdPath)) {
          console.log(chalk.red(`\n❌ Missing index.md in ${entry.name}`));
          issues++;
          continue;
        }

        const content = fs.readFileSync(mdPath, "utf-8");
        const { data, content: body } = matter(content);

        // Check required frontmatter
        const requiredFields = ["title", "date", "category", "excerpt"];
        const missingFields = requiredFields.filter((f) => !data[f]);

        if (missingFields.length > 0) {
          console.log(
            chalk.yellow(
              `\n⚠️  ${entry.name}: Missing frontmatter fields: ${missingFields.join(", ")}`,
            ),
          );
          issues++;
        }

        // Check for broken local image links in markdown
        const imageRegex = /!\[.*?\]\((.*?)\)/g;
        let match;
        while ((match = imageRegex.exec(body)) !== null) {
          const imgPath = match[1];
          // Ignore external links
          if (imgPath.startsWith("http")) continue;

          // Check if relative path exists
          if (imgPath.startsWith("./") || !imgPath.startsWith("/")) {
            const absoluteImgPath = path.join(dirPath, imgPath);
            if (!fs.existsSync(absoluteImgPath)) {
              console.log(
                chalk.red(`\n❌ ${entry.name}: Broken image link: ${imgPath}`),
              );
              issues++;
            }
          } else if (imgPath.startsWith("/")) {
            // Check public dir
            const absoluteImgPath = path.join(PUBLIC_DIR, imgPath);
            if (!fs.existsSync(absoluteImgPath)) {
              console.log(
                chalk.red(
                  `\n❌ ${entry.name}: Broken public image link: ${imgPath}`,
                ),
              );
              issues++;
            }
          }
        }
      }
    }

    if (issues === 0) {
      spinner.succeed("Validation complete! No issues found. ✨");
    } else {
      spinner.fail(`Validation complete. Found ${issues} issues.`);
      process.exit(1);
    }
  } catch (error) {
    spinner.fail("Validation failed with error");
    console.error(error);
  }
}
