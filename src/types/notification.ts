export type INotification = {
    id: string;
    title: string;
    category: string;
    createdAt: Date;
    isUnRead: boolean;
    type: string;
    avatarUrl: string | null;
}