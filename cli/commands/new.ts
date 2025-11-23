import inquirer from "inquirer";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import ora from "ora";
import { generateTemplate, generateSlug } from "../utils/template-generator.js";

export async function newPost() {
  console.log(chalk.bold.magenta("\n📝 Create a New Blog Post\n"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Post Title:",
      validate: (input) => input.length > 0 || "Title is required",
    },
    {
      type: "list",
      name: "category",
      message: "Category:",
      choices: ["tech", "music", "games", "commentary"],
    },
    {
      type: "input",
      name: "excerpt",
      message: "Excerpt:",
      validate: (input) => input.length > 0 || "Excerpt is required",
    },
  ]);

  const slug = generateSlug(answers.title);
  const date = new Date();
  // Use local timezone to avoid date shifting issues
  const dateStr = new Intl.DateTimeFormat("en-CA").format(date); // en-CA uses YYYY-MM-DD
  const folderName = `${dateStr}-${slug}`;
  const postDir = path.join(
    process.cwd(),
    "src",
    "content",
    "posts",
    folderName,
  );

  const spinner = ora("Creating post...").start();

  try {
    // Create directory
    await fs.mkdir(postDir, { recursive: true });

    // Generate Markdown
    const content = generateTemplate({
      title: answers.title,
      date,
      category: answers.category,
      excerpt: answers.excerpt,
    });

    await fs.writeFile(path.join(postDir, "index.md"), content);

    spinner.succeed(chalk.green(`Post created successfully!`));
    console.log(chalk.dim(`Location: ${postDir}`));
  } catch (error: unknown) {
    spinner.fail(chalk.red("Failed to create post"));
    const err = error as Error;
    console.error(chalk.red("Error:"), err.message || err);
  }
}
