import fs from "fs";
import path from "path";
import archiver from "archiver";
import chalk from "chalk";
import ora from "ora";

export async function exportBlog() {
    const spinner = ora("Exporting blog content...").start();

    try {
        const outputDir = path.join(process.cwd(), "exports");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const zipPath = path.join(outputDir, `kawaiiblog-export-${timestamp}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", {
            zlib: { level: 9 } // Sets the compression level.
        });

        output.on("close", function () {
            spinner.succeed(`Export complete! Archive created at: ${chalk.green(zipPath)}`);
            console.log(`${archive.pointer()} total bytes`);
        });

        archive.on("warning", function (err) {
            if (err.code === "ENOENT") {
                console.warn(err);
            } else {
                throw err;
            }
        });

        archive.on("error", function (err) {
            throw err;
        });

        archive.pipe(output);

        // Append content directory
        archive.directory("src/content/", "content");

        // Append public images
        if (fs.existsSync("public/images")) {
            archive.directory("public/images/", "images");
        }

        await archive.finalize();

    } catch (error) {
        spinner.fail("Export failed");
        console.error(error);
    }
}
