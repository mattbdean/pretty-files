const chalk = require('chalk');
const exec = require('child_process').exec;
const kill = require('tree-kill');

let electronOpen = false;
const children = [];

const run = (command, prefix, killOthers = true, onData = () => {}) => {
    const child = exec(command);

    child.stdout.on('data', (data) => {
        process.stdout.write(prefix + ' ' + data);
        onData(data);
    });
    child.stderr.on('data', (data) => {
        process.stderr.write(prefix + ' ' + data);
    });
    if (killOthers)
        child.on('exit', killAll);
    children.push(child);
    return child;
};

const killAll = () => {
    for (const child of children) {
        kill(child.pid);
    }
};

console.log(chalk.blue('Starting webpack-dev-server'));

run('webpack-dev-server --hot', chalk.blue('[webpack]'), true, (data) => {
    // Webpack outputs a line like this when it finishes compiling:
    // "webpack: Compiled successfully."
    // We want to wait until webpack-dev-server has finished its first
    // compilation before we start Electron. Otherwise, we're just gonna have to
    // manually reload the page.
    if (!electronOpen && /Compiled/.test(data)) {
        console.log(chalk.green('Initial build complete, starting Electron'));
        electronOpen = true;
        run('electron .', chalk.green('[electron]'));
    }

    if (/Failed to compile/.test(data) && !electronOpen) {
        console.log(chalk.red('Webpack failed to compile'));
        killAll();
    }
});
