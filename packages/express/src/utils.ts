export function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

export function covertHump(rows: any[]): any[] {
    return rows.map(row => {
        const temp = {};
        Object.keys(row).map(kv => (temp[toHump(kv)] = row[kv]));
        return temp;
    });
}

export function getUUID(u?: string) {
    if (u !== null) {
        return u;
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
