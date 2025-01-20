import * as vscode from 'vscode';
import { GitExtensionAPI, Repository } from '../types/git';

export class GitService {
    private static readonly GIT_EXTENSION_ID = 'vscode.git';

    static async getGitExtensionAPI(): Promise<GitExtensionAPI> {
        const extension = vscode.extensions.getExtension(this.GIT_EXTENSION_ID);
        if (!extension) {
            throw new Error('Git extension not found');
        }

        return extension.exports.getAPI(1);
    }

    static async getCurrentRepository(): Promise<Repository> {
        const api = await this.getGitExtensionAPI();
        const repository = api.repositories[0];

        if (!repository) {
            throw new Error('No Git repository found');
        }

        return repository;
    }

    static async getOriginUrl(repository: Repository): Promise<string> {
        const remoteUrl = repository.state.remotes.find(remote =>
            remote.name === 'origin'
        )?.fetchUrl;

        if (!remoteUrl) {
            throw new Error('No origin remote found');
        }

        return remoteUrl;
    }

    static getCurrentBranch(repository: Repository): string {
        const branch = repository.state.HEAD?.name;
        if (!branch) {
            throw new Error('No active branch found');
        }

        return branch;
    }
}

/*
 * Copyright (c) 2025 Shrey Purohit.
 * This code is licensed under the MIT License.
 */