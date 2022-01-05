// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { readFile } from 'fs';
import Mustache from 'mustache';
const hdf5 = require('jsfive');

function list(object: any) {
	const items = object.keys.map((name: string) => {
		const item = object.get(name);
		const isGroup = typeof item.keys !== 'function';
		return ({
			name,
			isGroup,
			path: item.name,
			attributes: item.attrs
		});
	});
	return items;
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
		let disposable = vscode.commands.registerCommand('vscode-hdf5-viewer.openCurrentFile', (fileUri) => {
			// The code you place here will be executed every time your command is executed

			if (typeof fileUri == 'undefined' || !(fileUri instanceof vscode.Uri)) {
				if (vscode.window.activeTextEditor === undefined) {
					return;
				}
				fileUri = vscode.window.activeTextEditor.document.uri;
			}

			const fileParts = fileUri.fsPath.split('/');
			const filename = fileParts[fileParts.length - 1];

			const panel = vscode.window.createWebviewPanel(
				'HDF5 viewer',
				`HDF5: ${filename}`,
				vscode.ViewColumn.One,
				{}
			);

			const localResources = vscode.Uri.file(path.join(context.extensionPath, 'dist/client'));

			panel.webview.options = {
				enableScripts: true,
				localResourceRoots: [localResources]
			};

			panel.webview.html = Mustache.render(index_html_template, {
				resourcePrefix: panel.webview.asWebviewUri(localResources).toString()
			});
			console.debug(`Using resourcePrefix: ${panel.webview.asWebviewUri(localResources).toString()}`)

			console.debug(`Loading file ${filename}...`);
			readFile(fileUri.fsPath, (err, data) => {
				if (err) {
					console.error(err);
				}
				const file = new hdf5.File(data.buffer);
				console.debug('loaded');
				panel.webview.onDidReceiveMessage(message => {
					const object = file.get(message.key);
					console.debug(`received ${message}`);
					switch (message.command) {
						case 'list':
							panel.webview.postMessage({
								command: 'list',
								data: list(object)
							});
							break;
					}
				});
			});

		});

		context.subscriptions.push(disposable);
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }
