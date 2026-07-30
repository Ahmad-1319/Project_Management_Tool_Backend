export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";
export type NotificationType = "TASK_ASSIGNED" | "TASK_UPDATED" | "COMMENT_ADDED" | "MEMBER_ADDED";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
