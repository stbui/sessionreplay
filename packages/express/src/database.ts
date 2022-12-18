import sqlite3 from 'sqlite3';

export class Database {
    filename: string = 'data.db';

    db: sqlite3.Database;

    constructor(protected config) {}

    init(): sqlite3.Database {
        this.db = new sqlite3.Database('data.db', function (err) {
            if (err) throw err;
            console.log('[]链接数据库成功！');
        });

        return this.db;
    }

    select() {}

    findOne() {}

    find() {}

    add() {}

    update() {}

    delete() {}

    query() {}
}
