
/**
 * `cartesianProduct` の戻り値を正しく推論させるための補助型。
 *
 * 元の入力配列 `T` が `[string[], number[]]` のようなタプルであるとき、
 * 対応する要素型だけを取り出して `[string, number]` というタプルを返す。
 *
 * 受け取った配列がタプルリストのケースとそうでないケースで返り値の型が異なる。
 *
 * 例えば、以下のような通常の配列リスト≠タプルリスト:
 *
 * const arrayList = [
 * 	['x', 'y'],
 * 	[1,2,3],
 * 	[ 'U', 'V' , 'W' ]
 * ];
 * 
 * の場合、返り値は `['x',2,'W']` の様になり、型としては `(string | number)[]` となる。
 *
 * 次に、以下の様なタプルリスト:
 * 
 * const arrayList = [
 * 	['x', 'y'] as const,
 * 	[1,2,3] as const,
 * 	[ 'U', 'V' , 'W' ] as const
 * ] as const;
 * 
 * の場合、返り値は `['x' | 'y', 1 | 2 | 3, 'U' | 'V' | 'W'][]` となる。
 *
 * さらに、`as const` を付けずに以下のように型注釈でタプルリストを指定した場合:
 * const arrayList: [string[], number[], ('U' | 'V' | 'W')[]] = [
 * 	['x', 'y'],
 * 	[1,2,3],
 * 	[ 'U', 'V' , 'W' ]
 * ];
 * 
 * の場合、返り値は `(string | number | 'U' | 'V' | 'W')[][]` となる。
 * これは、各配列が可変長であるため、各要素の型がそれぞれ `string[]`, `number[]`, `('U' | 'V' | 'W')[]` として扱われ、
 * それらの要素型を合成した `(string | number | 'U' | 'V' | 'W')` が各要素の型として推論されるため。
 *
 * まとめると、`as const` を使ったタプルのリストは、各配列の要素をリテラルユニオン型とした型
 * （例: `['x' | 'y', 1 | 2 | 3, 'U' | 'V' | 'W'][]` ）が得られる。
 * 型注釈でタプルリストを指定した場合は、各配列が可変長として扱われ、要素型が合成されたより一般的な型
 * （例: `(string | number | 'U' | 'V' | 'W')[][]` ）が得られる
 * 何も指定しない場合は、各配列が通常の配列として扱われ、要素型が合成された型
 * （例:`(string | number)[]`）が得られる。
 *
 * @template T - 元の入力配列の型
 * @returns 各配列の要素型を取り出したタプル型
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
 * 与えられたリスト群のデカルト積を生成するジェネレータ。
 * リストの数、および各リストの要素数に制約はありません。
 * @param arrayList - 各リストそのもの
 * @param order - 組み合わせの列挙順序。省略時はデフォルトの順序（0,1,2,...）
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
 * 組み合わせの総当たりを各配列の要素数のリストから生成するジェネレータ。
 * 返り値は各配列のインデックスの組み合わせとなる。
 * 例えば、3つの配列の要素数がそれぞれ2,3,4の場合、返り値は以下のようになる。
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
 * ロジックとしては混合基数（桁毎に異なる基数（進数））の数を0から総組み合わせ数-1までカウントアップし、
 * 各桁の値を各配列のインデックスとして利用するイメージ。
 * @param sizeList - 総当たりする各配列の要素数のリスト
 * @returns 各配列のインデックスの組み合わせを生成するジェネレータ
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
