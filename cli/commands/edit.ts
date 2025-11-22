import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import matter from 'gray-matter';
import Fuse from 'fuse.js';
import { generateSlug } from '../utils/template-generator.js';

export async function editPost() {
    console.log(chalk.bold.magenta('\n✏️  Edit a Blog Post\n'));

    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

    try {
        // Get all post directories
        const postDirs = await fs.readdir(postsDir);
        const posts = [];

        for (const dir of postDirs) {
            const postPath = path.join(postsDir, dir, 'index.md');
            try {
                const content = await fs.readFile(postPath, 'utf-8');
                const { data } = matter(content);
                posts.push({
                    name: `${data.title} (${dir})`,
                    value: dir,
                    data,
                });
            } catch (e) {
                // Skip if not a valid post
                continue;
            }
        }

        if (posts.length === 0) {
            console.log(chalk.yellow('No posts found.'));
            return;
        }

        // Search/Select post
        const fuse = new Fuse(posts, {
            keys: [
                { name: 'name', weight: 0.7 },
                { name: 'value', weight: 0.3 },
            ],
            threshold: 0.3, // Lower threshold for more lenient matching
            includeScore: true,
        });

        let selectedPost = null;

        while (!selectedPost) {
            const { query } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'query',
                    message: 'Search posts (type to filter, enter for all):',
                },
            ]);

            const results = query ? fuse.search(query).map(r => r.item) : posts;

            if (results.length === 0) {
                console.log(chalk.yellow('No posts found matching that query.'));
                const { tryAgain } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'tryAgain',
                        message: 'Try again?',
                        default: true
                    }
                ]);

                if (!tryAgain) {
                    return;
                }
                continue;
            }

            // Add a small delay to ensure stdin is clear
            await new Promise(resolve => setTimeout(resolve, 100));

            const { selection } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selection',
                    message: 'Select a post:',
                    choices: [
                        ...results.map(p => ({ name: p.name, value: p.value })),
                        new inquirer.Separator(),
                        { name: '🔍 Search again', value: 'SEARCH_AGAIN' }
                    ],
                },
            ]);

            if (selection === 'SEARCH_AGAIN') {
                continue;
            }

            selectedPost = selection;
        }

        const post = posts.find(p => p.value === selectedPost);

        if (!post) {
            console.error(chalk.red(`\nError: Invalid selection '${selectedPost}'. Post not found.`));
            return;
        }

        const postPath = path.join(postsDir, selectedPost, 'index.md');
        const fileContent = await fs.readFile(postPath, 'utf-8');
        const { data: currentData, content: currentContent } = matter(fileContent);

        console.log(chalk.dim('\nCurrent metadata:'));
        console.log(chalk.dim(JSON.stringify(currentData, null, 2)));

        // Edit metadata
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Title:',
                default: currentData.title,
            },
            {
                type: 'input',
                name: 'date',
                message: 'Date (YYYY-MM-DD):',
                default: currentData.date instanceof Date
                    ? new Intl.DateTimeFormat('en-CA').format(currentData.date)
                    : String(currentData.date).split('T')[0], // Handle string dates or other formats
                validate: (input) => {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                    return dateRegex.test(input) || 'Please enter a valid date (YYYY-MM-DD)';
                },
            },
            {
                type: 'list',
                name: 'category',
                message: 'Category:',
                choices: ['tech', 'music', 'games', 'commentary'],
                default: currentData.category,
            },
            {
                type: 'input',
                name: 'excerpt',
                message: 'Excerpt:',
                default: currentData.excerpt,
            },
        ]);

        // Update frontmatter
        const updatedData = {
            title: answers.title,
            date: answers.date,
            category: answers.category,
            excerpt: answers.excerpt,
            tags: currentData.tags || [],
        };

        const updatedContent = matter.stringify(currentContent, updatedData);

        // Check if title or date changed - might need to rename folder
        const currentDate = currentData.date instanceof Date
            ? new Intl.DateTimeFormat('en-CA').format(currentData.date)
            : String(currentData.date).split('T')[0];

        const titleChanged = currentData.title !== answers.title;
        const dateChanged = currentDate !== answers.date;

        if (titleChanged || dateChanged) {
            const newSlug = generateSlug(answers.title);
            const newFolderName = `${answers.date}-${newSlug}`;
            const oldFolderPath = path.join(postsDir, selectedPost);
            const newFolderPath = path.join(postsDir, newFolderName);

            if (oldFolderPath !== newFolderPath) {
                // Rename folder
                await fs.rename(oldFolderPath, newFolderPath);
                console.log(chalk.cyan(`\n📁 Renamed folder: ${selectedPost} → ${newFolderName}`));

                // Write to new location
                const newPostPath = path.join(newFolderPath, 'index.md');
                await fs.writeFile(newPostPath, updatedContent);

                console.log(chalk.green('\n✓ Post updated successfully!'));
                console.log(chalk.dim(`Location: ${newPostPath}`));
                return;
            }
        }

        // No folder rename needed, just update the file
        await fs.writeFile(postPath, updatedContent);

        console.log(chalk.green('\n✓ Post updated successfully!'));
        console.log(chalk.dim(`Location: ${postPath}`));

    } catch (error) {
        console.error(chalk.red('Failed to edit post:'), error);
    }
}
