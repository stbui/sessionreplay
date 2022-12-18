import { covertHump } from './utils';

export class ProjectsService {
    constructor(protected db) {
        db.serialize(function () {
            // db.run('DROP TABLE IF EXISTS "sessions";');
            db.run(
                `CREATE TABLE IF NOT EXISTS projects 
                (
                    "project_id" integer PRIMARY KEY AUTOINCREMENT,
                    "project_key" varchar(20) NOT NULL,
                    "name" text NOT NULL,
                    "active" boolean NOT NULL,
                    "sample_rate" text,
                    "created_at" text,
                    "deleted_at" text DEFAULT NULL,
                    "max_session_duration" integer NOT NULL DEFAULT 7200000,
                    "metadata_1" text DEFAULT NULL,
                    "metadata_2" text DEFAULT NULL,
                    "metadata_3" text DEFAULT NULL,
                    "metadata_4" text DEFAULT NULL,
                    "metadata_5" text DEFAULT NULL,
                    "metadata_6" text DEFAULT NULL,
                    "metadata_7" text DEFAULT NULL,
                    "metadata_8" text DEFAULT NULL,
                    "metadata_9" text DEFAULT NULL,
                    "metadata_10" text DEFAULT NULL,
                    "save_request_payloads" boolean NOT NULL DEFAULT FALSE,
                    "gdpr" text,
                    "first_recorded_session_at" text DEFAULT NULL,
                    "sessions_last_check_at" text DEFAULT NULL
                );`,
                err => {
                    if (err !== null) {
                        throw err;
                    }
                    console.log('[创建表]: projects');
                }
            );
        });
    }

    query(project_key: number) {
        console.log('[query][projects]', project_key);

        const sql = 'SELECT * FROM projects WHERE project_key = $project_key';
        return new Promise((resolve, reject) => {
            this.db.all(
                sql,
                {
                    $project_key: project_key,
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

    findOne(project_key: number): Promise<{}> {
        return this.query(project_key).then((rows: any) => {
            if (rows.length) {
                return rows[0];
            }

            return {};
        });
    }

    insert(p: {
        project_key: string;
        name: string;
        active: boolean;
        max_session_duration: number;
        save_request_payloads: boolean;
    }): Promise<any> {
        const sql = `INSERT INTO projects 
        (
            project_key,name,active,max_session_duration,save_request_payloads
        ) VALUES (
            $project_key,$name,$active,$max_session_duration,$save_request_payloads
        );`;

        return new Promise((resolve, reject) => {
            this.db.run(
                sql,
                {
                    $project_key: p.project_key,
                    $name: p.name,
                    $active: p.active,
                    $max_session_duration: p.max_session_duration,
                    $save_request_payloads: p.save_request_payloads,
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

export class ProjectsControl {
    constructor(protected projectsService: ProjectsService) {}

    create() {
        this.projectsService.insert({
            project_key: 'FC8cwpO5yLvmHKidhn6X',
            name: 'stbui',
            active: true,
            max_session_duration: 1000,
            save_request_payloads: false,
        });
    }

    findOne(projectKey: string) {
        return {
            projectId: 3296,
            name: 'stbui',
            projectKey: 'FC8cwpO5yLvmHKidhn6X',
            saveRequestPayloads: false,
            gdpr: { maskEmails: true, sampleRate: 33, maskNumbers: false, defaultInputMode: 'plain' },
            stackIntegrations: false,
            recorded: true,
            status: 'red',
        };
    }

    toJSON() {
        return {
            data: [
                {
                    projectId: 3296,
                    name: 'stbui',
                    projectKey: 'FC8cwpO5yLvmHKidhn6X',
                    saveRequestPayloads: false,
                    gdpr: { maskEmails: true, sampleRate: 33, maskNumbers: false, defaultInputMode: 'plain' },
                    stackIntegrations: false,
                    recorded: true,
                    status: 'red',
                },
            ],
        };
    }
}
