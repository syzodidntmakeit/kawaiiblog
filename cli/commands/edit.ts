import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import matter from 'gray-matter';
import Fuse from 'fuse.js';

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
            keys: ['name', 'value'],
            threshold: 0.4,
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
                continue;
            }

            const { selectionName } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectionName',
                    message: 'Select a post:',
                    choices: [
                        ...results.map(p => p.name),
                        new inquirer.Separator(),
                        '🔍 Search again',
                    ],
                },
            ]);

            if (selectionName === '🔍 Search again') {
                continue;
            }

            if (selectionName) {
                const selected = results.find(p => p.name === selectionName);
                if (selected) {
                    selectedPost = selected.value;
                    break;
                }
            }
        }

        const post = posts.find(p => p.value === selectedPost);
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
                    ? currentData.date.toISOString().split('T')[0]
                    : currentData.date,
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
        };

        const updatedContent = matter.stringify(currentContent, updatedData);
        await fs.writeFile(postPath, updatedContent);

        console.log(chalk.green('\n✓ Post updated successfully!'));
        console.log(chalk.dim(`Location: ${postPath}`));

    } catch (error) {
        console.error(chalk.red('Failed to edit post:'), error);
    }
}
