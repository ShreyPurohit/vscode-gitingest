export class GitUrlParser {
    private static readonly SSH_PATTERN = /^git@github\.com:/;
    private static readonly GIT_SUFFIX = /\.git$/;

    static normalizeGitUrl(url: string): string {
        return url
            .replace(this.SSH_PATTERN, 'https://github.com/')
            .replace(this.GIT_SUFFIX, '');
    }

    static parseRepositoryInfo(url: string): { username: string; repository: string } {
        const parsedUrl = new URL(this.normalizeGitUrl(url));
        const [, username, repository] = parsedUrl.pathname.split('/');

        if (!username || !repository) {
            throw new Error('Invalid repository URL format');
        }

        return { username, repository };
    }
}

/*
 * Copyright (c) 2025 Shrey Purohit.
 * This code is licensed under the MIT License.
 */