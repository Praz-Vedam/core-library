// ---------------------------------------------------------------------------
// Generic response envelope types shared by every endpoint in the platform.
// Portal code (and the lib modules in this package) build on these.
// ---------------------------------------------------------------------------

/**
 * Single field-level validation error. The backend uses both shapes
 * (`Record<field, messages[]>` and `{ field, message }[]`); we accept either.
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Lightweight, ergonomic envelope used across portals after a network call.
 * Prefer this in UI code that doesn't need raw status codes / timestamps.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Record<string, string[]> | FieldError[] | null;
}

/**
 * Raw envelope returned by the backend on every endpoint.
 * Kept generic so callers can specialize `data`.
 */
export interface RawApiResponse<TData = unknown> {
  statusCode: number;
  data: TData;
  errorCode?: string | null;
  errorPath?: string | null;
  message?: string;
  fieldErrors?: Record<string, string[]> | FieldError[] | null;
  timestamp?: number;
}

/**
 * Standard paginated payload returned by Spring-style backends.
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  meta?: Record<string, unknown> | null;
}

/**
 * Loose body shape for HTTP error payloads. Both portals use this when
 * surfacing field-level validation errors back to the UI.
 */
export interface ErrorBody {
  message?: string;
  fieldErrors?: Record<string, string[]> | FieldError[] | null;
  errorCode?: string | null;
  errorPath?: string | null;
}

/**
 * Error type thrown by a portal's `fetchWithAuth` for non-2xx responses or
 * network failures. `status === 0` indicates a network/transport failure.
 */
export type ApiError = Error & { status?: number; body?: unknown };
