export type PermissionAction = "view" | "add" | "update" | "delete";
export type PermissionModule = "news" | "documents" | "gallery" | "admins" | "clients";


export type BasicUser = {
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password:string;
    tempPassword: {password:string | null, validUntil : Date | null, needsChange:boolean}
}