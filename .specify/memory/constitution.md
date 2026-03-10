# Flips Constitution

<!-- Sync Impact Report:
- Version: 0.1.0 → 1.0.0 (MAJOR - first adoption of constitution)
- Modified principles: N/A (all new)
- Added sections: Code Quality, Testing Standards, UX Consistency, Performance Requirements
- Templates: constitution-template.md used as base
-->

## Core Principles

### I. Code Quality Standards

All code MUST adhere to the following quality requirements:
- Type safety MUST be enforced via TypeScript strict mode or equivalent type system
- Linting rules MUST pass without errors before any commit
- Code formatting MUST follow project conventions (Prettier/ESLint config)
- No `any` type casts, `@ts-ignore`, or `@ts-expect-error` unless explicitly justified in code comment
- Error handling MUST use proper Error subclasses, never empty catch blocks
- Functions MUST have explicit return types for public APIs

Rationale: Type safety and linting prevent runtime errors and make refactoring safer.

### II. Testing Standards

All features MUST include comprehensive test coverage:
- Unit tests MUST cover all utility functions, services, and business logic
- Integration tests MUST verify interactions between components
- Contract tests MUST validate API/interface compatibility
- Tests MUST fail before implementation (TDD approach recommended)
- Test files MUST reside in `tests/` directory with clear naming: `test_*.test.ts`
- Code coverage targets: 80% minimum for business logic, 100% for critical paths

Rationale: Testing prevents regressions and provides living documentation of behavior.

### III. User Experience Consistency

All user-facing interfaces MUST maintain consistent experience:
- UI components MUST follow established design patterns in the codebase
- Error messages MUST be user-friendly and actionable
- Loading states MUST be handled consistently across all async operations
- Keyboard navigation and accessibility standards (WCAG 2.1 AA) MUST be met
- Responsive behavior MUST be consistent across breakpoints
- User feedback (success, error, warning) MUST use consistent patterns

Rationale: Predictable UX reduces cognitive load and improves task completion rates.

### IV. Performance Requirements

All features MUST meet defined performance criteria:
- First Contentful Paint (FCP) MUST be under 1.5 seconds
- Time to Interactive (TTI) MUST be under 3 seconds
- Bundle size growth MUST be justified and tracked
- Memory usage MUST not exceed 100MB for client-side applications
- API response times: 95th percentile under 200ms for standard operations
- Performance budgets MUST be defined in project config

Rationale: Performance directly impacts user retention and satisfaction.

### V. Simplicity First

Solutions MUST prefer simplicity over cleverness:
- YAGNI: Don't implement features until they are explicitly required
- Complexity MUST be justified in documentation when added
- Alternative simpler solutions MUST be evaluated before choosing complex ones
- Technical debt MUST be tracked and addressed in scheduled maintenance

Rationale: Simple code is easier to maintain, debug, and extend.

## Additional Constraints

### Technology Stack
- TypeScript MUST be used for all new frontend and backend code
- React MUST be used for UI components unless otherwise specified
- State management MUST use established patterns (Context, Redux, or Zustand)
- API communication MUST use established libraries (fetch, axios, or tRPC)

### Security Requirements
- No secrets MUST be committed to version control
- All user input MUST be validated and sanitized
- Authentication tokens MUST use httpOnly cookies or secure storage
- HTTPS MUST be enforced in all environments

## Development Workflow

### Code Review Process
- All changes MUST undergo code review before merging
- Reviewers MUST verify: type safety, test coverage, UX consistency, performance impact
- PRs MUST pass all CI checks before merge
- Self-approved changes are prohibited except for trivial fixes

### Quality Gates
- Linting MUST pass without errors
- Type checking MUST pass without errors
- All tests MUST pass (unit, integration, contract)
- Build MUST succeed before merge
- Performance budgets MUST not regress

### Deployment
- Changes MUST be deployed via CI/CD pipeline
- Production deployments MUST include automated smoke tests
- Rollback procedures MUST be documented and tested

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Proposed change documented with rationale
2. Review by at least two maintainers
3. Migration plan if breaking changes involved
4. Version bump following semantic versioning:
   - MAJOR: Backward incompatible governance changes
   - MINOR: New principles or expanded guidance
   - PATCH: Clarifications, wording fixes

**Version**: 1.0.0 | **Ratified**: 2026-03-04 | **Last Amended**: 2026-03-04
