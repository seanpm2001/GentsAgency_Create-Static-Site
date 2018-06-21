#!/usr/bin/env node

const fs = require('fs-extra');
const cp = require('child_process');
const minimist = require('minimist');

const cwd = (() => {
	const argv = minimist(process.argv.slice(2));

	if (argv._ && argv._.length > 0) {
		const dir = argv._.pop();
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

(async function createStaticSite() {
	console.log(`👋 Creating a new static website in ${cwd}`);
	console.log('');
	await fs.ensureDir(cwd);
	await run('npm init --yes --scope=@gentsagency');

	console.log('📥 Installing dependencies & moving files around');
	console.log('☕️ This might take a while');
	console.log('');
	await Promise.all([
		run('npm i --save-dev eslint eslint-plugin-import @gentsagency/eslint-config stylelint @gentsagency/stylelint-config gulp@^4.0.0 @gentsagency/gulp-registry'),
		fs.copy(`${__dirname}/templates/gitignore`, `${cwd}/.gitignore`),
		fs.copy(`${__dirname}/templates/editorconfig`, `${cwd}/.editorconfig`),
		fs.copy(`${__dirname}/templates/browserslistrc`, `${cwd}/.browserslistrc`),
		fs.copy(`${__dirname}/templates/eslintrc.js`, `${cwd}/.eslintrc.js`),
		fs.copy(`${__dirname}/templates/stylelintrc.js`, `${cwd}/.stylelintrc.js`),
		fs.copy(`${__dirname}/templates/gulpfile.js`, `${cwd}/gulpfile.js`),
		fs.copy(`${__dirname}/templates/gulp`, `${cwd}/gulp`),
		fs.copy(`${__dirname}/templates/www`, `${cwd}/www`),
	]);

	console.log('🌱 All set! Let\'s get you started:');
	console.log('');
	console.log(`    cd ${cwd}`);
	console.log('    gulp watch');
	console.log('');
	console.log('🤞 Good luck, have fun!');
}());
