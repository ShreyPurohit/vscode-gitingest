export class GitIngestService {
    private static readonly BASE_URL = 'https://gitingest.com';

    static constructUrl(username: string, repository: string, branch: string): string {
        return `${this.BASE_URL}/${username}/${repository}/tree/${branch}`;
    }
}

/*
 * Copyright (c) 2025 Shrey Purohit.
 * This code is licensed under the MIT License.
 */