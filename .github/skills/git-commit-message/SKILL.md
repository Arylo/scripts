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

If there are changes in directories under `src/`, add the folder name to the scope.

### Scope Mapping

- `src/docker/` → `docker`
- `src/qinglong/` → `qinglong`
- `src/monkey/` → `monkey`
- `src/raspberry_pi/` → `pi`

### Examples

- Changes in `src/monkey/` → `feat(monkey): description`
- Changes in `src/docker/` → `fix(docker): description`
- Changes in `src/qinglong/` → `refactor(qinglong): description`
- Changes in `src/raspberry_pi/` → `feat(pi): description`
- Multiple folders → list the primary one or use comma separation

## Subject

1. Generate the subject based on `git diff --cached`.
2. Focus primarily on the `src/` directory.
