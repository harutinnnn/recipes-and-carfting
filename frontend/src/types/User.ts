export type User = {
    id: number;
    name: string;
    nickname: string;
    email: string;
    refreshToken: string;
    avatar: string;
    gender: 'male' | 'female' | 'unknown';
    gameMoney: number;
    realMoney: number;
    level: number,
    xp: number;
    isAdmin: boolean;
};
