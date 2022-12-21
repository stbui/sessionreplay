import { DatabaseServices } from './Database';

const sql = `
CREATE TABLE performance
(
    session_id             bigint   NOT NULL,
    timestamp              bigint   NOT NULL,
    message_id             bigint   NOT NULL,
    host                   text     NULL DEFAULT NULL,
    path                   text     NULL DEFAULT NULL,
    query                  text     NULL DEFAULT NULL,
    min_fps                smallint NOT NULL,
    avg_fps                smallint NOT NULL,
    max_fps                smallint NOT NULL,
    min_cpu                smallint NOT NULL,
    avg_cpu                smallint NOT NULL,
    max_cpu                smallint NOT NULL,
    min_total_js_heap_size bigint   NOT NULL,
    avg_total_js_heap_size bigint   NOT NULL,
    max_total_js_heap_size bigint   NOT NULL,
    min_used_js_heap_size  bigint   NOT NULL,
    avg_used_js_heap_size  bigint   NOT NULL,
    max_used_js_heap_size  bigint   NOT NULL,
    PRIMARY KEY (session_id, message_id)
);
`;

export class PerformanceServices {
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

    update() {}

    delete() {}

    query() {}

    add(p) {
        const sql = `
		INSERT INTO performance (
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

export class PerformanceControl {
    constructor(protected performanceServices: PerformanceServices) {}
}
