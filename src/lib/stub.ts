import type { RawApiResponse } from '../types/api';

// ---------------------------------------------------------------------------
// Domain DTOs (verbatim superset of admin & student `stub.ts`)
// ---------------------------------------------------------------------------

export interface DevHtmlStubPayload {
  questionId: number;
  html: string;
  css: string;
  js?: string | null;
}

export interface DevHtmlStubData {
  questionId: number;
  html: string;
  css: string;
  js: string | null;
  updatedAt: string;
}

export interface DevHtmlQuestion {
  id: string;
  ques_title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  type: string;
  description: string;
  score: number;
  stubs: { html: string; css: string; js: string | null };
  baseline: { html: string; css: string; js: string | null };
  eval_criteria: string;
}

export type SubmissionStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'COMPILATION_ERROR'
  | 'PARTIALLY_ACCEPTED';

// ---------------------------------------------------------------------------
// Request DTOs
// ---------------------------------------------------------------------------

export interface SubmissionPayload {
  questionId: number;
  submittedCode: { html: string; css: string; js?: string | null };
  score?: number | null;
  status: SubmissionStatus;
}

export interface GetSubmissionsParams {
  /** Page size — student portal historically requested up to 1000 per call. */
  size?: number;
}

// ---------------------------------------------------------------------------
// Response DTOs (typed aliases on the generic envelope)
// ---------------------------------------------------------------------------

export interface SubmissionRecord {
  devHtmlSubmissionId: string;
  ques_id: number;
  submitted_code: { html: string; css: string; js: string | null };
  score: number | null;
  status: SubmissionStatus;
  submissionTime: string;
}

export type GetDevHtmlQuestionResponse = RawApiResponse<DevHtmlQuestion>;
export type SaveDevHtmlStubResponse = RawApiResponse<DevHtmlStubData>;
export type SaveBaselineDevHtmlResponse = RawApiResponse<DevHtmlStubData>;
export type SubmitDevHtmlResponse = RawApiResponse<SubmissionRecord>;
export type GetSubmissionsResponse = RawApiResponse<SubmissionRecord[]>;

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

/**
 * URL paths for the assessment-service Dev-HTML endpoints. Static paths are
 * strings; ID-bearing paths are builders so callers don't hand-format URLs.
 */
export const StubEndpoints = {
  devHtmlQuestion: (questionId: string | number) => `/question/dev-html/${questionId}`,
  saveDevHtmlStub: '/stub/dev-html',
  saveBaselineDevHtml: '/baseline/dev-html',
  submitDevHtml: '/submission/dev-html',
  submissions: '/submission/dev-html/all',
} as const;
