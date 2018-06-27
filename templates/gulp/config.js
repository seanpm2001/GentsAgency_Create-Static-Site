const buildPath = './www/assets';
const sourcePath = './gulp';

module.exports = {
	css: {
		src: `${sourcePath}/css/*.css`,
		dest: `${buildPath}/css`,
		watch: [
			`${sourcePath}/css/**/*.css`,
			`${sourcePath}/css/*.css`,
		],
	},
	favicons: {
		src: {
			png: `${sourcePath}/favicons/favicon.png`,
			svg: `${sourcePath}/favicons/favicon.svg`,
		},
		dest: `${buildPath}/favicons`,
	},
	icons: {
		src: `${sourcePath}/icons/*.svg`,
		dest: `${buildPath}/icons`,
		filename: 'icons.svg',
	},
	images: {
		src: `${sourcePath}/images/**`,
		dest: `${buildPath}/images`,
	},
	js: {
		src: `${sourcePath}/js/*.js`,
		dest: `${buildPath}/js`,
		watch: [
			`${sourcePath}/js/**/*.js`,
			`${sourcePath}/js/*.js`,
		],
	},
};
