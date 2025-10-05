// jest.config.js  （type:module 下なので ESM）
export default {
testEnvironment: 'node',
// resolver: 'ts-jest-resolver',
extensionsToTreatAsEsm: ['.ts'],
transform: {
	'^.+\\.tsx?$': [
	'ts-jest',
	{
		useESM: true,                 // ここがポイント（ts-jest を ESM 出力に）
		// 以下、tsconfig.json が微妙に異なる場合など、ここで再宣言する
		// tsconfig: {
		// // あなたの方針に合わせてどちらか:
		// moduleResolution: 'NodeNext', module: 'NodeNext',
		// // moduleResolution: 'Bundler', module: 'ESNext',
		// target: 'ES2022',
		// verbatimModuleSyntax: true,
		// // （任意）デバッグしやすく(sourceMap と inlineSourceMap はいずれかのみ指定可)
		// sourceMap: true,
		// inlineSourceMap: true
		// },
	},
	],
},
// お好み。明示しておくと拡張子解決の揺れを減らせます
moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'cjs', 'json', 'node'],
// example ディレクトリ配下は実行サンプルなのでテスト対象から除外
testPathIgnorePatterns: ['/node_modules/', '/example/']
};
