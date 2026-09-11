import { describe, expect, it, vi } from 'vitest';
import saveStartupUser from './saveStartupUser';

function createClient() {
    return {
        getUrl: vi.fn(() => '/Startup/User'),
        ajax: vi.fn().mockResolvedValue(undefined),
        authenticateUserByName: vi.fn().mockResolvedValue({ AccessToken: 'test-token' })
    };
}

describe('saveStartupUser', () => {
    it('saves the initial user without an additional login', async () => {
        const client = createClient();
        // Synthetic credentials for the mocked client; never sent to a server.
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        const password = 'test-password';
        await expect(saveStartupUser(client, 'admin', 'test-password')).resolves.toBeUndefined();
        expect(client.ajax).toHaveBeenCalledWith({
            type: 'POST',
            url: '/Startup/User',
            contentType: 'application/json',
            data: JSON.stringify({ Name: 'admin', Password: password })
        });
        expect(client.authenticateUserByName).not.toHaveBeenCalled();
    });

    it('authenticates existing credentials after interrupted setup without returning tokens', async () => {
        const client = createClient();
        client.ajax.mockRejectedValue({ status: 403 });
        await expect(saveStartupUser(client, 'admin', 'test-password')).resolves.toBeUndefined();
        expect(client.authenticateUserByName).toHaveBeenCalledWith('admin', 'test-password');
        expect(client.ajax).toHaveBeenCalledTimes(1);
    });

    it('does not continue when the existing password is incorrect', async () => {
        const client = createClient();
        const failure = { status: 401 };
        client.ajax.mockRejectedValue({ status: 403 });
        client.authenticateUserByName.mockRejectedValue(failure);
        await expect(saveStartupUser(client, 'admin', 'incorrect')).rejects.toBe(failure);
        expect(client.ajax).toHaveBeenCalledTimes(1);
    });

    it.each([400, 401, 500, undefined])('preserves other failures (%s)', async (status) => {
        const client = createClient();
        const failure = { status };
        client.ajax.mockRejectedValue(failure);
        await expect(saveStartupUser(client, 'admin', 'test-password')).rejects.toBe(failure);
        expect(client.authenticateUserByName).not.toHaveBeenCalled();
    });
});
