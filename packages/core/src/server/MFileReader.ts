import type { Message } from './message';
import type { RawMessage } from './raw';
import RawMessageReader from './RawMessageReader';

export default class MFileReader extends RawMessageReader {
    private pLastMessageID: number = 0;
    private currentTime: number;
    public error: boolean = false;
    constructor(data: Uint8Array, private startTime?: number) {
        super(data);
    }

    private readRawMessage(): RawMessage | null {
        try {
            const msg = super.readMessage();

            return msg;
        } catch (e) {
            this.error = true;
            console.error('Read message error:', e);
            return null;
        }
    }

    next(): [Message, number] | null {
        if (this.error || !this.hasNextByte()) {
            return null;
        }

        this.pLastMessageID = this.p;

        const rMsg = this.readRawMessage();
        if (!rMsg) {
            return null;
        }

        const msg = Object.assign(rMsg, {
            time: this.currentTime,
            _index: this.pLastMessageID,
        });

        return [msg, this.pLastMessageID];
    }
}
