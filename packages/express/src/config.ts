import path from 'path';

export class Config {
    private _storePath: string;

    constructor() {}

    set storePath(value: string) {
        this._storePath = path.join(process.cwd(), value);
    }

    get storePath() {
        return this._storePath;
    }
}
