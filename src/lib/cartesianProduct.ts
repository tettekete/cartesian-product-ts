
function _normalizeOrderArray( order: number[], length: number ): number[]
{
	const orderSet = new Set(order);
	if( length > orderSet.size )
	{
		order.forEach( (_,i) =>
			{
				orderSet.add(i);
			}
		);
	}
	else if( length !== order.length )
	{
		throw new Error( 'Invalid order array' );
	}

	return Array.from(orderSet);
}

export function reorderArray<T>( arr: T[], order: number[] ): T[]
{	
	const result: T[] = new Array( arr.length );

	order.forEach( ( fromIdx ,destIdx ) =>
	{
		result[destIdx] = arr[fromIdx]!;
	});

	return result;
}

export function restoreOrderArray<T>( arr: T[], order: number[] ): T[]
{
	const result: T[] = new Array( arr.length );

	order.forEach( ( destIdx ,fromIdx ) =>
	{
		result[destIdx] = arr[fromIdx]!;
	});

	return result;
}

export function *cartesianProduct( arrayList: unknown[][], order?: number[] ): Generator<unknown[], void, unknown>
{
	if( ! order )
	{
		order = Array.from( { length: arrayList.length }, (_,i) => i );
	}

	const normalizedOrder = _normalizeOrderArray( order, arrayList.length );

	// normalizedOrder.reverse();

	const reorderedArrayList = reorderArray( arrayList, normalizedOrder );

	function *buildOneCombination( combinationBuf: unknown[], depth: number ): Generator<unknown[], void, unknown>
	{
		const currList = reorderedArrayList[ depth ];
		for( let i = 0; i < currList.length; i++ )
		{
			const copyBuf = Array.from( combinationBuf );
			copyBuf.push( currList[i] );
			if( depth === reorderedArrayList.length - 1 )
			{
				const restored = restoreOrderArray( copyBuf, normalizedOrder );
				yield restored;
			}
			else
			{
				yield *buildOneCombination( copyBuf, depth + 1 );
			}
		}
	}

	yield *buildOneCombination( [], 0 );
}
