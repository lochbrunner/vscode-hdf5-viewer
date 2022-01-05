
import * as vscode from 'vscode';
import { readFile } from 'fs';
import * as path from 'path';
import Mustache from 'mustache';

declare class Hdf5File {
    constructor(filename: string);
    get(key: string): any;
}

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

export class Hdf5Document implements vscode.CustomDocument {
    static async create(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<Hdf5Document | PromiseLike<Hdf5Document>> {
        return new Promise((resolve, reject) => {
            console.debug(`Loading file ${uri.fsPath}...`);
            readFile(uri.fsPath, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                const file = new hdf5.File(data.buffer) as Hdf5File;
                resolve(new Hdf5Document(uri, file));
            });
        });
    }

    private readonly uri_: vscode.Uri;
    private readonly file_: Hdf5File;

    private constructor(
        uri: vscode.Uri,
        file: Hdf5File,
    ) {
        this.uri_ = uri;
        this.file_ = file;
    }
    public get uri(): vscode.Uri { return this.uri_; }
    public get file(): Hdf5File { return this.file_; }
    dispose(): void { }
}


export class Hdf5ContentProvider implements vscode.CustomReadonlyEditorProvider<Hdf5Document>  {

    private readonly html_template_: string;
    private readonly local_resources_: vscode.Uri;

    public constructor(html_template: string, context: vscode.ExtensionContext) {
        this.html_template_ = html_template;
        this.local_resources_ = vscode.Uri.file(path.join(context.extensionPath, 'dist/client'));
    }

    public async openCustomDocument(uri: vscode.Uri, openContext: any, token: any): Promise<Hdf5Document> {
        return await Hdf5Document.create(uri, openContext);
    }

    public async resolveCustomEditor(
        document: Hdf5Document,
        webviewPanel: vscode.WebviewPanel,
        _token?: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.onDidReceiveMessage(message => {
            const object = document.file.get(message.key);
            console.debug(`received ${message}`);
            switch (message.command) {
                case 'list':
                    webviewPanel.webview.postMessage({
                        command: 'list',
                        data: list(object)
                    });
                    break;
            }
        });

        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.local_resources_]
        };

        webviewPanel.webview.html = Mustache.render(this.html_template_, {
            resourcePrefix: webviewPanel.webview.asWebviewUri(this.local_resources_).toString()
        });
    }
}