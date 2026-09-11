import { compareVersions } from '@jellyfin/sdk/lib/utils/versioning';

/** Compare the release version while retaining our build timestamp for display. */
export default function isServerVersionSupported(serverVersion: string | undefined, minimumVersion: string): boolean {
    const version = serverVersion?.match(/^(\d+(?:\.\d+)*)(?:-\d{14})?$/)?.[1];
    return !!version && compareVersions(minimumVersion, version) <= 0;
}
