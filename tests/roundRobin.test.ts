import {describe, expect, test} from '@jest/globals';
import {roundRobin} from '../src/lib/RoundRobin';

describe('roundRobin', () =>
{
	// デフォルト順序で元配列の要素組み合わせが列挙されることを確認
	test('enumerates value combinations using the default order', () =>
	{
		const arrayList = [
			['A', 'B'],
			['C', 'D', 'E'],
		];

		const combinations = Array.from(roundRobin(arrayList));

		// 生成された組み合わせが期待どおりの値と順序で並ぶことを確認
		expect(combinations).toEqual([
			['A', 'C'],
			['B', 'C'],
			['A', 'D'],
			['B', 'D'],
			['A', 'E'],
			['B', 'E'],
		]);
	});

	// カスタム順序が指定されたときに列挙順のみが変わり、各要素は元の配列順で並ぶことを確認
	test('respects custom order while keeping output aligned to original list order', () =>
	{
		const arrayList = [
			['A', 'B'],
			['C', 'D', 'E'],
		];

		const combinations = Array.from(roundRobin(arrayList, [1, 0]));

		// 列挙の進み方はカスタム順序に合わせつつ、出力の並びは元配列順になることを確認
		expect(combinations).toEqual([
			['A', 'C'],
			['A', 'D'],
			['A', 'E'],
			['B', 'C'],
			['B', 'D'],
			['B', 'E'],
		]);
	});

	// リスト数が増えても総組み合わせを網羅できることを確認
	test('handles three lists and covers every combination', () =>
	{
		const arrayList = [
			['A', 'B'],
			['C', 'D'],
			['X', 'Y', 'Z'],
		];

		const combinations = Array.from(roundRobin(arrayList));

		// 組み合わせ総数が要素数の積 (2 * 2 * 3) と一致することを確認
		expect(combinations).toHaveLength(12);

		// 重複のない12通りが生成されることを確認
		const seen = new Set(combinations.map(combo => combo.join('-')));
		expect(seen.size).toBe(12);

		// 各要素が対応する配列の値を取っていることを確認
		combinations.forEach((combo) =>
		{
			// 3 つの配列なので結果も 3 要素であることを確認
			expect(combo).toHaveLength(3);
		// 先頭要素は arrayList[0] の値であることを確認
			expect(['A', 'B']).toContain(combo[0]);
			// 2 番目要素は arrayList[1] の値であることを確認
			expect(['C', 'D']).toContain(combo[1]);
			// 3 番目要素は arrayList[2] の値であることを確認
			expect(['X', 'Y', 'Z']).toContain(combo[2]);
		});
	});

	// order の長さが arrayList と一致しない場合にエラーが投げられることを確認
	test('throws when order length mismatches array list length', () =>
	{
		const arrayList = [
			['A', 'B'],
			['C', 'D', 'E'],
		];

		// 不正な order を渡した場合に例外が発生することを確認
		expect(() => Array.from(roundRobin(arrayList, [0]))).toThrow('Invalid order array');
	});
});
