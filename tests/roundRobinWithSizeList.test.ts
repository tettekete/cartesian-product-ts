import {describe, expect, test} from '@jest/globals';
import {roundRobinWithSizeList} from '../src/lib/RoundRobin';

describe('roundRobinWithSizeList', () =>
{
	test('enumerates every index combination for [2, 3]', () =>
	{
		const combinations = Array.from(roundRobinWithSizeList([2, 3]));

		expect(combinations).toEqual([
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1],
			[0, 2],
			[1, 2],
		]);
	});

		test('produces unique combinations within bounds', () =>
		{
			const sizeList = [1, 3, 2];
			const combinations = Array.from(roundRobinWithSizeList(sizeList));

			// 全組み合わせ数がサイズリストの積と一致することを確認
			expect(combinations).toHaveLength(1 * 3 * 2);

			// 各組み合わせが重複していないことを確認
			const seen = new Set(combinations.map(combo => combo.join(',')));
			expect(seen.size).toBe(combinations.length);

			combinations.forEach((combo) =>
			{
				// 各組み合わせが sizeList の要素数と同じ長さであることを確認
				expect(combo).toHaveLength(sizeList.length);
				combo.forEach((value, index) =>
				{
					// インデックスが 0 以上であることを確認
					expect(value).toBeGreaterThanOrEqual(0);
					// インデックスが各サイズの上限未満であることを確認
					expect(value).toBeLessThan(sizeList[index]);
				});
			});
		});
});
