// esbuild.config.mjs
import { build } from "esbuild";

const sharedOptions = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: true,
	sourcemap: false,			// プロダクションビルドでは普通 false
	treeShaking: true,
	legalComments: "linked"
};

await Promise.all([
	build({
		...sharedOptions,
		format: "esm",
		platform: "node",
		target: ["node18"],        // 対応する Node 版に合わせて変更
		outfile: "dist/index.js"
	}),
	build({
		...sharedOptions,
		format: "cjs",
		platform: "node",
		target: ["node18"],
		outfile: "dist/index.cjs"
	}),
	build({
		...sharedOptions,
		format: "esm",
		platform: "browser",
		target: ["es2020"],        // ブラウザ対応範囲に合わせて変更
		outfile: "dist/index.browser.js"
	})
]);
