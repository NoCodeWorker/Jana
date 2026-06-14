# Backstage modularization

## Objective

Reduce `components/jana-stage.tsx` from a God File into role- and feature-owned modules under `components/backstage/` without changing current demo behavior.

## Context

The implementation plan identifies `jana-stage.tsx` as the main organizational debt in the project. The file currently owns navigation, authentication UI, landing, dashboards, chat, content, Aula, Talent Graph, finance panel and studio.

## Affected systems

- Backstage shell and navigation.
- Alumno dashboard.
- Login and demo credentials UI.
- Talent Graph shared calculations.

## Implementation plan

1. Completed: connect already extracted `AlumnoHomeView`.
2. Completed: extract `BrandBlock` and `LoginForm`.
3. Completed: extract Talent Graph shared utilities.
4. Completed: extract `TalentGraphView` after separating shared helpers.
5. Completed: extract `ContentView` and `ArticlePreview`.
6. Completed: extract `BrainView`.
7. Completed: extract `ChatView` with internal agenda, privacy, tags, summary and microphone types.
8. Completed: extract `AulaView` with grading, dictation parser and verification dialog.
9. Completed: extract `PanelView` with external CRM read model, integration audit and financial signals.
10. Completed: extract `StudioView` with Remotion player and render simulator.
11. Completed: extract `ExecutiveCockpitView`.
12. Completed: extract `TeacherCockpitView`.
13. Completed: extract public `LandingPage`.
14. Remaining optional cleanup: extract shell-only constants/dropdowns if future reuse appears.

## Blockers

None.

## Decisions

Use incremental modularization with validation after every boundary. See `docs/decisions/ADR-001-incremental-backstage-modularization.md`.

## Risks

- Large TSX moves can create import drift.
- Some helpers are shared implicitly across dashboards.
- Moving landing and login together can break public/private access if not validated role by role.

## Validation checklist

- `npx tsc --noEmit`
- `npm run lint`
- Localhost health check
- `graphify update .`

## Rollback considerations

Each extracted module can be reverted independently because behavior is preserved through the same props and mock data context.
