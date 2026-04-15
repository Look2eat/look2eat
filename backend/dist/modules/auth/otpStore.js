"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpStore = void 0;
class OtpStore {
    constructor() {
        this.store = new Map();
        this.TTL_MS = 5 * 60 * 1000;
    }
    generateAndStore(phone) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + this.TTL_MS;
        this.store.set(phone, { otp, expiresAt });
        return otp;
    }
    verify(phone, inputOtp) {
        const data = this.store.get(phone);
        if (!data)
            return false;
        if (Date.now() > data.expiresAt) {
            this.store.delete(phone);
            return false;
        }
        if (data.otp === inputOtp) {
            this.store.delete(phone);
            return true;
        }
        return false;
    }
    clearExpired() {
        const now = Date.now();
        for (const [phone, data] of this.store.entries()) {
            if (now > data.expiresAt) {
                this.store.delete(phone);
            }
        }
    }
}
exports.otpStore = new OtpStore();
setInterval(() => {
    exports.otpStore.clearExpired();
}, 10 * 60 * 1000);
