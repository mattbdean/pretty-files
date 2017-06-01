const chalk = require('chalk');
const exec = require('child_process').exec;

let electronOpen = false;

const run = (command, prefix, onData = () => {}) => {
    const child = exec(command);

    child.stdout.on('data', (data) => {
        process.stdout.write(prefix + ' ' + data + '\n');
        onData(data);
    });
    child.stderr.on('data', (data) => {
        process.stderr.write(prefix + ' ' + data + '\n');
    });
    return child;
};

console.log(chalk.blue('Starting webpack-dev-server'));

run('webpack-dev-server --hot', chalk.blue('[webpack]'), (data) => {
    // Webpack outputs a line like this when it finishes compiling:
    // "webpack: Compiled successfully."
    // We want to wait until webpack-dev-server has finished its first
    // compilation before we start Electron. Otherwise, we're just gonna have to
    // manually reload the page.
    if (!electronOpen && /Compiled/.test(data)) {
        console.log(chalk.green('Initial build complete, starting Electron'));
        electronOpen = true;
        run('electron .', chalk.green('[electron]'))
    }
});
