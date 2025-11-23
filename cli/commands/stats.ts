import fs from "fs";
import path from "path";
import matter from "gray-matter";
import chalk from "chalk";
import ora from "ora";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

interface PostData {
    title: string;
    date: Date;
    category: string;
    draft?: boolean;
    series?: { name: string; order: number };
    words: number;
    [key: string]: unknown;
}

export async function showStats() {
    const spinner = ora("Calculating blog stats...").start();

    try {
        const posts: PostData[] = [];
        const categories: Record<string, number> = {};
        const months: Record<string, number> = {};
        let totalWords = 0;
        let totalReadTime = 0;
        let drafts = 0;
        let published = 0;
        const series: Record<string, number> = {};

        const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const mdPath = path.join(POSTS_DIR, entry.name, "index.md");
                if (fs.existsSync(mdPath)) {
                    const content = fs.readFileSync(mdPath, "utf-8");
                    const { data, content: body } = matter(content);

                    // Count posts
                    if (data.draft) {
                        drafts++;
                    } else {
                        published++;
                    }

                    // Categories
                    const cat = data.category || "uncategorized";
                    categories[cat] = (categories[cat] || 0) + 1;

                    // Months
                    if (data.date) {
                        const date = new Date(data.date);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                        months[monthKey] = (months[monthKey] || 0) + 1;
                    }

                    // Series
                    if (data.series) {
                        const seriesName = data.series.name;
                        series[seriesName] = (series[seriesName] || 0) + 1;
                    }

                    // Word count & Read time
                    const words = body.trim().split(/\s+/).length;
                    totalWords += words;
                    totalReadTime += Math.ceil(words / 200); // 200 wpm

                    posts.push({ ...data, words } as PostData);
                }
            }
        }

        spinner.succeed("Stats calculated successfully!");

        console.log(chalk.bold.cyan("\n📊 KawaiiBlog Statistics\n"));

        console.log(chalk.bold("General"));
        console.log(`  Total Posts: ${chalk.green(posts.length)}`);
        console.log(`  Published:   ${chalk.blue(published)}`);
        console.log(`  Drafts:      ${chalk.yellow(drafts)}`);
        console.log("");

        console.log(chalk.bold("Content"));
        console.log(`  Total Words: ${chalk.magenta(totalWords.toLocaleString())}`);
        console.log(`  Avg Length:  ${chalk.magenta(Math.round(totalWords / posts.length).toLocaleString())} words`);
        console.log(`  Total Read:  ${chalk.magenta(totalReadTime)} mins`);
        console.log(`  Avg Read:    ${chalk.magenta(Math.round(totalReadTime / posts.length))} mins`);
        console.log("");

        console.log(chalk.bold("Categories"));
        Object.entries(categories)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .forEach(([cat, count]) => {
                console.log(`  ${cat.padEnd(15)} ${chalk.cyan(count)}`);
            });
        console.log("");

        console.log(chalk.bold("Most Active Months"));
        Object.entries(months)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .forEach(([month, count]) => {
                console.log(`  ${month.padEnd(15)} ${chalk.cyan(count)} posts`);
            });
        console.log("");

        if (Object.keys(series).length > 0) {
            console.log(chalk.bold("Series"));
            Object.entries(series).forEach(([name, count]) => {
                console.log(`  ${name.padEnd(20)} ${chalk.cyan(count)} parts`);
            });
            console.log("");
        }

    } catch (error) {
        spinner.fail("Failed to calculate stats");
        console.error(error);
    }
}
