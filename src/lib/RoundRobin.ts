
function isNumberArray( arr: any ): arr is number[]
{
	return Array.isArray( arr ) && arr.every( e => typeof e === 'number' );
}

/**
 * 与えられたリストのリストについて、それらの総組み合わせを生成するジェネレータです。
 * リストの数、および各リストの要素数に制約はありません。
 * @param arrayList - 各配列の要素数のリスト
 * @param order - 組み合わせの列挙順序。省略時はデフォルトの順序（0,1,2,...）
 */
export function *roundRobin( arrayList: any[][],order?: number[] ): Generator<any[], void, unknown>
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
		throw new Error( 'order array length should match array list length.' );
	}

	const sizeList: number[]		= arrayList.map( a => a.length );
	const orderedSizeList: number[]	= order.map( i => sizeList[i] );
	
	for( const idxCombination of roundRobinWithSizeList( orderedSizeList ) )
	{
		const resultCombination = Array.from( { length: sizeList.length }, () => 0 );
		
		idxCombination.map( ( no , index ) =>
		{
			const originalIndex = order[index];
			resultCombination[originalIndex] = arrayList[originalIndex][no];
		})

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
export function *roundRobinWithSizeList( sizeList: number[] ): Generator<number[], void, unknown>
{
	const totalCombinationNum = sizeList.reduce( ( acc, cur )=>
	{
		return acc * cur;
	},1);

	const result: number[][] = [];
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
