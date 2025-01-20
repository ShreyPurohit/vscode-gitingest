import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vscode-gitingest.openInGitIngest', async () => {
		try {
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			if (!workspaceFolder) {
				throw new Error('No workspace folder found');
			}

			const { stdout: remoteUrl } = await execAsync('git remote get-url origin', {
				cwd: workspaceFolder.uri.fsPath
			});

			const { stdout: branchName } = await execAsync('git rev-parse --abbrev-ref HEAD', {
				cwd: workspaceFolder.uri.fsPath
			});

			const match = remoteUrl.trim().match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/);
			if (!match) {
				throw new Error('Not a valid GitHub repository');
			}

			const [, username, repository] = match;
			const currentBranch = branchName.trim();

			const gitIngestUrl = `https://gitingest.com/${username}/${repository}/tree/${currentBranch}`;

			vscode.env.openExternal(vscode.Uri.parse(gitIngestUrl));

			vscode.window.showInformationMessage(`Opening repository (${currentBranch} branch) in GitIngest`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Failed to open in GitIngest: ${error.message}`);
		}
	});

	context.subscriptions.push(disposable);
}