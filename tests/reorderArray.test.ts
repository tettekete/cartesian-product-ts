import {describe, expect, test} from '@jest/globals';
import {reorderArray , restoreOrderArray } from '../src/lib/cartesianProduct';

describe('reorderArray', () => {
    test('reorders array based on given order', () => {
        const input = [1, 2, 3, 4];
        const order = [2, 0, 3, 1];
        const expected = [3, 1, 4, 2];
        const result = reorderArray(input, order);
        expect(result).toEqual(expected);
    });

    test('handles empty array', () => {
        const input: number[] = [];
        const order: number[] = [];
        const expected: number[] = [];
        const result = reorderArray(input, order);
        expect(result).toEqual(expected);
    });

    test('handles single element array', () => {
        const input = [42];
        const order = [0];
        const expected = [42];
        const result = reorderArray(input, order);
        expect(result).toEqual(expected);
    });
});

describe('restoreOrderArray', () => {
	test('restores array to original order based on given order', () => {
		const input = ['a', 'b', 'c', 'd'];
		const order = [2, 0, 3, 1];
		const expected = ['b', 'd', 'a', 'c'];
		const result = restoreOrderArray(input, order);
		expect(result).toEqual(expected);
	});

	test('handles empty array', () => {
		const input: string[] = [];
		const order: number[] = [];
		const expected: string[] = [];
		const result = restoreOrderArray(input, order);
		expect(result).toEqual(expected);
	});

	test('handles single element array', () => {
		const input = ['single'];
		const order = [0];
		const expected = ['single'];
		const result = restoreOrderArray(input, order);
		expect(result).toEqual(expected);
	});
});
