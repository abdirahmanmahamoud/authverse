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

## How to Contribute

### 1. Fork the Repository

Click **Fork** in GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/authverse.git
cd authverse
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Examples:

- `feature/add-google-oauth`
- `docs/update-installation`
- `fix/cli-command-bug`

---

### 4. Install Dependencies

```bash
npm install
```

---

### 5. Make Your Changes

#### Documentation

- Edit or add MDX files under `./content`
- Follow existing structure and formatting

#### CLI

- Update or add commands in `package/authverse/src`
- Include tests when adding features

#### Templates

- Edit `package/template` files carefully
- Ensure CLI generates files correctly

---

### 6. Test Your Changes

```bash
npn run build
```

user windows

```bash
npm run build:windows
```

---

### 7. Commit Changes

Use clear commit messages:

```bash
feat: add github oauth provider
fix: correct prisma schema path
docs: update getting started guide
```

---

### 8. Push Your Branch

```bash
git push origin feature/your-feature-name
```

---

### 9. Open a Pull Request

- Describe your changes clearly
- Link any related issues
- Explain why the changes are needed

Moderators will review and provide feedback.

---

## Reporting Issues

Please report bugs or feature requests via **GitHub Issues** with clear details, steps to reproduce, or screenshots.

---

## License

By contributing, you agree your changes will be licensed under the **MIT License** of Authverse.
