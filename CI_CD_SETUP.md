# CI/CD Setup Documentation

## Overview

This project has a comprehensive CI/CD (Continuous Integration/Continuous Deployment) setup that
ensures code quality, consistency, and reliability. The setup includes automated testing, linting,
spell checking, and security scanning.

## What is CI/CD?

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment**

- **Continuous Integration (CI)**: Automatically building, testing, and validating code changes as
  soon as they are committed
- **Continuous Deployment (CD)**: Automatically deploying validated code changes to production
  environments

### Benefits

- ✅ Catch bugs and issues early
- ✅ Ensure code quality and consistency
- ✅ Provide immediate feedback to developers
- ✅ Prevent integration problems
- ✅ Reduce manual deployment errors
- ✅ Enable faster delivery of features

## Current CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

The pipeline runs on

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

#### Jobs:

1. **Static Analysis**
   - Markdown linting
   - Spell checking
   - ESLint on affected files

2. **Backend Tests**
   - PostgreSQL database setup
   - Redis setup
   - Database migrations
   - Unit and integration tests

3. **Mobile Tests**
   - TypeScript compilation check
   - GraphQL code generation
   - Unit tests

4. **Build**
   - Builds all affected projects
   - Ensures code compiles correctly

5. **Security Scan**
   - npm audit for security vulnerabilities
   - Checks all project dependencies

## Git Hooks with Husky

### Pre-commit Hook (`.husky/pre-commit`)

Automatically runs before each commit

- ✅ Markdown linting on staged `.md` files
- ✅ Spell checking on staged files
- ✅ Prettier formatting on staged files
- ✅ Lint-staged processing

### Benefits

- Prevents committing code with formatting issues
- Ensures consistent code style
- Catches spelling errors early
- Maintains code quality standards

## Quality Assurance Tools

### 1. Markdown Linting

- **Tool**: `markdownlint-cli`
- **Configuration**: `.markdownlint.json`
- **Purpose**: Ensures consistent markdown formatting
- **Runs**: Pre-commit and CI pipeline

### 2. Spell Checking

- **Tool**: `cspell`
- **Configuration**: `package.json` cspell section
- **Purpose**: Catches spelling errors in code and documentation
- **Custom Words**: Includes project-specific terms like "DuoTime", "NestJS", etc.
- **Runs**: Pre-commit and CI pipeline

### 3. Code Formatting

- **Tool**: `prettier`
- **Configuration**: `.prettierrc`
- **Purpose**: Ensures consistent code formatting
- **Runs**: Pre-commit hook

### 4. Linting

- **Tool**: `eslint`
- **Purpose**: Catches code quality issues and enforces coding standards
- **Runs**: CI pipeline on affected files

## Available Scripts

### Development Scripts

```bash
# Run all static analysis
npm run ci:static-analysis

# Run markdown linting
npm run markdown:lint

# Run spell checking
npm run spell:check

# Fix spelling errors
npm run spell:fix

# Run tests
npm run ci:test

# Build projects
npm run ci:build
```

### Local Development

```bash
# Start development servers
npm run dev

# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## How to Use

### For Developers

1. **Before Committing**:
   - The pre-commit hook will automatically run quality checks
   - Fix any issues that are flagged
   - Commit will be blocked if there are unfixed issues

2. **Creating Pull Requests**:
   - CI pipeline will automatically run on your PR
   - All checks must pass before merging
   - Review any failed checks and fix issues

3. **Local Development**:
   - Use `npm run spell:fix` to fix spelling errors
   - Use `npm run format` to format code
   - Use `npm run lint:fix` to fix linting issues

### For Maintainers

1. **Reviewing PRs**:
   - Check that all CI checks pass
   - Review automated feedback
   - Ensure code quality standards are met

2. **Deployment**:
   - CI pipeline ensures only quality code reaches production
   - Automated testing prevents regressions
   - Security scanning catches vulnerabilities

## Configuration Files

### `.markdownlint.json`

Configures markdown linting rules and ignored paths.

### `.prettierrc`

Configures code formatting rules.

### `package.json`

- `cspell` section: Spell checking configuration
- `lint-staged` section: Pre-commit processing rules
- Scripts: Available commands for development

### `.github/workflows/ci.yml`

GitHub Actions workflow configuration.

## Troubleshooting

### Common Issues

1. **Pre-commit Hook Fails**:

   ```bash
   # Fix spelling errors
   npm run spell:fix

   # Fix formatting
   npm run format

   # Fix linting issues
   npm run lint:fix
   ```

2. **CI Pipeline Fails**:
   - Check the GitHub Actions logs
   - Fix issues locally first
   - Push fixes to trigger new CI run

3. **Spell Check False Positives**:
   - Add words to the `cspell.words` array in `package.json`
   - Use inline comments to ignore specific lines

### Adding New Tools

1. Install the tool: `npm install --save-dev tool-name`
2. Add configuration file if needed
3. Update pre-commit hook if required
4. Add to CI pipeline if needed
5. Update documentation

## Best Practices

1. **Keep Commits Small**: Makes it easier to identify issues
2. **Fix Issues Locally**: Don't rely on CI to catch all problems
3. **Review CI Output**: Understand what each check does
4. **Update Configuration**: Keep tools and rules up to date
5. **Document Changes**: Update this file when adding new tools

## Future Enhancements

Potential improvements to consider:

- [ ] Add performance testing
- [ ] Implement automated dependency updates
- [ ] Add code coverage reporting
- [ ] Set up automated deployment to staging
- [ ] Add visual regression testing for mobile app
- [ ] Implement automated changelog generation

---

This CI/CD setup ensures that the DuoTime project maintains high code quality and reliability
throughout its development lifecycle.
