import { DatabaseServices } from './Database';

const sql = `
CREATE TABLE IF NOT EXISTS issues 
(
    session_id bigint  NOT NULL,
    timestamp  bigint  NOT NULL,
    seq_index  integer NOT NULL,
    issue_id   text    NOT NULL,
    payload    text DEFAULT NULL,
    PRIMARY KEY (session_id, timestamp, seq_index)
);
`;

export class IssuesServices {
    constructor(protected db) {
        db.serialize(function () {
            db.run(sql, err => {
                if (err !== null) {
                    throw err;
                }
                console.log('[创建表]: issues');
            });
        });
    }

    update() {}

    delete() {}

    query() {}

    add(p) {
        const sql = `
		INSERT INTO issues (
			session_id, timestamp, message_id,
			min_fps, avg_fps, max_fps,
			min_cpu, avg_cpu, max_cpu,
			min_total_js_heap_size, avg_total_js_heap_size, max_total_js_heap_size,
			min_used_js_heap_size, avg_used_js_heap_size, max_used_js_heap_size
		) VALUES (
			$1, $2, $3,
			$4, $5, $6,
			$7, $8, $9,
			$10, $11, $12,
			$13, $14, $15
		)`;
    }
}

export class IssuesControl {
    constructor(protected IssuesServices: IssuesServices) {}
}
