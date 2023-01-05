import { covertHump } from './utils';

class Table {
    sql = 'SELECT';

    constructor(protected name) {}

    select(params: string | any[] = '*') {
        this.sql += ` * from ${this.name}`;
        return this;
    }

    where(con: object) {
        const val = Object.keys(con)
            .map(item => `${item}=${con[item]}`)
            .join(',');

        this.sql += `WHERE ${val}`;

        return this;
    }

    groupBy() {}
    
    paginate() {}

    get() {
        return this.sql;
    }
}
// const a = new Table('errors').select(['project_id']).where({ project_id: '' }).sql;

export class ErrorsService {
    constructor(protected db) {
        const sql = `
CREATE TABLE errors
        (
            error_id             text         NOT NULL PRIMARY KEY,
            project_id           integer      NOT NULL ,
            source               text NOT NULL,
            name                 text                  DEFAULT NULL,
            message              text         NOT NULL,
            payload              text        NOT NULL,
            status               text NOT NULL DEFAULT 'unresolved',
            parent_error_id      text                 ,
            stacktrace           text, 
            stacktrace_parsed_at timestamp
        );        
`;
        db.serialize(function () {
            db.run(sql, err => {
                if (err !== null) {
                    throw err;
                }
                console.log('[创建表]: errors');
            });
        });
    }

    update() {}

    delete() {}

    query(p) {
        const sql = `SELECT * from errors WHERE project_id=$project_id`;

        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                {
                    $project_id: p.project_id,
                },
                function (err, rows) {
                    if (err !== null) {
                        return reject(err);
                    }

                    resolve(covertHump(rows));
                }
            );
        });
    }

    add(p) {
        const sql = `
		INSERT INTO errors (
			error_id, project_id, source,
			name, message, payload,
			status, parent_error_id, stacktrace,
			stacktrace_parsed_at, 
		) VALUES (
			$error_id, $project_id, $source,
			$name, $message, $payload,
			$status, $parent_error_id, $stacktrace,
			$stacktrace_parsed_at
		)`;

        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                {
                    $error_id: p.error_id,
                    $project_id: p.project_id,
                    $source: p.source,
                    $name: p.name,
                    $message: p.message,
                    $payload: p.payload,
                    $status: p.status,
                    $parent_error_id: p.parent_error_id,
                    $stacktrace: p.stacktrace,
                    $stacktrace_parsed_at: p.stacktrace_parsed_at,
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
}

export class ErrorControl {
    constructor(protected errorsService: ErrorsService) {}
}
