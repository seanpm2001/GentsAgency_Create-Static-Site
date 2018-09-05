#!/usr/bin/env node

const fs = require('fs-extra');
const cp = require('child_process');
const minimist = require('minimist');
const path = require('path');

const cwd = (() => {
	const argv = minimist(process.argv.slice(2));

	if (argv._ && argv._.length > 0) {
		const dir = argv._.pop();
		return `${process.cwd()}/${dir}`;
	}

	return process.cwd();
})();

const projectName = path.basename(cwd);

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
		run('npm i --save-dev eslint@^4.19.1 eslint-plugin-import@^2.13.0 @gentsagency/eslint-config@^2.0.0 stylelint@^9.3.0 @gentsagency/stylelint-config@^1.1.0 gulp@^4.0.0 @gentsagency/gulp-registry@^1.2.0'),
		run('npm i normalize.css'),
		fs.copy(`${__dirname}/templates/gitignore`, `${cwd}/.gitignore`),
		fs.copy(`${__dirname}/templates/editorconfig`, `${cwd}/.editorconfig`),
		fs.copy(`${__dirname}/templates/browserslistrc`, `${cwd}/.browserslistrc`),
		fs.copy(`${__dirname}/templates/eslintrc.js`, `${cwd}/.eslintrc.js`),
		fs.copy(`${__dirname}/templates/stylelintrc.js`, `${cwd}/.stylelintrc.js`),
		fs.copy(`${__dirname}/templates/gulpfile.js`, `${cwd}/gulpfile.js`),
		fs.copy(`${__dirname}/templates/gulp`, `${cwd}/gulp`),
		fs.copy(`${__dirname}/templates/www`, `${cwd}/www`),
	]);

	await fs.outputJson(`${cwd}/www/manifest.json`, {
		name: projectName,
		short_name: projectName.substr(0, 12), 
		icons: [
			{
				src: '/favicons/favicon-192x192.png',
				type: 'image/png',
				sizes: '192x192',
			},
			{
				src: '/favicons/favicon-512x512.png',
				type: 'image/png',
				sizes: '512x512',
			},
		],
		start_url: '/',
		display: 'standalone',
	}, { spaces: 2 });

	console.log('🤖 Registering automation scripts');
	console.log('');
	const pkg = await fs.readJson(`${cwd}/package.json`);

	if (!pkg.scripts) {
		pkg.scripts = {};
	}

	Object.assign(pkg.scripts, {
		'lint:css': 'stylelint --fix gulp/css/**/*.css; exit 0;',
		'lint:javascript': 'eslint --fix gulp/js/**/*.js; exit 0;',
		lint: 'npm run lint:css & npm run lint:javascript',
	});

	await fs.outputJson(`${cwd}/package.json`, pkg, { spaces: 2 });

	console.log('🌱 All set! Let\'s get you started:');
	console.log('');
	console.log(`    cd ${cwd}`);
	console.log('    gulp watch');
	console.log('');
	console.log('🤞 Good luck, have fun!');
}());
