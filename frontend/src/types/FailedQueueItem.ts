export type FailedQueueItem = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};