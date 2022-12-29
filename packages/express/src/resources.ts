import { DatabaseServices } from './Database';
import { covertHump } from './utils';

const sql = `
CREATE TABLE IF NOT EXISTS resources 
(
    session_id        bigint                 NOT NULL,
    message_id        bigint                 NOT NULL,
    timestamp         bigint                 NOT NULL,
    duration          bigint                 NULL,
    type              bigint                 NOT NULL,
    url               text                   NOT NULL,
    url_host          text                   NOT NULL,
    url_hostpath      text                   NOT NULL,
    success           boolean                NOT NULL,
    status            boolean               NULL,
    method            bigint                 NULL,
    ttfb              bigint                 NULL,
    header_size       bigint                 NULL,
    encoded_body_size integer                NULL,
    decoded_body_size integer                NULL,
    PRIMARY KEY (session_id, message_id, timestamp)
);
`;

export class RescorcesServices {
    constructor(protected db) {
        db.serialize(function () {
            db.run(sql, err => {
                if (err !== null) {
                    throw err;
                }
                console.log('[创建表]: resources');
            });
        });
    }

    find(sessionId: string) {
        console.log('[query][resources]', sessionId);

        const sql = 'SELECT * FROM resources WHERE session_id = $session_id';
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

                    resolve(covertHump(rows));
                }
            );
        });
    }

    select(): Promise<any[]> {
        console.log('[query][resources]');

        const sql = 'SELECT * FROM resources';
        return new Promise((resolve, reject) => {
            this.db.all(sql, {}, (err, rows) => {
                if (err !== null) {
                    return reject(err);
                }

                resolve(covertHump(rows));
            });
        });
    }

    findOne() {}

    add(seesionid, r): Promise<any> {
        const sql = `INSERT INTO resources (
			session_id, timestamp, message_id, 
			type,
			url, url_host, url_hostpath,
			success, status, 
			method,
			duration, ttfb, header_size, encoded_body_size, decoded_body_size
		) VALUES (
			$sessionID, $Timestamp, $MessageID, 
			$Type, 
			$URL, $url_host, $url_hostpath, 
			$Success, $Status, 
			$Method,
			$Duration, $TTFB, $HeaderSize, $EncodedBodySize, $DecodedBodySize
		)`;

        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                {
                    $sessionID: seesionid,
                    $Timestamp: r.Timestamp,
                    $MessageID: r.MessageID,
                    $Type: r.Type,
                    $URL: r.URL,
                    $url_host: r.url_host,
                    $url_hostpath: r.urlQuery,
                    $Success: r.Success,
                    $Status: r.Status,
                    $Method: r.Method,
                    $Duration: r.Duration,
                    $TTFB: r.TTFB,
                    $HeaderSize: r.HeaderSize,
                    $EncodedBodySize: r.EncodedBodySize,
                    $DecodedBodySize: r.DecodedBodySize,
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

    update() {}

    delete() {}

    query() {}
}

const DiscardURLQuery = (url: string) => {
    return url.split('?')[0];
};

const EnsureMethod = (method: string): string => {
    // const METHODS = {"GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"}
    return 'GET';
};

const EnsureType = (initiator: string): string => {
    // const TYPES = {"other", "script", "stylesheet", "fetch", "img", "media"}

    return initiator;
};

export class RescorcesControl {
    constructor(protected rescorcesServices: RescorcesServices) {}

    InsertWebStatsResourceEvent(seesionid: string, msg) {
        const urlQuery = DiscardURLQuery(msg.url);
        const resourceType = EnsureType(msg.initiator);
        const method = EnsureMethod(msg.method);

        return this.rescorcesServices.add(seesionid, {
            Timestamp: msg.timestamp,
            MessageID: msg._index,
            Type: resourceType,
            URL: msg.url,
            url_host: msg.url,
            urlQuery: urlQuery,
            Success: 1,
            Status: msg.status < 400,
            Method: method,
            Duration: msg.duration,
            TTFB: msg.ttfb,
            HeaderSize: msg.headerSize,
            EncodedBodySize: msg.encodedBodySize,
            DecodedBodySize: msg.decodedBodySize,
        });
    }
}
