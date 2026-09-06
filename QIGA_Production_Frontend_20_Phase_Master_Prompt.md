# QIGA INTELLIGENT ROUTE OPTIMIZATION PLATFORM
## Production-Grade Frontend Development Master Prompt — 20-Phase Execution Plan

**Version:** Production v2.0  
**Target:** Real production deployment, not a prototype  
**Application:** QIGA Intelligent Route Optimization Platform

---

# 0. MASTER ROLE & NON-NEGOTIABLE OBJECTIVE

Act as a **Principal Frontend Engineer + Product Architect + UI/UX Engineer + GIS Application Engineer + TypeScript Engineer + Security-Conscious Production Developer + QA Engineer + DevOps-Aware Frontend Engineer**.

You are responsible for building the **actual production frontend** of the QIGA Intelligent Route Optimization Platform.

This is **not** a static UI, visual mockup, hackathon-only demo, or collection of disconnected pages.

The frontend must be:

- production-ready
- secure
- strongly typed
- API-driven
- maintainable
- scalable
- testable
- accessible
- responsive
- fault tolerant
- observable
- performant
- deployment-ready
- easy to integrate with a real backend
- safe to operate when external services fail

The core optimization technology is:

> **QIGA — Quantum-Inspired Genetic Algorithm**

QIGA runs on the backend/optimization service. The browser must **never implement or fake QIGA**. The frontend only submits validated optimization requests, receives authoritative backend results, visualizes them, and manages the user experience.

The system architecture must follow:

```text
User
 ↓
React UI
 ↓
Feature/Application Logic
 ↓
Client State
 ↓
API Service Layer
 ↓
Backend API
 ↓
Routing / Traffic Services
 ↓
QIGA Optimization Engine
 ↓
Authoritative Optimization Result
```

Never move backend business logic into React components.

Never expose private API keys.

Never calculate the authoritative optimized route in the browser.

Never use fake production data.

Never trust frontend authorization as a security boundary.

---

# TECHNOLOGY BASELINE

Use the existing project stack where already established. Prefer:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios or a centralized Fetch wrapper
- Lucide React
- Recharts or ECharts
- MapLibre GL JS or a provider-neutral map abstraction
- Vitest
- React Testing Library
- Playwright
- ESLint
- Prettier

Use stable production versions.

Do not add libraries merely for convenience. Before adding a dependency, verify whether the current stack already solves the requirement.

Enable strict TypeScript.

Avoid `any`.

Use feature-oriented architecture.

---

# MASTER PRODUCT FLOW

The final product must support this complete journey:

```text
LANDING
 ↓
REGISTER / LOGIN
 ↓
AUTHENTICATED APPLICATION SHELL
 ↓
HOME / ROUTE PLANNER
 ↓
ORIGIN
 ↓
DESTINATION
 ↓
MULTIPLE STOPS
 ↓
VEHICLE
 ↓
OPTIMIZATION OBJECTIVES
 ↓
ADVANCED CONSTRAINTS
 ↓
VALIDATION
 ↓
SUBMIT
 ↓
QIGA OPTIMIZATION
 ↓
REAL PROGRESS
 ↓
RECOMMENDED ROUTE
 ↓
ALTERNATIVE ROUTES
 ↓
ROUTE COMPARISON
 ↓
EXPLAINABILITY
 ↓
START NAVIGATION
 ↓
LIVE LOCATION / TRAFFIC
 ↓
CONDITION CHANGE
 ↓
RE-OPTIMIZATION
 ↓
NEW ROUTE
 ↓
SAVE HISTORY
 ↓
ANALYTICS
 ↓
BENCHMARKING
 ↓
SETTINGS
```

---

# PHASE 01 — PROJECT FOUNDATION & ARCHITECTURE

## Objective

Create a clean, scalable production frontend foundation before implementing business features.

## Tasks

1. Inspect the existing repository before changing anything.
2. Identify:
   - current framework
   - package manager
   - scripts
   - environment files
   - existing components
   - routing
   - API utilities
   - styling system
   - test setup
3. Preserve useful existing work.
4. Do not blindly overwrite the repository.
5. Establish a predictable folder structure.

Recommended structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers/
│   └── config/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── map/
│   ├── charts/
│   └── feedback/
├── features/
│   ├── authentication/
│   ├── route-planning/
│   ├── optimization/
│   ├── route-results/
│   ├── navigation/
│   ├── history/
│   ├── analytics/
│   └── settings/
├── pages/
├── services/
│   ├── api/
│   ├── auth/
│   ├── routing/
│   ├── optimization/
│   ├── navigation/
│   └── analytics/
├── stores/
├── hooks/
├── schemas/
├── types/
├── utils/
├── constants/
├── i18n/
└── styles/
```

## Architecture Rules

- Pages compose features.
- Components do not directly call backend APIs.
- API calls live in service/query layers.
- Server state belongs in TanStack Query.
- Local UI state belongs in components.
- Cross-feature client state belongs in Zustand only when necessary.
- Validation schemas remain separate from UI components.
- Provider-specific GIS logic remains isolated.

## Exit Criteria

- Project starts successfully.
- TypeScript compiles.
- Routing foundation exists.
- Architecture is documented.
- No circular dependency introduced.

---

# PHASE 02 — ENVIRONMENT, CONFIGURATION & DEPLOYMENT CONTRACT

## Objective

Make configuration environment-aware and deployment-safe.

Create:

```text
.env.example
.env.development
.env.production
```

Never commit real `.env` secrets.

Frontend configuration may contain public values such as:

```text
VITE_API_BASE_URL=
VITE_APP_ENV=
VITE_MAP_PROVIDER=
VITE_PUBLIC_MAP_CONFIG=
VITE_ENABLE_DEMO_MODE=false
```

Never put these in frontend variables:

```text
database passwords
JWT signing secrets
private routing keys
QIGA secrets
Redis passwords
backend credentials
private provider credentials
```

## Requirements

Create a typed configuration module.

Fail fast for required missing public configuration in production.

Never hardcode:

```text
localhost
127.0.0.1
development-only URLs
```

inside production feature code.

Support:

```text
development
staging
production
```

## Exit Criteria

- Build can receive environment-specific API configuration.
- No secret appears in source.
- Demo mode is explicitly disabled by default.

---

# PHASE 03 — DESIGN SYSTEM & VISUAL LANGUAGE

## Objective

Build a consistent production design system before creating complex screens.

Create reusable primitives:

```text
Button
Input
Textarea
Select
Combobox
Card
Badge
Modal
Drawer
Dialog
Tabs
Tooltip
Toast
Alert
Table
Skeleton
Spinner
Progress
Dropdown
Pagination
EmptyState
ErrorState
```

## Design Principles

Use a professional intelligent-mobility/GIS visual language.

The UI should communicate:

- precision
- reliability
- intelligence
- operational clarity
- trust
- modern engineering

Avoid:

- excessive gradients
- unnecessary animations
- noisy dashboards
- decorative UI that reduces usability
- fake futuristic effects
- inaccessible color-only status indicators

## Required States

Every interactive component must support:

```text
default
hover
focus
active
disabled
loading
error
success
```

## Exit Criteria

- Design tokens exist.
- Typography is consistent.
- Spacing is consistent.
- Buttons/forms/dialogs are reusable.
- Keyboard focus is visible.

---

# PHASE 04 — APPLICATION SHELL, ROUTING & RESPONSIVE LAYOUT

## Objective

Create the production application shell.

Public routes:

```text
/
/login
/register
/forgot-password
```

Protected routes:

```text
/home
/optimize/:requestId
/routes/:routeId
/navigation/:routeId
/history
/analysis
/settings
```

## Desktop

Provide:

- sidebar or top navigation
- application branding
- primary navigation
- user menu
- status/connection indicator where useful
- responsive content area

## Mobile

Provide:

- compact navigation
- bottom navigation where appropriate
- bottom sheets for route controls
- full-screen map/navigation experiences where appropriate

## Route Guard

Unauthenticated users attempting protected routes must be redirected to login.

Authenticated users visiting login should be redirected appropriately.

Prevent redirect loops.

## Exit Criteria

- All routes resolve.
- Protected routes are actually protected at UI level.
- Unknown routes show a proper 404.
- Mobile and desktop shell work.

---

# PHASE 05 — AUTHENTICATION & SESSION MANAGEMENT

## Objective

Implement production-safe authentication UX.

Login:

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "userId": "string",
  "password": "string"
}
```

Support:

- login
- registration
- logout
- forgot password
- session expiration
- authenticated user loading

Prefer backend-issued secure HttpOnly cookie sessions where supported.

Do not store plaintext passwords.

Do not log credentials.

Do not store sensitive authentication tokens in `localStorage` unless the backend architecture explicitly requires it.

## Session Expiry

```text
API 401
 ↓
Refresh/session validation if supported
 ↓
If invalid:
Clear client auth state
 ↓
Show session-expired message
 ↓
Redirect /login
```

Never create infinite retries.

## Password Recovery

Do not reveal whether a particular account exists.

## Exit Criteria

- Auth state is centralized.
- Protected routes work.
- Logout works.
- Expired sessions are handled.
- No credential leakage occurs.

---

# PHASE 06 — API CLIENT, CONTRACTS & ERROR NORMALIZATION

## Objective

Create one production-grade communication layer.

Create:

```text
apiClient
request interceptors/middleware
response normalization
typed API services
error normalization
request cancellation
timeout handling
```

Do not scatter raw `fetch()` or Axios calls throughout components.

Handle:

```text
400
401
403
404
409
422
429
500
502
503
504
network failure
timeout
```

Map technical failures to safe user-facing messages.

Bad:

```text
AxiosError: Request failed with status code 500
```

Good:

```text
We couldn't optimize this route right now.
Please try again.
```

Respect backend retry information where provided.

Do not blindly retry mutations.

Use `AbortController` or equivalent for obsolete requests.

## Exit Criteria

- All backend calls use the service layer.
- Errors have a consistent shape.
- Request cancellation works.
- No raw backend error is shown to users.

---

# PHASE 07 — LOCATION SEARCH & MAP INFRASTRUCTURE

## Objective

Create a reusable, provider-neutral GIS system.

Components:

```text
MapProvider
MapView
LocationSearch
MarkerLayer
RouteLayer
TrafficLayer
ViewportController
CurrentLocationMarker
```

Location model:

```typescript
interface Location {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
}
```

Location search must support:

- autocomplete
- debouncing
- cancellation
- map selection
- current location
- clear
- loading
- error
- recent locations

Use approximately 250–400 ms debounce where appropriate.

Never send an API request on every keystroke.

Keep map-provider-specific code isolated.

## Map Performance

Prevent unrelated React state changes from rebuilding the map.

Optimize:

- markers
- route geometry
- polylines
- viewport updates
- traffic layers
- location updates

## Exit Criteria

- Map renders.
- Search works.
- Provider abstraction exists.
- Map failure does not crash the application.

---

# PHASE 08 — ROUTE PLANNER & MULTI-STOP WORKFLOW

## Objective

Build the primary route-planning experience.

Route planner must support:

```text
Origin
Destination
Stop 1
Stop 2
...
Stop N
```

Users can:

- add stops
- edit stops
- remove stops
- reorder stops
- clear route
- use current location
- select locations from map

Drag-and-drop must have a keyboard-accessible alternative.

Prevent invalid requests:

- missing origin
- missing destination
- duplicate/invalid stops where backend rules prohibit them
- unsupported coordinates
- invalid route structure

## UX

Desktop:

```text
┌─────────────────────┬──────────────────────────┐
│ Route Planner       │                          │
│                     │                          │
│ Origin              │           MAP            │
│ Destination         │                          │
│ Stops               │                          │
│ Vehicle             │                          │
│ Preferences         │                          │
│                     │                          │
│ [ Optimize Route ]  │                          │
└─────────────────────┴──────────────────────────┘
```

Mobile:

```text
MAP
 ↓
Route controls
 ↓
Vehicle
 ↓
Optimization
 ↓
Optimize
```

## Exit Criteria

- Multi-stop route can be created.
- Route data is represented as typed state.
- Validation works.
- Mobile UX works.

---

# PHASE 09 — VEHICLE MODEL & CONSTRAINTS

## Objective

Capture vehicle information required by the backend.

Support:

```text
2-Wheeler
4-Wheeler
Heavy Load
Walking
```

Only show advanced fields when supported:

```text
weight
height
width
length
```

Do not invent backend fields.

Represent vehicle selection with a strict union/enum.

Example:

```typescript
type VehicleType =
  | "TWO_WHEELER"
  | "FOUR_WHEELER"
  | "HEAVY_LOAD"
  | "WALKING";
```

## Exit Criteria

- Vehicle selection is typed.
- Unsupported vehicle constraints cannot be submitted.
- Vehicle data maps cleanly to the backend contract.

---

# PHASE 10 — OPTIMIZATION PREFERENCES & VALIDATION

## Objective

Create a powerful but understandable optimization configuration.

Preset objectives:

```text
Fastest
Shortest
Fuel Efficient
Low Congestion
Eco
Balanced
```

Default:

```text
Balanced
```

Advanced multi-objective controls may include:

```text
Travel Time
Distance
Congestion
Fuel
Risk
Emissions
```

Represent weights as normalized values.

Example:

```json
{
  "time": 0.30,
  "distance": 0.15,
  "congestion": 0.20,
  "fuel": 0.15,
  "risk": 0.10,
  "emissions": 0.10
}
```

Frontend responsibilities:

- collect input
- validate input
- provide useful UX
- prevent malformed requests

Backend responsibilities:

- enforce authoritative constraints
- validate business rules
- calculate optimization

Use Zod schemas.

## Exit Criteria

- Valid requests pass.
- Invalid requests are blocked before submission.
- Weight handling is predictable.
- Backend remains authoritative.

---

# PHASE 11 — QIGA OPTIMIZATION SUBMISSION & REAL-TIME PROGRESS

## Objective

Integrate the actual QIGA backend without faking optimization.

Submit:

```http
POST /api/v1/routes/optimize
```

Example:

```json
{
  "origin": {},
  "destination": {},
  "stops": [],
  "vehicle": {},
  "optimization": {}
}
```

Expected initial response:

```json
{
  "requestId": "uuid",
  "status": "queued"
}
```

Then retrieve progress using:

```http
GET /api/v1/optimization/{requestId}
```

Prefer:

```text
SSE
```

or:

```text
WebSocket
```

for long-running jobs when supported.

If real-time transport is unavailable, use controlled polling.

Polling must:

- stop on completion
- stop on failure
- stop on timeout
- stop on unmount
- avoid excessive requests
- use reasonable intervals

## Progress UI

Display only backend-provided state.

Possible states:

```text
Queued
Preparing road network
Loading traffic
Applying vehicle constraints
Initializing QIGA
Evaluating candidate solutions
Updating population
Checking convergence
Selecting best feasible route
Completed
Failed
```

Never fabricate iterations or percentages.

## Exit Criteria

- Real optimization request is submitted.
- Request ID is tracked.
- Real status is displayed.
- Long-running requests do not freeze the UI.

---

# PHASE 12 — QIGA METRICS, CONVERGENCE & FAILURE UX

## Objective

Visualize optimization internals only when supplied by the backend.

Possible metrics:

```text
Current Iteration
Maximum Iterations
Best Fitness
Population Size
Feasible Solutions
Runtime
Convergence Status
```

Convergence chart:

```text
Best Fitness vs Iteration
```

Optional:

```text
Average Fitness vs Iteration
```

Never generate fake chart points.

Optional metrics remain optional.

If QIGA fails:

```text
Optimization unavailable
[ Retry ]
```

If backend supplies a fallback:

```text
QIGA optimization unavailable.

Fallback algorithm:
A*
```

Clearly label fallback output.

Never represent fallback results as QIGA results.

## Exit Criteria

- Charts use backend data.
- Missing metrics remain absent rather than fabricated.
- QIGA/fallback identity is always clear.

---

# PHASE 13 — ROUTE RESULTS, COMPARISON & EXPLAINABILITY

## Objective

Build the core decision screen.

Route result page:

```text
/routes/:routeId
```

Display:

```text
Recommended Route
Alternative Route 1
Alternative Route 2
```

Each route may contain:

```text
ETA
Distance
Traffic
Fuel/Energy
Cost
Emissions
Fitness
Algorithm
Feasibility
```

Only render values returned by the backend.

## Comparison

Create a responsive comparison table:

```text
Metric       Recommended   Alternative 1   Alternative 2
Time
Distance
Traffic
Fuel
Cost
Emissions
Fitness
Algorithm
Feasibility
```

## Explainability

Section:

```text
Why was this route selected?
```

Only use backend-provided explanations, such as:

```text
lower objective score
lower congestion
vehicle compatibility
stop constraints satisfied
lower travel time
lower emissions
```

Never invent explanations.

## Exit Criteria

- Recommended route is visually clear.
- Alternatives can be compared.
- Algorithm identity is visible.
- Explanation is traceable to backend data.

---

# PHASE 14 — NAVIGATION & LIVE LOCATION

## Objective

Create a robust navigation experience.

Route:

```text
/navigation/:routeId
```

Display:

```text
ETA
Remaining distance
Current location
Next maneuver
Distance to maneuver
Stop progress
Traffic
```

Map should remain dominant.

## Geolocation States

Handle:

```text
permission granted
permission denied
permission unavailable
permission revoked
```

If location is denied:

```text
Live location unavailable.

You can continue with route visualization.
```

Do not break navigation entirely.

Do not continuously request location when it is unnecessary.

Clean up geolocation watchers on unmount.

## Exit Criteria

- Navigation works without location permission.
- Current location is represented when available.
- UI remains stable under intermittent location failures.

---

# PHASE 15 — DYNAMIC RE-ROUTING & LIVE CONDITIONS

## Objective

Handle changing route conditions.

Possible events:

```text
Traffic changed
Accident
Road closure
Congestion
Unexpected route condition
```

When backend recommends a new route, show:

```text
Route Conditions Changed

Current route:
[backend value]

New QIGA route:
[backend value]

[ Switch Route ]
[ Keep Current ]
```

Do not automatically switch routes unless product requirements explicitly authorize it.

Do not claim an improvement without backend measurements.

Maintain the currently active route during transient service failures.

## Exit Criteria

- Re-routing recommendation is clearly distinct from current route.
- User can accept/reject where required.
- Current navigation state is not destroyed by temporary failures.

---

# PHASE 16 — HISTORY, ANALYTICS & BENCHMARKING

## Objective

Build persistent operational intelligence.

## History

Route:

```text
/history
```

Display:

```text
Date
Origin
Destination
Stops
Vehicle
Algorithm
Duration
Distance
```

Actions:

```text
View
Repeat
Delete
```

Use server-side pagination.

Do not load thousands of records into the browser.

Support filtering/sorting only through safe, controlled query parameters.

## Analytics

Route:

```text
/analysis
```

KPIs:

```text
Total Trips
Total Distance
Time Saved
Fuel/Energy Saved
Cost Saved
CO₂ Reduction
```

QIGA analytics:

```text
Average Runtime
Average Fitness
Convergence Rate
Average Iterations
Feasible Solution Rate
Fallback Rate
```

Charts:

```text
Fitness
Runtime
Convergence
Optimization Improvement
```

All values must come from backend APIs.

## Benchmarking

Compare measured scenarios for:

```text
Dijkstra
A*
Genetic Algorithm
QIGA
```

Metrics:

```text
Runtime
Distance
Travel Time
Fitness
Feasibility
```

Never state:

> QIGA is always better.

Instead show:

> Measured result for this benchmark/scenario.

## Exit Criteria

- Pagination works.
- Analytics are backend-driven.
- Charts are responsive.
- Benchmark claims are evidence-based.

---

# PHASE 17 — SETTINGS, PROFILE, LANGUAGE & DATA CONTROLS

## Objective

Complete the authenticated product experience.

Settings sections:

```text
Profile
Account
Security
Route Preferences
Vehicle Preferences
Language
Units
Privacy
Data
```

Support where backend endpoints exist:

```text
Change User ID
Change Phone Number
Change Password
Logout
Delete History
Delete Account
```

Phone changes must be backend verified.

Account deletion requires confirmation:

```text
Delete Account?

This permanently removes your account and associated data according to the applicable retention policy.

[ Cancel ]
[ Delete Account ]
```

## Internationalization

Support architecture for:

```text
English
Hindi
Gujarati
```

All user-facing strings must use translation keys.

Do not scatter hardcoded UI text throughout JSX.

Example:

```typescript
t("route.optimize")
```

## Units

Support configurable display units without changing backend canonical data.

## Exit Criteria

- Settings are modular.
- Translation architecture exists.
- Destructive actions are protected.
- User preferences do not corrupt route data.

---

# PHASE 18 — SECURITY, PRIVACY, ACCESSIBILITY & RESILIENCE

## Objective

Harden the frontend for real users.

## Security

Never:

```text
store passwords
expose secrets
log tokens
log credentials
trust client authorization
render unsanitized HTML
use unsafe redirects
```

Protect against:

```text
XSS
CSRF where applicable
session fixation
token leakage
open redirects
unsafe URL handling
```

Use deployment/backend security headers where applicable.

## Privacy

Minimize client-side storage.

Do not unnecessarily persist:

- route history
- private coordinates
- account information
- authentication material

Do not send sensitive route/location information to monitoring tools unless explicitly required and protected.

## Accessibility

Follow WCAG-oriented practices.

Implement:

```text
semantic HTML
keyboard navigation
focus management
visible focus
ARIA labels
screen reader support
accessible dialogs
accessible forms
high contrast
reduced-motion consideration
```

Never communicate critical route information only through color.

## Resilience

Handle:

```text
offline
slow connection
timeout
server unavailable
map provider failure
optimization failure
analytics failure
```

A failure in one subsystem must not crash the entire application.

## Exit Criteria

- Major flows are keyboard accessible.
- Sensitive information is not unnecessarily stored.
- External service failures degrade gracefully.

---

# PHASE 19 — PERFORMANCE, OBSERVABILITY & COMPREHENSIVE TESTING

## Objective

Make the frontend measurable, fast, and testable.

## Performance

Implement:

```text
React.lazy
Suspense
route-level code splitting
dynamic imports
asset optimization
memoization where justified
efficient map rendering
```

Do not prematurely optimize everything.

Avoid:

- unnecessary global state
- huge component files
- repeated API calls
- uncontrolled polling
- excessive map re-renders

## Observability

Use production-compatible frontend monitoring.

Capture:

```text
JavaScript errors
unhandled promise rejections
route failures
API failures
performance problems
```

Never capture:

```text
passwords
tokens
private credentials
unnecessary private coordinates
sensitive personal data
```

## Testing

### Unit Tests

Test:

```text
validators
formatters
route state
optimization state
auth state
utility functions
```

### Component Tests

Test:

```text
Login
Route Planner
Location Search
Vehicle Selector
Optimization Settings
Optimization Progress
Route Results
Navigation
Error States
```

### E2E

Test:

```text
Login
→ Plan Route
→ Add Stop
→ Reorder Stop
→ Select Vehicle
→ Configure Optimization
→ Optimize
→ View Recommended Route
→ Compare
→ Start Navigation
→ View History
```

### Security Tests

Test:

```text
unauthorized route access
expired sessions
invalid inputs
XSS payload handling
unsafe redirects
API failure handling
```

Never use real production credentials in tests.

## Exit Criteria

- Critical user journeys have automated coverage.
- Monitoring is privacy-safe.
- Performance regressions are detectable.

---

# PHASE 20 — PRODUCTION QA, CI/CD, BUILD & DEPLOYMENT READINESS

## Objective

Do not call the project production-ready until it passes a final release gate.

## Required Scripts

Ensure appropriate scripts exist:

```text
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run preview
```

Run:

```text
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Run E2E tests against a controlled test environment.

## CI/CD

Prepare:

```text
GitHub Actions
```

Recommended pipeline:

```text
Install
 ↓
Lint
 ↓
Typecheck
 ↓
Unit Tests
 ↓
Build
 ↓
E2E
 ↓
Security/quality checks
 ↓
Deploy
```

Do not deploy when required checks fail.

## Docker

If required by deployment architecture, use a production multi-stage build:

```text
Node build stage
 ↓
Static production assets
 ↓
Nginx/static server
```

Do not ship development dependencies unnecessarily.

## Release Verification

Verify:

```text
No TypeScript errors
No lint errors
Tests pass
Build succeeds
No secrets in repository
No production localhost references
Correct API base URL
Correct map configuration
Demo mode disabled
Error boundary exists
API errors handled
Network failures handled
Responsive layout works
Accessibility checks pass
Performance is acceptable
CI/CD is configured
```

## Final Smoke Test

Perform the complete journey:

```text
Landing
 ↓
Register/Login
 ↓
Home
 ↓
Origin
 ↓
Destination
 ↓
Stops
 ↓
Vehicle
 ↓
Optimization
 ↓
Submit
 ↓
QIGA Progress
 ↓
Results
 ↓
Comparison
 ↓
Navigation
 ↓
Re-routing
 ↓
History
 ↓
Analysis
 ↓
Settings
 ↓
Logout
```

---

# PRODUCTION API CONTRACT PRINCIPLES

The frontend should be prepared for endpoints conceptually similar to:

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password

GET    /api/v1/user/me
PATCH  /api/v1/user/profile
PATCH  /api/v1/user/password

POST   /api/v1/routes/optimize
GET    /api/v1/optimization/{requestId}
GET    /api/v1/routes/{routeId}
GET    /api/v1/routes/history
DELETE /api/v1/routes/{routeId}

GET    /api/v1/analytics
GET    /api/v1/analytics/qiga
GET    /api/v1/analytics/benchmark

GET    /api/v1/settings
PATCH  /api/v1/settings
```

These are frontend integration contracts, not permission to invent backend behavior.

If actual backend endpoints differ, adapt the service layer rather than rewriting UI components.

---

# TYPED DOMAIN MODELS

Use strict interfaces similar to:

```typescript
interface RouteRequest {
  origin: Location;
  destination: Location;
  stops: Location[];
  vehicleType: VehicleType;
  objective: OptimizationObjective;
  weights?: OptimizationWeights;
}

interface OptimizationWeights {
  time?: number;
  distance?: number;
  congestion?: number;
  fuel?: number;
  risk?: number;
  emissions?: number;
}

interface RouteOption {
  id: string;
  rank: number;
  algorithm: string;
  geometry: unknown;
  durationSeconds: number;
  distanceMeters: number;
  fitness?: number;
  fuel?: number;
  emissions?: number;
  cost?: number;
  feasible?: boolean;
}

interface QIGAOptimizationResult {
  requestId: string;
  status: string;
  algorithm: "QIGA" | "FALLBACK";
  recommendedRouteId?: string;
  alternatives?: string[];
  fitness?: number;
  iteration?: number;
  maxIterations?: number;
  runtimeMs?: number;
  convergence?: unknown[];
}
```

Adapt these types to the actual backend contract.

Do not force missing backend values into fake defaults.

---

# SERVER STATE VS CLIENT STATE

Use this rule consistently:

```text
TanStack Query
→ server state

Zustand
→ cross-feature client state

React local state
→ local UI state
```

Do not put every piece of application data into Zustand.

Do not use global state as a replacement for API caching.

---

# LOADING, ERROR & EMPTY STATE STANDARD

Every asynchronous feature must have explicit:

```text
initial
loading
success
empty
error
retrying
offline
```

states where applicable.

Examples:

History:

```text
No route history yet.
Plan your first route to see it here.
```

Analytics:

```text
Analytics will appear after completed optimization runs.
```

Map failure:

```text
Map temporarily unavailable.
Route information remains available.
```

Optimization failure:

```text
Optimization could not be completed.
Please try again.
```

Never leave blank screens.

Never expose stack traces to users.

---

# MOCK / DEMO ARCHITECTURE

When the real backend is unavailable during development:

Create an **isolated typed mock adapter**.

Example:

```text
services/
├── api/
├── adapters/
│   ├── productionAdapter.ts
│   └── mockAdapter.ts
```

Mock data must never be scattered throughout components.

Demo mode must be explicitly enabled:

```text
VITE_ENABLE_DEMO_MODE=false
```

Production default:

```text
false
```

Never silently fall back to mock data when production APIs fail.

A production API failure must remain visible as a real failure.

---

# COMPONENT ENGINEERING RULES

Do not create giant components such as:

```text
HomePage.tsx
→ 1000+ lines
```

Break complex screens into focused units:

```text
RoutePlanner
LocationInput
StopList
VehicleSelector
OptimizationSettings
MapPanel
OptimizationProgress
RouteSummary
RouteComparison
```

Every component should have a clear responsibility.

Keep business rules out of presentation components.

Use hooks for reusable behavior.

Use services for API communication.

Use schemas for validation.

Use utilities for deterministic transformations.

---

# MAP ENGINEERING RULES

The map must be a subsystem, not a component with application logic embedded inside it.

Required conceptual layers:

```text
Base Map
 ↓
Traffic
 ↓
Route
 ↓
Alternative Routes
 ↓
Stops
 ↓
Current Location
 ↓
Incidents / Conditions
```

The application should be able to replace the provider without rewriting route-planning features.

Private routing/map credentials must remain server-side.

Only expose public configuration required by the map SDK.

---

# QIGA CORRECTNESS RULES

These are absolute:

1. Never implement fake QIGA in the browser.
2. Never generate fake fitness values.
3. Never fabricate convergence.
4. Never invent iteration counts.
5. Never hardcode route results.
6. Never label fallback output as QIGA.
7. Never claim QIGA superiority without measured data.
8. Never show demo data in production mode.
9. Never calculate authoritative optimization in React.
10. Never hide backend optimization failures.

The frontend's responsibility is:

```text
Collect
 ↓
Validate
 ↓
Submit
 ↓
Track
 ↓
Visualize
 ↓
Explain using authoritative data
```

---

# PRODUCTION FAILURE MATRIX

| Failure | Expected frontend behavior |
|---|---|
| 401 | Clear invalid session, show session message, redirect to login |
| 403 | Show permission/authorization state |
| 404 | Show not-found state |
| 409 | Show conflict-specific message |
| 422 | Show validation error |
| 429 | Show rate-limit message and respect retry information |
| 500 | Show safe server error |
| 502/503/504 | Show temporary service-unavailable state |
| Network offline | Preserve usable UI and show offline state |
| Map failure | Preserve route information |
| Optimization failure | Allow retry |
| Analytics failure | Keep rest of application functional |
| Location denied | Continue without live location |
| SSE/WebSocket disconnect | Recover safely or use controlled fallback polling |
| Browser refresh during optimization | Reconstruct status from request ID where backend supports it |

---

# SECURITY RELEASE CHECKLIST

Before release verify:

```text
[ ] No secrets in source
[ ] No private API keys in VITE variables
[ ] No plaintext passwords
[ ] No auth token logging
[ ] No unsafe HTML rendering
[ ] No unsafe redirects
[ ] No client-only authorization assumptions
[ ] Sensitive information minimized in storage
[ ] Monitoring payloads reviewed
[ ] Production error messages sanitized
[ ] Dependency audit reviewed
[ ] Environment configuration reviewed
```

---

# PERFORMANCE RELEASE CHECKLIST

```text
[ ] Code splitting enabled where useful
[ ] Heavy map/chart modules lazy loaded where appropriate
[ ] Location search debounced
[ ] Stale requests cancelled
[ ] No unnecessary polling
[ ] No unnecessary global state
[ ] Map does not re-render for unrelated state
[ ] Images/assets optimized
[ ] Production build minified
[ ] Large lists paginated/virtualized where necessary
```

---

# ACCESSIBILITY RELEASE CHECKLIST

```text
[ ] Keyboard navigation
[ ] Visible focus
[ ] Semantic headings
[ ] Accessible labels
[ ] Accessible form errors
[ ] Accessible dialogs
[ ] Screen-reader meaningful status updates
[ ] Color is not the only status indicator
[ ] Sufficient contrast
[ ] Reduced motion considered
[ ] Mobile touch targets usable
```

---

# FINAL PRODUCTION ACCEPTANCE CRITERIA

Do not declare the frontend complete until all applicable items pass.

## Authentication

```text
[ ] Login
[ ] Registration
[ ] Logout
[ ] Session expiration
[ ] Protected routes
[ ] Password recovery
[ ] Secure credential handling
```

## Route Planning

```text
[ ] Origin
[ ] Destination
[ ] Multiple stops
[ ] Stop reorder
[ ] Vehicle selection
[ ] Optimization preferences
[ ] Validation
```

## QIGA

```text
[ ] Optimization API integrated
[ ] Request ID tracking
[ ] Real status
[ ] Real progress when supplied
[ ] Real fitness when supplied
[ ] Convergence visualization when supplied
[ ] Recommended route
[ ] Alternative routes
[ ] Fallback clearly identified
[ ] No fake QIGA metrics
```

## Navigation

```text
[ ] Route display
[ ] Current position
[ ] ETA
[ ] Maneuvers
[ ] Stop progress
[ ] Traffic
[ ] Re-routing
```

## History

```text
[ ] API loading
[ ] Pagination
[ ] Filtering
[ ] View
[ ] Repeat
[ ] Delete
```

## Analytics

```text
[ ] KPI dashboard
[ ] QIGA analytics
[ ] Benchmarking
[ ] Responsive charts
[ ] Backend-driven values
```

## Settings

```text
[ ] Profile
[ ] Security
[ ] Password change
[ ] Phone change where supported
[ ] Language
[ ] Units
[ ] Data controls
[ ] Account deletion
```

## Production

```text
[ ] Strict TypeScript
[ ] Lint passes
[ ] Tests pass
[ ] E2E passes
[ ] Build succeeds
[ ] No secrets
[ ] No localhost production URLs
[ ] Error boundaries
[ ] API error handling
[ ] Network resilience
[ ] Responsive
[ ] Accessible
[ ] Performance optimized
[ ] Monitoring configured
[ ] CI/CD ready
[ ] Environment configuration ready
[ ] Demo mode disabled
```

---

# FINAL CODING-AGENT EXECUTION PROTOCOL

When executing this prompt, do not attempt to build the entire application blindly in one step.

Follow the 20 phases sequentially.

For every phase:

1. Inspect the current codebase.
2. Identify existing reusable code.
3. Implement only the phase scope.
4. Keep architecture compatible with future phases.
5. Run relevant checks.
6. Fix regressions immediately.
7. Do not introduce temporary hacks that become permanent architecture.
8. Do not duplicate API logic.
9. Do not scatter mock data.
10. Do not bypass TypeScript errors.
11. Do not disable lint rules just to make the build pass.
12. Do not hide runtime errors.
13. Do not use fake production data.
14. Keep the application runnable after each phase.

At the end of each phase, verify:

```text
TypeScript
Lint
Runtime
Responsive behavior
Accessibility
API contract consistency
Error states
Security implications
```

If the backend endpoint is not yet available:

```text
DO:
Create typed interfaces.
Create service contracts.
Create isolated mock adapters.
Create realistic loading/error/success states.

DO NOT:
Hardcode API responses in components.
Pretend mock data is real.
Couple the UI to mock implementation details.
```

---

# FINAL SYSTEM BEHAVIOR

The completed frontend must clearly communicate this system:

```text
USER INPUT
    ↓
LOCATION / ROAD NETWORK
    ↓
TRAFFIC + VEHICLE CONSTRAINTS
    ↓
MULTI-OBJECTIVE CONFIGURATION
    ↓
QIGA OPTIMIZATION ENGINE
    ↓
FEASIBLE CANDIDATE SOLUTIONS
    ↓
BEST AUTHORITATIVE ROUTE
    ↓
ALTERNATIVE ROUTES
    ↓
COMPARISON + EXPLAINABILITY
    ↓
NAVIGATION
    ↓
LIVE CONDITIONS
    ↓
RE-OPTIMIZATION
    ↓
UPDATED ROUTE
    ↓
HISTORY
    ↓
ANALYTICS
    ↓
BENCHMARKING
```

The final product must feel like **one coherent production system**, not twenty disconnected implementations.

Prioritize:

```text
1. Reliability
2. Security
3. Correctness
4. API integrity
5. Fault tolerance
6. Performance
7. Accessibility
8. Maintainability
9. Visual polish
```

The final output must be a **real, deployable, production-grade frontend architecture for QIGA**, ready to connect to the production backend without requiring a rewrite of the application.

# END OF MASTER PROMPT
