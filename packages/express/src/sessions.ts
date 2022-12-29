import { toHump } from './utils';
import { RescorcesServices } from './resources';

const sql = `
CREATE TABLE IF NOT EXISTS sessions 
(
    session_id              integer         PRIMARY KEY,
    project_id              integer         NOT NULL,
    tracker_version         varchar         NOT NULL,
    start_ts                integer         NOT NULL,
    duration                integer         NULL,
    rev_id                  varchar                     DEFAULT NULL,
    platform                varchar                     DEFAULT web,
    is_snippet              boolean         NOT NULL    DEFAULT FALSE,
    user_id                 varchar                     DEFAULT NULL,
    user_anonymous_id       varchar                     DEFAULT NULL,
    user_uuid               varchar         NOT NULL,
    user_agent              varchar                     DEFAULT NULL,
    user_os                 varchar         NOT NULL,
    user_os_version         varchar                     DEFAULT NULL,
    user_browser            varchar                     DEFAULT NULL,
    user_browser_version    varchar                     DEFAULT NULL,
    user_device             varchar         NOT NULL,
    user_device_type        varchar         NOT NULL,
    user_device_memory_size integer                     DEFAULT NULL,
    user_device_heap_size   integer                     DEFAULT NULL,
    user_country            varchar         NOT NULL,
    pages_count             integer         NOT NULL DEFAULT 0,
    events_count            integer         NOT NULL DEFAULT 0,
    errors_count            integer         NOT NULL DEFAULT 0,
    watchdogs_score         integer         NOT NULL DEFAULT 0,
    issue_score             integer         NOT NULL DEFAULT 0,
    issue_types             varchar         NOT NULL DEFAULT '',
    utm_source              varchar         NULL     DEFAULT NULL,
    utm_medium              varchar         NULL     DEFAULT NULL,
    utm_campaign            varchar         NULL     DEFAULT NULL,
    referrer                varchar         NULL     DEFAULT NULL,
    base_referrer           varchar         NULL     DEFAULT NULL,
    metadata_1              varchar                  DEFAULT NULL,
    metadata_2              varchar                  DEFAULT NULL,
    metadata_3              varchar                  DEFAULT NULL,
    metadata_4              varchar                  DEFAULT NULL,
    metadata_5              varchar                  DEFAULT NULL,
    metadata_6              varchar                  DEFAULT NULL,
    metadata_7              varchar                  DEFAULT NULL,
    metadata_8              varchar                  DEFAULT NULL,
    metadata_9              varchar                  DEFAULT NULL,
    metadata_10             varchar                  DEFAULT NULL
);`;
export class SessionsService {
    constructor(protected db) {
        db.serialize(function () {
            db.run(sql, err => {
                if (err !== null) {
                    throw err;
                }
                console.log('[创建表]: sessions');
            });
        });
    }

    insert(sessionID: number, s) {
        console.log('[session][insert]', sessionID);

        const sql = `INSERT INTO sessions 
        (
            session_id, 
            project_id, 
            start_ts,
			user_uuid, 
            user_device, 
            user_device_type, 
            user_country,
			user_os, 
            user_os_version,
			rev_id, 
			tracker_version, 
            issue_score,
			platform,
			user_agent, 
            user_browser, 
            user_browser_version, 
            user_device_memory_size, 
            user_device_heap_size,
			user_id
        ) VALUES (
            $sessionID, 
            $ProjectID, 
            $Timestamp,
			$UserUUID, 
            $UserDevice, 
            $UserDeviceType, 
            $UserCountry,
			$UserOS, 
            $UserOSVersion,
			$RevID, 
            $TrackerVersion, 
            $issue_score,
			$Platform,
			$UserAgent, 
            $UserBrowser, 
            $UserBrowserVersion, 
            $UserDeviceMemorySize, 
            $UserDeviceHeapSize,
			$UserID
        );`;

        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                {
                    $sessionID: sessionID,
                    $ProjectID: s.ProjectID,
                    $Timestamp: s.Timestamp,
                    $UserUUID: s.UserUUID,
                    $UserDevice: s.UserDevice,
                    $UserDeviceType: s.UserDeviceType,
                    $UserCountry: s.UserCountry,
                    $UserOS: s.UserOS,
                    $UserOSVersion: s.UserOSVersion,
                    $RevID: s.RevID,
                    $TrackerVersion: s.TrackerVersion,
                    $issue_score: s.Timestamp / 1000,
                    $Platform: s.Platform,
                    $UserAgent: s.UserAgent,
                    $UserBrowser: s.UserBrowser,
                    $UserBrowserVersion: s.UserBrowserVersion,
                    $UserDeviceMemorySize: s.UserDeviceMemorySize,
                    $UserDeviceHeapSize: s.UserDeviceHeapSize,
                    $UserID: s.UserID,
                },
                function (err) {
                    if (err !== null) {
                        return reject(err);
                    }

                    resolve(this.lastID);
                }
            );
        });
    }

    query(sessionId: number) {
        console.log('[query][session]', sessionId);

        const sql = 'SELECT * FROM sessions WHERE session_id = $session_id';
        return new Promise((resolve, reject) => {
            this.db.all(
                sql,
                {
                    $session_id: sessionId,
                },
                (err, rows) => {
                    if (err !== null) {
                        return reject(err);
                    }

                    const newRows = rows.map(row => {
                        const temp = {};
                        Object.keys(row).map(kv => (temp[toHump(kv)] = row[kv]));
                        return temp;
                    });

                    resolve(newRows);
                }
            );
        });
    }

    findOne(sessionId: number): Promise<any> {
        return this.query(sessionId).then((rows: any) => {
            if (rows.length) {
                return rows[0];
            }

            return {};
        });
    }

    queryAll(project_id) {
        console.log('[session][query]', project_id);

        const sql = 'SELECT * FROM sessions WHERE project_id = $project_id';
        return new Promise(resolve => {
            this.db.all(
                sql,
                {
                    $project_id: project_id,
                },
                (err, rows) => {
                    const newRows = rows.map(row => {
                        const temp = {};
                        Object.keys(row).map(kv => (temp[toHump(kv)] = row[kv]));
                        return temp;
                    });

                    resolve(newRows);
                }
            );
        });
    }

    update(sessionId, value) {
        console.log('[session][update]', sessionId, value);
        const sql = 'UPDATE sessions SET session_id = $sessionId WHERE start_ts = $start_ts';

        this.db.run(sql, {
            $sessionId: sessionId,
            $start_ts: value.startTimestamp,
        });
    }

    remove(sessionId) {
        console.log('[session][update]', sessionId);
        this.db.run(
            'DELETE FROM sessions WHERE sessionId = $sessionId',
            {
                $sessionId: sessionId,
            },
            function (err) {
                if (err) {
                    return console.log(err.message);
                }

                console.log('deleted: ', this);
            }
        );
    }
}

export class SessionControl {
    sessionId: number;

    constructor(protected sessionsService: SessionsService, protected rescorcesServices: RescorcesServices) {}

    generateId() {
        return 6062739610258400;
        // return Math.floor(Math.random() * new Date().getTime());
    }

    insertWebSessionStart(sessionID: number, s) {
        this.sessionsService.insert(sessionID, {
            Platform: 'web',
            Timestamp: s.Timestamp,
            ProjectID: s.ProjectID,
            TrackerVersion: s.TrackerVersion,
            RevID: s.RevID,
            UserUUID: s.UserUUID,
            UserOS: s.UserOS,
            UserOSVersion: s.UserOSVersion,
            UserDevice: s.UserDevice,
            UserCountry: s.UserCountry,
            UserAgent: s.UserAgent,
            UserBrowser: s.UserBrowser,
            UserBrowserVersion: s.UserBrowserVersion,
            UserDeviceType: s.UserDeviceType,
            UserDeviceMemorySize: s.UserDeviceMemorySize,
            UserDeviceHeapSize: s.UserDeviceHeapSize,
            UserID: s.UserID,
        });
    }

    searchSessions(projectId, userId) {
        return this.sessionsService.queryAll(projectId);
    }

    async getSessionById(sessionId, originUrl: string) {
        const session = await this.sessionsService.findOne(sessionId);
        const rescores = await this.rescorcesServices.find(sessionId);

        const url = `${originUrl}/${session.projectId}/sessions2/${session.sessionId}`;

        const domURL = [`${url}/dom.mobs`];
        const mobsUrl = [];
        const devtoolsURL = [];
        // const devtoolsURL = [`${url}/devtools.mob`];

        return {
            data: {
                sessionId: session.sessionId,
                projectId: session.projectId,
                startTs: session.startTs,
                duration: session.duration,
                userId: session.userId,
                userAnonymousId: null,
                userUuid: session.userUuid,
                userAgent: session.userAgent,
                userOs: session.userOs,
                userBrowser: session.userBrowser,
                userDevice: session.userDevice,
                userDeviceType: session.userDeviceType,
                userCountry: session.userCountry,
                pagesCount: 5,
                eventsCount: 54,
                errorsCount: 0,
                revId: session.revId,
                userOsVersion: session.userOsVersion,
                userBrowserVersion: session.userBrowserVersion,
                userDeviceHeapSize: session.userDeviceHeapSize,
                userDeviceMemorySize: session.userDeviceMemorySize,
                trackerVersion: '4.1.5',
                watchdogsScore: 0,
                platform: session.platform,
                issueScore: session.issueScore,
                issueTypes: '{dead_click,memory,cpu}',
                isSnippet: false,
                rehydrationId: null,
                utmSource: null,
                utmMedium: null,
                utmCampaign: null,
                referrer: null,
                baseReferrer: null,
                fileKey: null,
                projectKey: 'FC8cwpO5yLvmHKidhn6X',
                favorite: false,
                viewed: true,
                events: [],
                stackEvents: [],
                errors: [],
                userEvents: [],
                domURL: domURL,
                mobsUrl: mobsUrl,
                devtoolsURL: devtoolsURL,
                resources: rescores,
                notes: [],
                metadata: {},
                issues: [],
                live: false,
                inDB: true,
            },
        };
    }
}
