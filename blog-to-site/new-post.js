// new-post.js
// Asks you 3 questions and builds the post directory and markdown file.
// ---------------------------------------------------

// ESM-style imports (the fix)
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
    console.log(chalk.blue.bold('🚀 Let\'s cook a new blog post...'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What\'s the post title?',
            validate: (input) => input ? true : 'Title can\'t be empty, dumbass.',
        },
        {
            type: 'list',
            name: 'category',
            message: 'What\'s the category?',
            choices: ['tech', 'commentary', 'anime', 'music', 'games', 'cars', 'lifting', 'other'],
            default: 'tech',
        },
        {
            type: 'input',
            name: 'excerpt',
            message: 'What\'s the 1-2 line excerpt?',
            validate: (input) => input ? true : 'Excerpt can\'t be empty.',
        },
    ]);

    // --- Generate all the data ---
    const { title, category, excerpt } = answers;

    // Create a URL-safe ID slug from the title
    const postIdSlug = title.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')        // Remove all non-word chars
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end

    const date = new Date();
    const yyyyMmDd = date.toISOString().split('T')[0]; // '2025-10-21'
    const ddMmYyyy = yyyyMmDd.split('-').reverse().join('-'); // '21-10-2025'
    
    // Use path.resolve to go UP from __dirname to the root, then into /posts
    const postDir = path.resolve(__dirname, '..', 'posts', ddMmYyyy);
    const postFilePath = path.join(postDir, 'blog.md');
    
    // --- Check if post already exists ---
    if (fs.existsSync(postDir) || fs.existsSync(postFilePath)) {
        console.error(chalk.red.bold(`❌ Error: A post directory for "${ddMmYyyy}" already exists.`));
        console.log(chalk.yellow('Wait, are you writing two posts in one day? You good?'));
        process.exit(1);
    }

    // --- Read the template ---
    const templatePath = path.join(__dirname, 'template.md'); // Assumes template.md is in the same dir
    if (!fs.existsSync(templatePath)) {
        console.error(chalk.red.bold(`❌ Error: template.md not found in ${__dirname}.`));
        process.exit(1);
    }
    let templateContent = fs.readFileSync(templatePath, 'utf8');

    // --- Replace placeholders ---
    const replacements = {
        '[POST_ID_SLUG]': postIdSlug,
        '[POST_TITLE]': title, // <-- This was missing in your old script
        '[YYYY-MM-DD]': yyyyMmDd,
        '[CATEGORY]': category,
        '[EXCERPT]': excerpt,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
        const regex = new RegExp(placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g');
        templateContent = templateContent.replace(regex, value);
    }

    // --- Create files ---
    fs.mkdirSync(postDir);
    fs.writeFileSync(postFilePath, templateContent);

    console.log(chalk.green.bold('\n✅ Success! Your post is ready to write.'));
    console.log(chalk.cyan(`   - Directory created: ${postDir}`));
    console.log(chalk.cyan(`   - Markdown file created: ${postFilePath}`));
    console.log(chalk.yellow('\nNow go write your banger, and don\'t forget to make your images:'));
    console.log(chalk.magenta(`   - Banner:    /assets/images/banners/${ddMmYyyy}.png`));
    console.log(chalk.magenta(`   - Thumbnail: /assets/images/thumbnails/${ddMmYyyy}.webp`));
};

run().catch(err => {
    console.error(chalk.red('An unexpected error occurred:', err));
    process.exit(1);
});
