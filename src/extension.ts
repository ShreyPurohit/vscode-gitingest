import * as vscode from 'vscode';
import { GitService } from './services/gitService';
import { GitIngestService } from './services/gitIngestService';
import { GitUrlParser } from './utils/url';
import { GitHubService } from './services/githubService';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const disposable = vscode.commands.registerCommand(
		'vscode-gitingest.openInGitIngest',
		handleOpenInGitIngest
	);

	context.subscriptions.push(disposable);
}

async function handleOpenInGitIngest(): Promise<void> {
	try {
		const repository = await GitService.getCurrentRepository();
		const remoteUrl = await GitService.getOriginUrl(repository);
		const branch = GitService.getCurrentBranch(repository);

		const { username, repository: repoName } = GitUrlParser.parseRepositoryInfo(remoteUrl);

		// Check if repository is public
		const isPublic = await GitHubService.isPublicRepository(username, repoName);

		if (!isPublic) {
			throw new Error('GitIngest does not support private repositories');
		}

		const gitIngestUrl = GitIngestService.constructUrl(username, repoName, branch);
		await vscode.env.openExternal(vscode.Uri.parse(gitIngestUrl));

		vscode.window.showInformationMessage(
			`Opening repository (${branch} branch) in GitIngest`
		);
	} catch (error) {
		vscode.window.showErrorMessage(
			`Failed to open in GitIngest: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/*
 * Copyright (c) 2025 Shrey Purohit.
 * This code is licensed under the MIT License.
 */