---
# layout: default
# title: Home
lang: ja
permalink: /ja/
---

# @tettekete/cartesian-product

## 概要

所謂デカルト積を返すモジュールです。

### 特徴

- ジェネレーター関数なので大量の組み合わせになるケースでもメモリを圧迫しない
- 組み合わせの計算順を指定出来る
- ESM,CJS,ブラウザサポート


## SYNOPSIS

```ts
import { cartesianProduct } from '@tettekete/cartesian-product';

const arrayList = [
		['A', 'B'],
		['C', 'D', 'E'],
	];

// 一般的なイテレーター取り出し
for( const combination of cartesianProduct( arrayList ) )
{
	console.log( combination );
}

// デフォルトオーダーのサンプル
console.log( Array.from(cartesianProduct( arrayList )) );
// ->
// [
// 	['A', 'C'],
// 	['B', 'C'],
// 	['A', 'D'],
// 	['B', 'D'],
// 	['A', 'E'],
// 	['B', 'E'],
// ]

// リバースオーダーのサンプル
// `[1,0]` の 1 や 0 は `arrayList` のインデックス値で、組み合わせを回す優先順を表します。
console.log( Array.from( cartesianProduct( arrayList , [1,0] ) ) );
// ->
// [
// 	['A', 'C'],
// 	['A', 'D'],
// 	['A', 'E'],
// 	['B', 'C'],
// 	['B', 'D'],
// 	['B', 'E'],
// ]
```
