
/**
 * Helper type that enables TypeScript to infer the return type of `cartesianProduct`.
 *
 * When the original input tuple `T` is something like `[string[], number[]]`,
 * it extracts just the element types and returns the tuple `[string, number]`.
 *
 * The return type changes depending on whether the received array is a tuple list or a regular array list.
 *
 * For example, the following is a regular array list (not a tuple list):
 *
 * const arrayList = [
 * 	['x', 'y'],
 * 	[1,2,3],
 * 	[ 'U', 'V' , 'W' ]
 * ];
 *
 * In this case, the return value looks like `['x',2,'W']`, and the type is `(string | number)[]`.
 *
 * Next, consider the following tuple list:
 *
 * const arrayList = [
 * 	['x', 'y'] as const,
 * 	[1,2,3] as const,
 * 	[ 'U', 'V' , 'W' ] as const
 * ] as const;
 *
 * Here, the return type becomes `['x' | 'y', 1 | 2 | 3, 'U' | 'V' | 'W'][]`.
 *
 * Additionally, if you skip `as const` and instead specify a tuple-list type annotation:
 * const arrayList: [string[], number[], ('U' | 'V' | 'W')[]] = [
 * 	['x', 'y'],
 * 	[1,2,3],
 * 	[ 'U', 'V' , 'W' ]
 * ];
 *
 * The return type becomes `(string | number | 'U' | 'V' | 'W')[][]`.
 * Each array is treated as variable-length, so their element types remain `string[]`, `number[]`, and `('U' | 'V' | 'W')[]`,
 * and combining them results in `(string | number | 'U' | 'V' | 'W')` for each element.
 *
 * In short, using `as const` for a list of tuples yields a type where each array contributes a literal union
 * (for example: `['x' | 'y', 1 | 2 | 3, 'U' | 'V' | 'W'][]`).
 * When you rely on a tuple-list type annotation, each array is considered variable-length and their element types merge
 * (for example: `(string | number | 'U' | 'V' | 'W')[][]`).
 * When nothing is specified, each array is treated as a normal array and the merged element type is used
 * (for example: `(string | number)[]`).
 *
 * @template T - Type of the original input array
 * @returns A tuple composed of the element types of each array
 */
type ElementTypes<T extends ReadonlyArray<ReadonlyArray<unknown>>> =
{
	// `-readonly`: ElementTypes 総体として入力が `readonly [...]` でも結果は通常の
	// 可変タプルとして扱えるよう readonly 修飾子を取り除く。
	// つまり `-readonly` は `[K in keyof T]` にかかっているのではなく、ElementTypes 全体にかかっている。
	// `[K in keyof T]`: 事実上 T の各インデックスのユニオン型、つまり `0 | 1 | 2 | ...` を表す。
	-readonly [K in keyof T]
	// `-?`: オプショナルな要素であっても実在するなら `?` を外し、値の存在が必ずある形に揃える。
	-?:
	T[K] extends ReadonlyArray<infer U>
	// `T[K]` が `ReadonlyArray<X>` の形であれば、`X` が `infer U` によって `U` として取り出され U 型となり。
	// そうでなければ `never` となる。`T extends ReadonlyArray<ReadonlyArray<unknown>>` なので `T[K]` が
	// 実際に配列以外になる事はないが infer U によって型を取り出すために Conditional Type を用いている以上
	// else 側の型も記述する必要がある。
		? U
		: never;
};

function isNumberArray( arr: unknown ): arr is ReadonlyArray<number>
{
	return Array.isArray( arr ) && arr.every( e => typeof e === 'number' );
}

/**
 * Generator that produces the cartesian product of the provided lists.
 * There is no restriction on the number of lists or the length of each list.
 * @param arrayList - The lists themselves
 * @param order - Enumeration order of the combinations; defaults to the natural order (0,1,2,...)
 */
export function *cartesianProduct<T extends ReadonlyArray<ReadonlyArray<unknown>>>( arrayList: T, order?: ReadonlyArray<number> ): Generator<ElementTypes<T>, void, unknown>
{
	if( ! order )
	{
		order = Array.from( { length: arrayList.length }, (_,i) => i );
	}

	if( ! isNumberArray(order) )
	{
		throw new Error( 'Invalid order array' );
	}

	if( order.length !== arrayList.length )
	{
		throw new Error( 'Invalid order array' );
	}

	const sizeList = arrayList.map( a => a.length );
	const orderedSizeList = order.map( i => sizeList[i] );
	
	for( const idxCombination of cartesianProductWithSizeList( orderedSizeList ) )
	{
		const resultCombination = new Array<ElementTypes<T>[number]>(arrayList.length) as ElementTypes<T>;

		idxCombination.forEach( ( no, index ) =>
		{
			const originalIndex = order[index]!;
			resultCombination[originalIndex] = arrayList[originalIndex][no] as ElementTypes<T>[number];
		});

		yield resultCombination;
	}
}

/**
 * Generator that enumerates all combinations from a list of element counts.
 * Each yielded value is a combination of indices for every array.
 * For example, when three arrays have 2, 3, and 4 elements respectively, the yielded values are:
 * ```
 * [0,0,0]
 * [1,0,0]
 * [0,1,0]
 * [1,1,0]
 * [0,2,0]
 * [1,2,0]
 * [0,0,1]
 * [1,0,1]
 * ...
 * [1,2,3]
 * ```
 * Conceptually, it counts from 0 up to total combinations - 1 in mixed radix (each digit has its own base)
 * and uses each digit as the index for the corresponding array.
 * @param sizeList - List of element counts for the arrays to iterate exhaustively
 * @returns Generator that yields index combinations for each array
 */
export function *cartesianProductWithSizeList( sizeList: ReadonlyArray<number> ): Generator<number[], void, unknown>
{
	const totalCombinationNum = sizeList.reduce( ( acc, cur )=>
	{
		return acc * cur;
	},1);

	for( let i = 0; i < totalCombinationNum; i++ )
	{
		const thisCombination: number[] = [];
		let remaining = i;
		for( const size of sizeList )
		{
			thisCombination.push( remaining % size );
			remaining = Math.floor( remaining / size );
		}
		
		yield thisCombination;
	}
}
