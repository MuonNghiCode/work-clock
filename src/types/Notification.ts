export interface Notification {
    id: string;
    message: string;
    createdAt: Date;
    userId: string;
    status: "read" | "unread";
    claimId?: string;
    type?: "newClaim" | "Approved" | "Rejected" | "Return" | "Paid";
}