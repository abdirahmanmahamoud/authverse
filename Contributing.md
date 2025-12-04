# Contributing to Authverse

Thank you for your interest in contributing to **Authverse**!  
This project uses **Next.js** for the website, **Fumadocs** for documentation, and includes a CLI (`package/authverse`) and template files (`package/template`).

We welcome contributions in the form of:

- Documentation updates
- Bug reports and fixes
- Feature requests and implementations
- Improvements to CLI commands
- Updates to templates

---

## Project Structure Overview

- **Documentation (`/content`)**  
  All guides, tutorials, and API references live here in **MDX** format, rendered via Fumadocs.

- **CLI (`package/authverse`)**  
  The `authverse` CLI generates auth boilerplate, sets up Prisma/Drizzle, and scaffolds API routes and UI screens.

- **Template Folder (`package/template`)**  
  Contains files copied into user projects by the CLI, including routes, schemas, UI screens, and utilities.

---

## Development Guidelines

when contributing to the project, please follow these guidelines

- Keep changes focused. Large PRs are harder to review and unlikely to be accepted. We recommend opening an issue and discussing it with us first.
- Ensure all code is type-safe and takes full advantage of TypeScript features.
- Write clear, self-explanatory code. Use comments only when truly necessary.
- Maintain a consistent and predictable API across all supported frameworks.
- Follow the existing code style and conventions.
- We aim for stability, so avoid changes that would require users to run a migration or update their config...

## Getting Started

### 1. Fork the Repository

Click **Fork** in GitHub to create your own copy.

---

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/authverse.git
cd authverse
```

---

### 3. Install Dependencies

```bash
npm install
```

package/authverse

```bash
npm install
```

---

### 4. Create a new branch for your changes

```bash
git checkout -b type/description
# Example: git checkout -b feat/facebook-oauth
```

Implement your changes on the new branch. When committing, please follow these guidelines:

- **Commit Message Format**: Use a clear and concise commit message.
- **Branch Type Prefixes**:
  - `feat/` - New features
  - `fix/` - Bug fixes
  - `docs/` - Documentation changes
  - `refactor/` - Code refactoring
  - `test/` - Test-related changes
  - `chore/` - Build process or tooling changes

---

### 5. Test Your Changes

documentation website **Next.js** and **Fumadocs**

```bash
npm run dev
```

Test Build

```bash
npm run build
```

- Authverse Cli

MacOS and Linux

```bash
npm run build
```

- and

```bash
npm link
```

Windows

```bash
npm run build:windows
```

- test features added your & fix any bugs, local laptop **Test Next.js**

```bash
authverse init
```

or test provider

```bash
npx authverse add <provider-name>
```

or test forget password

```bash
npx authverse add forget
```

### 6. Commit Your Changes

Use the following commit message format:

```bash
fix: description
feat(provider-name): description
docs: description
refactor: description
test: description
chore: description
```

- **Commit Message Format**: Use a clear and concise commit message following the `type: description` or `type(scope): description` pattern. This helps categorize changes and provides a clear, readable history.

---

### 7. Push Your Changes

```bash
git push origin type/description
```

### 8. Create a Pull Request

Go to your forked repository on GitHub and create a pull request. Provide a clear title and description of your changes.

---
