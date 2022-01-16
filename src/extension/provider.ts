
import * as vscode from 'vscode';
// import { readFile } from 'fs';
import * as path from 'path';
import Mustache from 'mustache';
const highfive = require('../../build/Release/highfive.node')

declare class Hdf5Handler {
    constructor(filename: string);
    list(key: string): any;
}


export class Hdf5Document implements vscode.CustomDocument {
    static async create(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<Hdf5Document | PromiseLike<Hdf5Document>> {
        return new Promise((resolve, reject) => {
            console.debug(`Loading file ${uri.fsPath}...`);
            const handler = new highfive.HighFiveHandler(uri.fsPath);

            resolve(new Hdf5Document(uri, handler));
        });
    }

    private readonly uri_: vscode.Uri;
    private readonly handler_: Hdf5Handler;

    private constructor(
        uri: vscode.Uri,
        handler: Hdf5Handler,
    ) {
        this.uri_ = uri;
        this.handler_ = handler;
    }
    public get uri(): vscode.Uri { return this.uri_; }
    public get handler(): Hdf5Handler { return this.handler_; }
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
            console.debug(`received ${message}`);
            switch (message.command) {
                case 'list':
                    const response = document.handler.list(message.key);
                    webviewPanel.webview.postMessage({
                        command: 'list',
                        data: response
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