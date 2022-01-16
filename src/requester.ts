declare function acquireVsCodeApi(): { postMessage: (msg: any) => void };


/**
 * Either uses vscode API or http REST to request the data.
 */
export function create_requester() {
    try {
        const vscode = acquireVsCodeApi();
        vscode.postMessage({
            command: 'ready',
        });

        const responses = new EventTarget()

        const updateScenario = (event: MessageEvent) => {
            const message = event.data;
            responses.dispatchEvent(new CustomEvent(message.command, { detail: message.data }));
        };
        // initiate the event handler
        window.addEventListener('message', updateScenario)

        // function request
        return (what: string, payload: any, callback: (data: any) => void) => {
            responses.addEventListener(what, (e: any) => callback(e.detail), { once: true })
            vscode.postMessage({
                command: what,
                ...payload
            });
        };
    }
    catch (e) {
        if (e instanceof ReferenceError) {
            // It's just fine we run not in as a vscode extension.
            // Using REST
            return (what: string, payload: any, callback: (data: any) => void) => {
                fetch('/api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: what, ...payload })
                }).then(response => response.json())
                    .then(callback).catch(console.error)
            }
        }
        else {
            throw e;
        }
    }
}

export interface BaseItem {
    name: string;
    path: string;
    attributes: { [name: string]: string };
}

export interface DatasetItem extends BaseItem {
    type: 'dataset';
    dimensions: number[];
}

export interface GroupItem extends BaseItem {
    type: 'group';
}

export interface UnknownItem extends BaseItem {
    type: 'unknown';
}

export type Item = DatasetItem | GroupItem | UnknownItem;

export class Client {
    requester: any;
    constructor() {
        this.requester = create_requester()
    }

    list(key: string): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            this.requester('list', { key }, resolve)
        });
    }

    attributes(key: string): Promise<{ [name: string]: string }> {
        return new Promise((resolve, reject) => {
            this.requester('attributes', { key }, resolve)
        });
    }
}
