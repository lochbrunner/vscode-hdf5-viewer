// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { readFile } from 'fs';
import { Hdf5ContentProvider } from './provider';



async function createPanel(filename: vscode.Uri, index_html_template: string, context: vscode.ExtensionContext) {
	const file_parts = filename.fsPath.split('/');
	const filename_short = file_parts[file_parts.length - 1];

	const panel = vscode.window.createWebviewPanel(
		'HDF5 viewer',
		`HDF5: ${filename_short}`,
		vscode.ViewColumn.One,
		{}
	);
	const provider = new Hdf5ContentProvider(index_html_template, context);
	const document = await provider.openCustomDocument(filename, null, null);

	provider.resolveCustomEditor(document, panel);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const index_filename = path.join(context.extensionPath, 'dist/client/index.html');

	readFile(index_filename, 'utf8', (err, index_html_template) => {
		if (err) {
			vscode.window.showErrorMessage(`Could open template "${index_filename}": ${err}`);
		}
		console.debug('Loaded template!')


		// The command has been defined in the package.json file
		// Now provide the implementation of the command with registerCommand
		// The commandId parameter must match the command field in package.json
		const command_disposable = vscode.commands.registerCommand('vscode-hdf5-viewer.openCurrentFile', (fileUri) => {
			// The code you place here will be executed every time your command is executed

			if (typeof fileUri == 'undefined' || !(fileUri instanceof vscode.Uri)) {
				if (vscode.window.activeTextEditor === undefined) {
					return;
				}
				fileUri = vscode.window.activeTextEditor.document.uri;
			}

			createPanel(fileUri, index_html_template, context);
		});

		context.subscriptions.push(command_disposable);

		// content provider
		const provider = new Hdf5ContentProvider(index_html_template, context);
		const disposable_provider = vscode.window.registerCustomEditorProvider('vscode-hdf5-viewer.preview', provider, {})
		context.subscriptions.push(disposable_provider);
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }
