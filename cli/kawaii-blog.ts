#!/usr/bin/env node
import { Command } from 'commander';
import { newPost } from './commands/new.js';
import { listPosts } from './commands/list.js';
import { searchPosts } from './commands/search.js';
import { editPost } from './commands/edit.js';
import { deletePost } from './commands/delete.js';

const program = new Command();

program
    .name('kawaii-blog')
    .description('CLI tool for managing KawaiiBlog posts')
    .version('1.0.0');

program
    .command('new')
    .description('Create a new blog post')
    .action(newPost);

program
    .command('list')
    .description('List all blog posts')
    .action(listPosts);

program
    .command('search [query]')
    .description('Search blog posts')
    .action((query?: string) => searchPosts(query));

program
    .command('edit')
    .description('Edit an existing blog post')
    .action(editPost);

program
    .command('delete')
    .description('Delete an existing blog post')
    .action(deletePost);

program.parse();
