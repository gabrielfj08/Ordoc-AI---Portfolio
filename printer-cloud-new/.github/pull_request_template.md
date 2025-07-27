## What is the branch type?

- build
- ci
- docs
- feat
- refactor
- style
- test
- fix
- perf

## Why are these changed being made?

- 

## How does this address the issue?

- 

## Related cards

- 

## Make sure to do the following steps

- [ ] Check if tests need to be added/updated

## Does this change require any extra deploy steps?

- [ ] Yes
- [ ] No

## Quality checklist

- [ ] API calls are **ALWAYS** performed on `index.ts`
- [ ] `isError` check is being performed before `isLoading` and `data` checks on `useQuery` calls
- [ ] Pages should be loading while `router` query params are being resolved
- [ ] `data` returned from `useQuery` must be typed and return the desired object
- [ ] `data` returned from `useQuery` must be transformed into frontend object

## Screenshots

