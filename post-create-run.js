const { spawn } = require('child_process');

const title = process.argv.slice(2).join(' ').trim();

if (!title) {
    console.error('Please provide a title for your post.');
    process.exit(1);
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

(async () => {
    try {
        await run(npmCommand, ['run', 'new-post', '--', title]);
        await run(npmCommand, ['run', 'generate']);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
})();
