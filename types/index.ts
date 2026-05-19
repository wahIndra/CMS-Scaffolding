// ── Role / Status string unions ─────────────────────────────────────────────
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// ── Session augmentation ─────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
    };
  }
}

// ── Generic API response wrapper ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Dashboard stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  totalPosts: number;
  totalPages: number;
  totalMedia: number;
  totalUsers: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  detail: string | null;
  createdAt: Date;
  user: { id: string; name: string } | null;
}

// ── Navigation ────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  roles?: UserRole[];
  children?: NavItem[];
}
