export abstract class BaseRepository<T> {
    protected storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = `aerocode_${storageKey}`;
    }

    protected saveToStorage(id: string, content: string): void {
        const data = this.getAllFromStorage();
        data[id] = content;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    protected getAllFromStorage(): Record<string, string> {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : {};
    }

    protected readAll(): string[] {
        return Object.values(this.getAllFromStorage());
    }

    protected appendToStorage(id: string, line: string): void {
        const data = this.getAllFromStorage();
        if (data[id]) {
            data[id] += '\n' + line;
        } else {
            data[id] = line;
        }
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    protected clear(): void {
        localStorage.removeItem(this.storageKey);
    }
}
