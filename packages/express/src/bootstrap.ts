import { readFileSync, createWriteStream } from 'fs';
import path from 'path';

import { Database } from './database';
import { SessionControl, SessionsService } from './sessions';
import { ProjectsControl, ProjectsService } from './projects';
import { RescorcesServices, RescorcesControl } from './resources';
import { AccountControl } from './account';
import { Config } from './config';
import { ReceiveBuffer } from './ReceiveBuffer';
import { UserAgent } from './UserAgent';
import { getUUID } from './utils';

export function bootstrap(app, { prefix = '' }) {
    const config = new Config();
    config.storePath = './data';

    const database = new Database(config);
    const db = database.init();

    const rescorcesServices = new RescorcesServices(db);
    const rescorcesControl = new RescorcesControl(rescorcesServices);

    const sessionsService = new SessionsService(db);
    const sessionControl = new SessionControl(sessionsService, rescorcesServices);

    const projectsService = new ProjectsService(db);
    const projectsControl = new ProjectsControl(projectsService);

    const accountControl = new AccountControl();
    const receiveBuffer = new ReceiveBuffer(config);

    // =============================================================
    app.get(
        [prefix + '/:projectId/sessions/:sessionId', prefix + '/:projectId/sessions2/:sessionId'],
        async (req, res) => {
            const port = ':8888';
            const url = `${req.protocol}://${req.hostname}${port}${prefix}`;
            console.log([], url);
            const json = await sessionControl.getSessionById(req.params.sessionId, url);
            res.send(json);
        }
    );

    app.get(prefix + '/:projectId/sessions/:sessionId/notes', (req, res) => {
        res.send({ data: [] });
    });

    app.get(
        [prefix + '/:projectId/sessions/:sessionId/dom.mobs', prefix + '/:projectId/sessions2/:sessionId/dom.mobs'],
        (req, res) => {
            const path = `${config.storePath}/${req.params.projectId}/sessions/${req.params.sessionId}/dom.mobs.json`;
            console.log('[replay]: 读取数据文件', path);

            const buff = readFileSync(path);
            res.send(buff);
        }
    );

    // app.get('/:projectId/sessions/:sessionId/devtools.mob', (req, res) => {
    // const path = `./src/api/${req.params.projectId}/sessions/${req.params.sessionId}/dom.mobs.json`;
    // const buff = readFileSync(path);
    // res.send(buff);
    // });

    app.get(prefix + '/account', (req, res) => {
        res.send(accountControl);
    });
    app.get(prefix + '/projects', (req, res) => {
        res.send(projectsControl.query());
    });
    app.get(prefix + '/integrations/slack/channels', (req, res) => {
        res.send({ data: [] });
    });
    app.get(prefix + '/integrations/issues', (req, res) => {
        res.send({ data: [] });
    });
    app.get(prefix + '/client/members', (req, res) => {
        res.send({
            data: [
                {
                    userId: 4339,
                    email: 'stbui',
                    role: 'owner',
                    name: 'demo',
                    createdAt: 1642510038638,
                    superAdmin: true,
                    admin: false,
                    member: false,
                    expiredInvitation: true,
                    joined: true,
                    invitationToken: null,
                    roleId: 9775,
                    roleName: 'Owner',
                    invitationLink: null,
                },
            ],
        });
    });

    app.get(prefix + '/boarding', (req, res) => {
        res.send({
            data: [
                {
                    task: 'Install OpenReplay',
                    done: true,
                    URL: 'https://docs.openreplay.com/getting-started/quick-start',
                },
                {
                    task: 'Identify Users',
                    done: false,
                    URL: 'https://docs.openreplay.com/data-privacy-security/metadata',
                },
                { task: 'Invite Team Members', done: false, URL: 'https://app.openreplay.com/client/manage-users' },
                { task: 'Integrations', done: false, URL: 'https://docs.openreplay.com/integrations' },
            ],
        });
    });

    app.get(prefix + '/limits', (req, res) => {
        res.send({ data: { teamMember: -1, projects: -1 } });
    });
    app.get(prefix + '/notifications/count', (req, res) => {
        res.send({ data: [] });
    });
    app.get(prefix + '/notifications', (req, res) => {
        res.send({ data: [] });
    });
    app.get(prefix + '/:projectId/saved_search', (req, res) => {
        res.send({ data: [] });
    });

    app.get(prefix + '/:projectId/metadata', (req, res) => {
        res.send({ data: [] });
    });
    app.post([prefix + '/:projectId/sessions/search', prefix + '/:projectId/sessions/search2'], async (req, res) => {
        const sessions = await sessionControl.searchSessions(req.params.projectId, 1);

        res.send({
            data: {
                total: 10000,
                sessions: sessions,
            },
        });
    });
    // =============================================================

    // =============================================================

    app.post(prefix + '/v1/web/start', (req, res) => {
        let tokenData: any = {};
        const userUUID = getUUID(req.body.userUUID);
        const reset = req.body.reset;
        // 当前时间
        const timestamp = req.body.timestamp;

        const p = projectsControl.findOne(req.body.projectKey);
        const projectID = p.projectId;

        // 如果token不存在 或者 是reset
        if (!req.body.token || reset) {
            const now = new Date().getTime();
            // 生成id, 时间戳+64数据
            const sessionId = now;
            tokenData = {
                id: sessionId,
                // 客户端与服务端时间延迟
                delay: now - timestamp,
                // MaxSessionDuration
                expTime: new Date().getTime() * 100000,
            };

            const ua = req.headers['user-agent'];
            const uu = new UserAgent();
            const userAgent = uu.parse(ua);

            const sessionStart = {
                Timestamp: timestamp || now,
                ProjectID: projectID,
                TrackerVersion: req.body.trackerVersion,
                RevID: req.body.revID,
                UserUUID: userUUID,
                UserAgent: ua,
                UserOS: userAgent.os,
                UserOSVersion: userAgent.userOsVersion,
                UserBrowser: userAgent.browser,
                UserBrowserVersion: uu.getBrowserVersion(ua),
                UserDevice: '',
                UserDeviceType: 'desktop',
                UserCountry: 'TW',
                UserDeviceMemorySize: req.body.deviceMemory,
                UserDeviceHeapSize: req.body.jsHeapSizeLimit,
                UserID: req.body.UserID,
            };
            // save
            sessionControl.insertWebSessionStart(sessionId, sessionStart);
            receiveBuffer.start(projectID, sessionId);
        } else {
            // 初始化文件存储位置
            tokenData = JSON.parse(req.body.token);
            receiveBuffer.start(projectID, tokenData.id);
        }

        // 加密token数据
        const token = JSON.stringify(tokenData);
        res.send({
            timestamp: 0,
            delay: tokenData.delay,
            token: token,
            startTimestamp: parseInt(tokenData.id),
            userUUID: userUUID,
            sessionID: String(tokenData.id),
            projectID: projectID,
            beaconSizeLimit: 10000000,
        });
    });

    app.post(prefix + '/v1/web/i', async (req, res) => {
        // Authorization Bearer
        const authorization = req.headers['authorization'];
        if (!authorization) {
            return res.send('error');
        }

        const bearer = authorization.split(' ');
        const b = bearer[0]['Bearer'];
        const tokenData = JSON.parse(bearer[1]);

        const sessionData = {
            ID: tokenData.id,
            delay: tokenData.delay,
            expTime: tokenData.expTime,
        };

        const session = await sessionControl.findOne(sessionData.ID);

        const requestBody = [];

        req.on('data', chunks => {
            requestBody.push(chunks);
        });

        req.on('end', function () {
            const buf = Buffer.concat(requestBody);
            console.log(`可用的数据块: ${buf.length}`);
            receiveBuffer.insert(buf, {
                projectId: session.projectId,
                sessionId: sessionData.ID,
                onMessage: msg => {
                    if (msg.tp === 'resource_timing') {
                        rescorcesControl.InsertWebStatsResourceEvent(sessionData.ID, msg);
                    }
                },
            });
        });

        // req.pipe(createWriteStream(path.join('.', Date.now().toString() + '.dat')));

        res.send();
    });
    // =============================================================
}
