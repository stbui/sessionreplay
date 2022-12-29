import path from 'path';

export class Config {
    private _storePath: string;

    port: number = 8080;

    constructor() {}

    set storePath(value: string) {
        this._storePath = path.join(process.cwd(), value);
    }

    get storePath() {
        return this._storePath;
    }
}
