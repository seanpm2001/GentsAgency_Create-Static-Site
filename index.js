#!/usr/bin/env node

const fs = require('fs');
const cp = require('child_process');
const mkdirp = require('mkdirp');

const cwd = (() => {
	if (process.argv.length > 2) {
		const dir = process.argv[process.argv.length - 1];
		return `${process.cwd()}/${dir}`;
	}

	return process.cwd();
})();

const run = (cmd) => new Promise((resolve, reject) => {
	cp.exec(cmd, { cwd }, (err) => {
		if (err) {
			return reject(err);
		}

		return resolve();
	});
});

const createDirectory = (dir) => new Promise((resolve, reject) => {
	mkdirp(dir, (err) => {
		if (err) {
			return reject(err);
		}

		return resolve();
	});
});

const copyFile = (src, dest) => new Promise((resolve, reject) => {
	const read = fs.createReadStream(`${__dirname}/templates/${src}`);

	read.on('error', (err) => reject(err));

	const write = fs.createWriteStream(`${cwd}/${dest || src}`);

	write.on('error', (err) => reject(err));

	write.on('close', () => resolve());

	read.pipe(write);
});

const copyDirectory = (src, dest) => run(`cp -r ${__dirname}/templates/${src} ${cwd}/${dest || src}`);

(async function createStaticSite() {
	console.log(`👋 Creating a new static website in ${cwd}`);
	console.log('');
	await createDirectory(cwd);
	await run('npm init --yes --scope@gentsagency');

	console.log('📥 Installing dependencies & moving files around');
	console.log('☕️ This might take a while');
	console.log('');
	await Promise.all([
		run('npm i --save-dev eslint eslint-plugin-import @gentsagency/eslint-config stylelint @gentsagency/stylelint-config gulp@^4.0.0 @gentsagency/gulp-registry'),
		copyFile('gitignore', '.gitignore'),
		copyFile('editorconfig', '.editorconfig'),
		copyFile('browserslistrc', '.browserslistrc'),
		copyFile('eslintrc.js', '.eslintrc.js'),
		copyFile('stylelintrc.js', '.stylelintrc.js'),
		copyFile('gulpfile.js'),
		copyDirectory('gulp'),
		copyDirectory('www'),
	]);

	console.log('🌱 All set! Let\'s get you started:');
	console.log('');
	console.log(`    cd ${cwd}`);
	console.log('    gulp watch');
	console.log('');
	console.log('🤞 Good luck, have fun!');
}());
