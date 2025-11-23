#!/usr/bin/env node
import { Command } from "commander";
import { newPost } from "./commands/new.js";
import { listPosts } from "./commands/list.js";
import { searchPosts } from "./commands/search.js";
import { editPost } from "./commands/edit.js";
import { deletePost } from "./commands/delete.js";

import chalk from "chalk";

const program = new Command();

// Wrapper for graceful exit on Ctrl+C
const withGracefulExit = (fn: (...args: any[]) => Promise<void>) => {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (error: any) {
      if (
        error.message?.includes("User force closed the prompt") ||
        error.name === "ExitPromptError"
      ) {
        console.log(chalk.yellow("\n👋 Leaving this space..."));
        process.exit(0);
      }
      throw error;
    }
  };
};

program
  .name("kawaii-blog")
  .description("CLI tool for managing KawaiiBlog posts")
  .version("1.0.0");

program
  .command("new")
  .description("Create a new blog post")
  .action(withGracefulExit(newPost));

program
  .command("list")
  .description("List all blog posts")
  .action(withGracefulExit(listPosts));

program
  .command("search [query]")
  .description("Search blog posts")
  .action((query?: string) => withGracefulExit(searchPosts)(query));

program
  .command("edit")
  .description("Edit an existing blog post")
  .action(withGracefulExit(editPost));

program
  .command("delete")
  .description("Delete an existing blog post")
  .action(withGracefulExit(deletePost));

program.parse();
