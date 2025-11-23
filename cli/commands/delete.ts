import inquirer from "inquirer";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import ora from "ora";

export async function deletePost() {
  console.log(chalk.bold.red("\n🗑️  Delete a Blog Post\n"));

  const postsDir = path.join(process.cwd(), "src", "content", "posts");

  try {
    const entries = await fs.readdir(postsDir, { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    if (directories.length === 0) {
      console.log(chalk.yellow("No posts found to delete."));
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "postFolder",
        message: "Select a post to delete:",
        choices: directories,
      },
      {
        type: "confirm",
        name: "confirmDelete",
        message: (answers) =>
          `Are you sure you want to delete "${answers.postFolder}"? This cannot be undone.`,
        default: false,
      },
    ]);

    if (!answers.confirmDelete) {
      console.log(chalk.blue("Deletion cancelled."));
      return;
    }

    const spinner = ora("Deleting post...").start();
    const targetDir = path.join(postsDir, answers.postFolder);

    await fs.rm(targetDir, { recursive: true, force: true });

    spinner.succeed(
      chalk.green(`Post "${answers.postFolder}" deleted successfully!`),
    );
  } catch (error: unknown) {
    const err = error as { message?: string; name?: string };
    if (
      err.message?.includes("User force closed the prompt") ||
      err.name === "ExitPromptError"
    ) {
      throw error;
    }
    console.error(chalk.red("Error managing posts:"), error);
  }
}
