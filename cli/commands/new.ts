import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';
import { generateTemplate, generateSlug } from '../utils/template-generator.js';
import { optimizeImage } from '../utils/image-optimizer.js';

export async function newPost() {
    console.log(chalk.bold.magenta('\n📝 Create a New Blog Post\n'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Post Title:',
            validate: (input) => input.length > 0 || 'Title is required',
        },
        {
            type: 'list',
            name: 'category',
            message: 'Category:',
            choices: ['tech', 'music', 'games', 'commentary'],
        },
        {
            type: 'input',
            name: 'excerpt',
            message: 'Excerpt:',
            validate: (input) => input.length > 0 || 'Excerpt is required',
        },
        {
            type: 'input',
            name: 'tags',
            message: 'Tags (comma separated):',
            filter: (input: string) => input.split(',').map((t: string) => t.trim().toLowerCase()).filter((t: string) => t.length > 0),
        },
        {
            type: 'confirm',
            name: 'addImages',
            message: 'Do you want to add images?',
            default: false,
        },
        {
            type: 'input',
            name: 'imagePaths',
            message: 'Enter image paths (comma separated):',
            when: (answers) => answers.addImages,
        },
    ]);

    const slug = generateSlug(answers.title);
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const folderName = `${dateStr}-${slug}`;
    const postDir = path.join(process.cwd(), 'src', 'content', 'posts', folderName);
    const imagesDir = path.join(postDir, 'images');

    const spinner = ora('Creating post...').start();

    try {
        // Create directories
        await fs.mkdir(postDir, { recursive: true });

        // Handle images
        let imageContent = '';
        if (answers.addImages && answers.imagePaths) {
            spinner.text = 'Optimizing images...';
            const paths = answers.imagePaths.split(',').map((p: string) => p.trim());

            for (const imgPath of paths) {
                try {
                    const optimizedName = await optimizeImage(imgPath, imagesDir);
                    imageContent += `\n![Image Description](./images/${optimizedName})\n`;
                } catch (e) {
                    console.warn(chalk.yellow(`Could not process image: ${imgPath}`));
                }
            }
        }

        // Generate Markdown
        spinner.text = 'Generating markdown...';
        let content = generateTemplate({
            title: answers.title,
            date,
            category: answers.category,
            excerpt: answers.excerpt,
            tags: answers.tags,
        });

        if (imageContent) {
            content += `\n## Images\n${imageContent}`;
        }

        await fs.writeFile(path.join(postDir, 'index.md'), content);

        spinner.succeed(chalk.green(`Post created successfully!`));
        console.log(chalk.dim(`Location: ${postDir}`));

    } catch (error) {
        spinner.fail(chalk.red('Failed to create post'));
        console.error(error);
    }
}
