import { describe, expect, it } from 'vitest';
import isServerVersionSupported from './isServerVersionSupported';

describe('isServerVersionSupported', () => {
    it.each([
        ['12.0.0-20260912000255', true],
        ['12.0.0', true],
        ['10.11.11-20260911235200', true],
        ['10.10.0', true],
        ['10.9.0-20260911235200', false],
        ['12.0.0-rc1', false],
        ['12.not-a-version', false],
        ['', false],
        [undefined, false]
    ])('checks %s without rejecting a build timestamp', (version, expected) => {
        expect(isServerVersionSupported(version, '10.10.0')).toBe(expected);
    });
});
