export function to64Int(value) {
    const buffer = Buffer.alloc(8);
    let offset = buffer.length - 1;

    while (value >= 255) {
        buffer[offset--] = value % 255 | 0;
        value = Math.floor(value / 255);
    }
    buffer[offset--] = value;

    return buffer;
}
