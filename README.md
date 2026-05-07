# @vedam-dev/core-library

Shared **API contracts** for the Vedam LMS portals (admin, student, mobile).

This package is the API counterpart to
[`@vedam-dev/ui-components`](https://github.com/vedam-dev/ui-components):
where `ui-components` centralizes UI building blocks, `core-library` centralizes
the **endpoint URLs**, **request/response DTOs**, and **response envelope types**
that every portal previously re-implemented inside `src/lib/*`.

It contains **only types and constants** — no fetch logic, no auth, no cookies,
no token refresh, no client factories. Each portal keeps its own
`src/utils/tokenRefresh.ts` and writes its own thin wrappers around the
endpoints exported from here.

## What's inside

- **Generic response envelope types** (`@vedam-dev/core-library`)
  - `ApiResponse<T>`, `RawApiResponse<T>`, `PaginatedResponse<T>`
  - `ApiError`, `ErrorBody`, `FieldError`
- **Per-resource DTOs + endpoints**
  - Attendance: `AttendanceRecord`, `AttendanceStatus`, `GetAttendanceParams`,
    `ImportAttendanceRequest`, `BulkUpdateAttendanceRequest`,
    `AttendanceListData`, `GetAttendanceResponse`,
    `ImportAttendanceResponse`, `BulkUpdateAttendanceResponse`,
    `AttendanceEndpoints`
  - Stub / submission: `DevHtmlQuestion`, `DevHtmlStubPayload`, `DevHtmlStubData`,
    `SubmissionPayload`, `SubmissionRecord`, `SubmissionStatus`,
    `GetSubmissionsParams`, `Get*Response`/`Save*Response`/`Submit*Response`,
    `StubEndpoints`

## Installation

This package is published to GitHub Packages, identical to `@vedam-dev/ui-components`.
Add to your portal's `.npmrc`:

```
@vedam-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:

```bash
yarn add @vedam-dev/core-library
```

## Usage

Each portal keeps its own `tokenRefresh.ts` and `fetchWithAuth` exactly as
today. The only change at call sites is replacing per-portal type/URL
duplication with imports from this package.

### Admin portal — `src/lib/attendance.ts` (after migration)

```ts
import { createFetchWithAuth, getTokenFromReqOrDocument } from '@/utils/tokenRefresh';
import {
  AttendanceEndpoints,
  type AttendanceRecord,
  type BulkUpdateAttendanceRequest,
  type GetAttendanceParams,
  type GetAttendanceResponse,
  type ImportAttendanceRequest,
  type ImportAttendanceResponse,
  type BulkUpdateAttendanceResponse,
} from '@vedam-dev/core-library';

const fetchWithAuth = createFetchWithAuth(() => process.env.NEXT_PUBLIC_API_BASE!);

function buildQuery(params?: GetAttendanceParams) {
  if (!params) return '';
  const qp = new URLSearchParams();
  if (params.campusId !== undefined) qp.set('campusId', String(params.campusId));
  if (params.classSessionId !== undefined) qp.set('classSessionId', String(params.classSessionId));
  if (params.scope) qp.set('scope', params.scope);
  if (params.page !== undefined) qp.set('page', String(params.page));
  if (params.size !== undefined) qp.set('size', String(params.size));
  const s = qp.toString();
  return s ? `?${s}` : '';
}

export async function getAttendance(params: GetAttendanceParams, reqOrToken?: unknown) {
  const token = getTokenFromReqOrDocument(reqOrToken as never);
  return fetchWithAuth<GetAttendanceResponse>(
    AttendanceEndpoints.list + buildQuery(params),
    'GET',
    token
  );
}

export async function importAttendance(data: ImportAttendanceRequest, reqOrToken?: unknown) {
  const token = getTokenFromReqOrDocument(reqOrToken as never);
  return fetchWithAuth<ImportAttendanceResponse>(AttendanceEndpoints.import, 'POST', token, data);
}

export async function bulkUpdateAttendance(
  updates: BulkUpdateAttendanceRequest[],
  reqOrToken?: unknown
) {
  const token = getTokenFromReqOrDocument(reqOrToken as never);
  return fetchWithAuth<BulkUpdateAttendanceResponse>(
    AttendanceEndpoints.bulk,
    'PUT',
    token,
    updates
  );
}

export type { AttendanceRecord };
```

### Stub / submission endpoints

`StubEndpoints` mixes static path constants and ID-bearing builders, so callers
never hand-format URLs:

```ts
import { StubEndpoints, type GetSubmissionsResponse } from '@vedam-dev/core-library';

await fetchWithAuth<GetSubmissionsResponse>(
  `${StubEndpoints.submissions}?questionId=${questionId}&size=1000`,
  'GET',
  token
);

await fetchWithAuth(StubEndpoints.devHtmlQuestion(42), 'GET', token);
```

## Migration notes

- The DTOs here are extracted from `admin-portal/src/lib` and
  `student-portal/src/lib`, which had drifted into per-portal forks of identical
  types. Where the two portals' definitions disagreed (e.g. attendance list
  shape), the type here is a **superset** that accepts both.
- `RawApiResponse<T>` mirrors what the backend actually returns; `ApiResponse<T>`
  is the lighter shape admin used to flatten everything into. Pick the one that
  matches your call site's expectations.
- No runtime code lives here. If you find yourself wanting `createFetchWithAuth`,
  `getTokenFromReqOrDocument`, or response-mapping helpers, those belong in the
  portal's own `src/utils/tokenRefresh.ts`.

## Scripts

| Script             | What it does                                          |
| ------------------ | ----------------------------------------------------- |
| `yarn build`       | Type-check + emit (uses root `tsconfig.json`)         |
| `yarn build:lib`   | Production build to `dist/` (used by `prepack` and CI) |
| `yarn watch`       | Incremental build during local development            |
| `yarn lint`        | Run ESLint                                            |
| `yarn lint:fix`    | Auto-fix lint issues                                  |
| `yarn clean`       | Remove `dist/`                                        |

## Publishing

CI (`.github/workflows/publish.yml`) mirrors `ui-components`:

- **PRs against `main`** run lint + build.
- **Pushes to `main`** auto-bump the minor version, push the tag, and publish to
  `https://npm.pkg.github.com` under `@vedam-dev/core-library`.

Manual publish (rare):

```bash
yarn build:lib
npm publish
```

A valid `NODE_AUTH_TOKEN` (GitHub PAT with `write:packages`) is required.
