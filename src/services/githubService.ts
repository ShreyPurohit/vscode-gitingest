import { GitHubRepository } from '../types/git';

export class GitHubService {
    private static readonly API_BASE_URL = 'https://api.github.com';

    static async isPublicRepository(owner: string, repo: string): Promise<boolean> {
        try {
            const response = await fetch(
                `${this.API_BASE_URL}/repos/${owner}/${repo}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'VSCode-GitIngest-Extension'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    return false;
                }
                throw new Error(`GitHub API error: ${response.statusText}`);
            }

            const data = await response.json() as GitHubRepository;
            return !data.private;
        } catch (error) {
            throw new Error('Failed to check repository visibility');
        }
    }
}

/*
 * Copyright (c) 2025 Shrey Purohit.
 * This code is licensed under the MIT License.
 */