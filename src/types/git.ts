export interface GitExtensionAPI {
    repositories: Repository[];
    getAPI(version: number): GitExtensionAPI;
}

export interface Repository {
    state: {
        HEAD?: {
            name?: string;
        };
        remotes: Remote[];
    };
}

export interface Remote {
    name: string;
    fetchUrl?: string;
}

export interface GitHubRepository {
    private: boolean;
    id: number;
    name: string;
    [key: string]: unknown; // Allow other properties from the API
}

/*
 * Copyright (c) 2025 Shrey Purohit.
 * This code is licensed under the MIT License.
 */