---
name: Git commit message standard
description: Standards for git commit messages in this repository
---

# Git Commit Message Skill

When generating git commit messages, you MUST follow the standards defined below.

## Commit Message Format

Follow the conventional commits format:

```text
<type>(<scope>): <subject>
```

## Type

- `feat`: A new feature
- `fix`: A bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes
- `test`: Test additions or modifications
- `chore`: Build process, dependencies, etc.

## Scope Rules

If there are changes in directories under `apps/`, add the folder name to the scope.

### Scope Mapping

- `apps/docker/` → `docker`
- `apps/qinglong/` → `qinglong`
- `apps/monkey/` → `monkey`
- `apps/raspberry_pi/` → `pi`
- `apps/caddyfile-sdk` → `caddyfile`

### Examples

- Changes in `apps/monkey/` → `feat(monkey): description`
- Changes in `apps/docker/` → `fix(docker): description`
- Changes in `apps/qinglong/` → `refactor(qinglong): description`
- Changes in `apps/raspberry_pi/` → `feat(pi): description`
- Multiple folders → list the primary one or use comma separation

## Subject

1. Generate the subject based on `git diff --cached`.
2. Focus primarily on the `apps/` directory.
