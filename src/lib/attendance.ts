import type { PaginatedResponse, RawApiResponse } from '../types/api';

// ---------------------------------------------------------------------------
// Domain DTOs
// ---------------------------------------------------------------------------

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'LEAVE' | string;

export interface AttendanceRecord {
  attendanceId: number;
  courseOfferingId: number;
  classSessionId: number;
  campusPersonRoleId: number;
  personId: number;
  email: string;
  status: AttendanceStatus;
  recordedAt: number | null;
  updatedAt: number;
  personName: string;
}

// ---------------------------------------------------------------------------
// Request DTOs
// ---------------------------------------------------------------------------

/** Superset of the query params used by both admin and student call sites. */
export interface GetAttendanceParams {
  campusId?: number;
  classSessionId?: number;
  campusPersonRoleId?: number;
  scope?: string;
  page?: number;
  size?: number;
}

export interface ImportAttendanceRequest {
  classSessionId: number;
}

export interface BulkUpdateAttendanceRequest {
  id: number;
  status: AttendanceStatus;
}

// ---------------------------------------------------------------------------
// Response DTOs (typed aliases on the generic envelope)
// ---------------------------------------------------------------------------

/**
 * `data` on the list endpoint comes back in any of three historical shapes
 * — keep callers honest with a union.
 */
export type AttendanceListData =
  | AttendanceRecord[]
  | PaginatedResponse<AttendanceRecord>
  | { items: AttendanceRecord[] };

export type GetAttendanceResponse = RawApiResponse<AttendanceListData>;
export type ImportAttendanceResponse = RawApiResponse<unknown>;
export type BulkUpdateAttendanceResponse = RawApiResponse<unknown>;

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

/**
 * URL paths for the attendance service. Combine with the portal's bound
 * `fetchWithAuth` and a query-string builder of choice.
 */
export const AttendanceEndpoints = {
  list: '/attendance',
  import: '/attendance/import',
  bulk: '/attendance/bulk',
} as const;

export type AttendanceEndpoint = (typeof AttendanceEndpoints)[keyof typeof AttendanceEndpoints];
