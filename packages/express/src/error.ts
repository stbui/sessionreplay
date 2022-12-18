export class ErrorsService {
    // CREATE TABLE errors
    //         (
    //             error_id             text         NOT NULL PRIMARY KEY,
    //             project_id           integer      NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    //             source               error_source NOT NULL,
    //             name                 text                  DEFAULT NULL,
    //             message              text         NOT NULL,
    //             payload              jsonb        NOT NULL,
    //             status               error_status NOT NULL DEFAULT 'unresolved',
    //             parent_error_id      text                  DEFAULT NULL REFERENCES errors (error_id) ON DELETE SET NULL,
    //             stacktrace           jsonb, --to save the stacktrace and not query S3 another time
    //             stacktrace_parsed_at timestamp
    //         );
    constructor() {}
}
