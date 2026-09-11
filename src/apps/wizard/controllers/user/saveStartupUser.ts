import type { ApiClient } from 'jellyfin-apiclient';

/** Resume interrupted setup by authenticating when the initial password already exists. */
export default async function saveStartupUser(
    apiClient: Pick<ApiClient, 'ajax' | 'getUrl' | 'authenticateUserByName'>,
    name: string,
    password: string
): Promise<void> {
    try {
        await apiClient.ajax({
            type: 'POST',
            data: JSON.stringify({ Name: name, Password: password }),
            url: apiClient.getUrl('Startup/User'),
            contentType: 'application/json'
        });
    } catch (error) {
        if ((error as { status?: number } | null)?.status !== 403) {
            throw error;
        }

        // The server deliberately refuses to overwrite an existing password.
        // Only valid existing credentials allow the wizard to continue.
        await apiClient.authenticateUserByName(name, password);
    }
}
