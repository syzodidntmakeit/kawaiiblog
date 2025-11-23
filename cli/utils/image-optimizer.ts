import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";

export async function optimizeImage(
  inputPath: string,
  outputDir: string,
): Promise<string> {
  try {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const outputFilename = `${filename}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    await sharp(inputPath)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(chalk.green(`✔ Optimized: ${outputFilename}`));
    return outputFilename;
  } catch (error) {
    console.error(chalk.red(`✘ Failed to optimize ${inputPath}:`), error);
    throw error;
  }
}
