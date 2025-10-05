import {roundRobin} from '../src/lib/RoundRobin';

const arrayList = [
	['x', 'y'],
	[1,2,3],
	[ 'U', 'V' , 'W' ]
];

for( const combination of roundRobin( arrayList , [2,1,0] ) )
{
	console.log( combination );
}

/*
[ 'x', 1, 'U' ]
[ 'x', 1, 'V' ]
[ 'x', 1, 'W' ]
[ 'x', 2, 'U' ]
[ 'x', 2, 'V' ]
[ 'x', 2, 'W' ]
[ 'x', 3, 'U' ]
[ 'x', 3, 'V' ]
[ 'x', 3, 'W' ]
[ 'y', 1, 'U' ]
[ 'y', 1, 'V' ]
[ 'y', 1, 'W' ]
[ 'y', 2, 'U' ]
[ 'y', 2, 'V' ]
[ 'y', 2, 'W' ]
[ 'y', 3, 'U' ]
[ 'y', 3, 'V' ]
[ 'y', 3, 'W' ]
*/
