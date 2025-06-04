
const fs = require('fs-extra');
const replace = require('replace-in-file');
const path = require('path');
const esbuild = require('esbuild');
const glob = require('glob');

const geminiApiKeyFromEnv = process.env.GEMINI_API_KEY;
const outputDir = 'dist';
const sourceDir = __dirname; // Assuming source files are in the same directory or subdirectories

async function build() {
  try {
    console.log('Starting frontend build with esbuild...');
    await fs.emptyDir(outputDir);
    console.log(`Cleaned/ensured output directory: ${outputDir}`);

    // 1. Copy HTML and metadata.json directly
    const staticFilesToCopy = ['index.html', 'metadata.json'];
    for (const file of staticFilesToCopy) {
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(outputDir, file);
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(`Copied static file ${file} to ${destPath}`);
      } else {
        console.warn(`Static file ${srcPath} not found, skipping.`);
      }
    }

    // 2. Find all .ts and .tsx files
    const tsFiles = glob.sync('**/*.{ts,tsx}', {
      cwd: sourceDir,
      ignore: ['node_modules/**', `${outputDir}/**`, 'vite.config.ts'], // Adjust ignore patterns as needed
      nodir: true,
    });

    console.log(`Found ${tsFiles.length} TypeScript/TSX files to transpile.`);

    // 3. Transpile each .ts/.tsx file with esbuild
    for (const relativeFilePath of tsFiles) {
      const sourceFilePath = path.join(sourceDir, relativeFilePath);
      // Change extension to .js for the output file
      const outRelativeFilePath = relativeFilePath.replace(/\.(tsx|ts)$/, '.js');
      const outputFilePath = path.join(outputDir, outRelativeFilePath);

      // Ensure output directory exists
      await fs.ensureDir(path.dirname(outputFilePath));

      try {
        await esbuild.build({
          entryPoints: [sourceFilePath],
          outfile: outputFilePath,
          bundle: false, // Set to false to transpile file by file
          format: 'esm', // Output ES modules
          jsx: 'automatic', // Automatically choose jsx runtime
          // The problematic 'loader' line has been removed from here.
          sourcemap: 'inline', // Or 'external' or false for production
          target: 'esnext', // Transpile to modern JS
          charset: 'utf8',
        });
        console.log(`Transpiled ${sourceFilePath} to ${outputFilePath}`);
      } catch (e) {
        console.error(`Failed to transpile ${sourceFilePath}:`, e);
        // Continue to try other files, but eventually exit with error
        process.exitCode = 1;
      }
    }
    if (process.exitCode === 1) {
      throw new Error('One or more files failed to transpile.');
    }


    // 4. Inject API key into dist/services/geminiService.js
    const targetGeminiServicePath = path.join(outputDir, 'services', 'geminiService.js');
    if (await fs.pathExists(targetGeminiServicePath)) {
      if (!geminiApiKeyFromEnv) {
        console.warn('WARNING: GEMINI_API_KEY environment variable is not set in Vercel. AI features in the deployed app will be disabled or fail.');
      }
      const replacementValue = geminiApiKeyFromEnv ? `"${geminiApiKeyFromEnv}"` : '"MISSING_API_KEY_PLEASE_SET_IN_VERCEL"';
      const options = {
        files: targetGeminiServicePath,
        from: /"%%__GEMINI_API_KEY__%%"/g,
        to: replacementValue,
      };
      await replace(options);
      console.log(`Gemini API key placeholder processed in: ${targetGeminiServicePath}`);
    } else {
      console.error(\`Processed \${targetGeminiServicePath} not found after transpilation. API key injection failed.\`);
    }

    console.log('Frontend build successful. Output in ./dist');
  } catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
  }
}

build();
