import fs from 'fs';

import { MessageDistributor, to64Int, ServiceEnCodeMessage } from '@stbui/sessionreplay-core';

export class ReceiveBuffer {
    private ignoreMessage = [
        // 'metadata',
        // 'IssueEvent',
        // 'SessionStart',
        // 'SessionEnd',
        // 'user_id',
        // 'user_anonymous_id',
        // 'ClickEvent',
        // 'IntegrationEvent',
        // 'PerformanceTrackAggr',
        // 'JSException',
        // 'ResourceTiming',
        // 'RawCustomEvent',
        // 'CustomIssue',
        // 'Fetch',
        // 'GraphQL',
        // 'StateAction',
        // 'SetInputTarget',
        // 'SetInputValue',
        // 'create_document',
        // 'MouseClick',
        // 'set_page_location',
        // 'page_load_timing',
        // 'page_render_timing',

        'batch_metadata',
        'user_id',
        'resource_timing',
        'page_load_timing',
        'page_render_timing',
    ];

    projectId: string;
    sessionId: number;

    private storePath: string;

    constructor(protected config) {}

    private encode(msg) {
        try {
            const data = ServiceEnCodeMessage(msg);

            const i = to64Int(0);
            const r = Buffer.concat([i, data]);

            // console.log('写入数据到文件', this.storePath);
            fs.appendFileSync(this.storePath, r, { encoding: 'binary' });
        } catch (e) {
            console.log(msg);
            console.log(e);
        }
    }

    private messageEncoder(data: any[], callbackMessage) {
        data.forEach(msg => {
            // 文件开头，包含了时间
            if ('batch_metadata'.includes(msg.tp)) {
                this.encode({ tp: 'timestamp', timestamp: msg.timestamp });
                return;
            }

            // 不需要
            if (this.ignoreMessage.includes(msg.tp)) {
                // 更新到数据库
                callbackMessage && callbackMessage(msg);
                return;
            }

            // if (msg.tp === 'set_css_data_url_based') {
            //     // msg.baseURL = null;
            // }

            // if (msg.tp === 'set_node_attribute_url_based') {
            //     if (msg.name === 'src' || msg.name === 'href') {
            //         // const u = msg.baseURL;
            //         // const v = msg.value;
            //         // const _url = URL.parse(u);
            //         // msg.baseURL = null;
            //     } else if (msg.name === 'style') {
            //         // const u = msg.baseURL;
            //         // const v = msg.value;
            //         // msg.baseURL = null;
            //         // const _url = URL.parse(u);
            //     }
            // }

            this.encode(msg);
        });
    }

    insert(
        buf: Buffer,
        { projectId, sessionId, onMessage }: { projectId: string; sessionId: string; onMessage: Function }
    ) {
        this.storePath = `${this.config.storePath}/${projectId}/sessions/${sessionId}/dom.mobs.json`;

        const messageDistributor = new MessageDistributor();
        let msg = messageDistributor.readAndDistributeMessages(buf);

        fs.writeFileSync('test.json', JSON.stringify(msg, null, 2));
        this.messageEncoder(msg, onMessage);
    }

    start(projectId, sessionId) {
        this.projectId = projectId;
        this.sessionId = sessionId;
        this.storePath = `${this.config.storePath}/${projectId}/sessions/${sessionId}/dom.mobs.json`;
        const dir = `${this.config.storePath}/${projectId}/sessions/${sessionId}`;

        // if (fs.existsSync(this.storePath)) {
        //     // 是否要删除之前的数据文件
        //     console.log('删除之前的数据文件', this.storePath);
        //     fs.rmSync(this.storePath);
        // }

        try {
            console.log('创建数据存储目录', dir);
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            console.log('创建数据存储目录', dir);
            console.log('创建数据存储目录', e);
        }
    }
}
