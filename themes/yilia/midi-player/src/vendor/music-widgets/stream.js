"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stream {
    constructor(source) {
        if (source instanceof Uint8Array)
            this.array = source;
        else if (Array.isArray(source))
            this.array = new Uint8Array(source);
        else
            this.array = new Uint8Array(source);
        this.position = 0;
    }
    eof() {
        return this.position >= this.array.length;
    }
    read(length) {
        const result = this.array.slice(this.position, this.position + length);
        this.position += length;
        return result;
    }
    readString(length) {
        const data = Array.from(this.read(length));
        return data.map(c => String.fromCharCode(c)).join("");
    }
    readInt32() {
        const result = ((this.array[this.position] << 24) +
            (this.array[this.position + 1] << 16) +
            (this.array[this.position + 2] << 8) +
            this.array[this.position + 3]);
        this.position += 4;
        return result;
    }
    readInt16() {
        const result = ((this.array[this.position] << 8) +
            this.array[this.position + 1]);
        this.position += 2;
        return result;
    }
    readInt8(signed) {
        let result = this.array[this.position];
        if (signed && result > 127)
            result -= 256;
        this.position += 1;
        return result;
    }
    readVarInt() {
        let result = 0;
        while (true) {
            const b = this.readInt8();
            if (b & 0x80) {
                result += (b & 0x7f);
                result <<= 7;
            }
            else {
                return result + b;
            }
        }
    }
}
;
exports.default = Stream;
