# @tettekete/cartesian-product

## Overview

This module returns the Cartesian product.

### Features

- Implemented as a generator function, so it handles large result sets without exhausting memory
- Allows you to specify the iteration order of the combinations
- Supports ESM, CJS, and browsers

## SYNOPSIS

```ts
import { cartesianProduct } from '@tettekete/cartesian-product';

const arrayList = [
		['A', 'B'],
		['C', 'D', 'E'],
	];

console.log( Array.from(cartesianProduct( arrayList )) ); // default order is [0,1,2,...]
// ->
// [
// 	['A', 'C'],
// 	['B', 'C'],
// 	['A', 'D'],
// 	['B', 'D'],
// 	['A', 'E'],
// 	['B', 'E'],
// ]

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
