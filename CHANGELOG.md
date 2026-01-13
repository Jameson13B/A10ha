# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-01-13

### Changed
- Updated README with more detailed guides and contributors section


## [1.1.0] - 2026-01-11

### Added
- Netlify functions support with `a10ha add netlify-functions` command
- Automatic Vite configuration modification for Netlify functions
- Example hello function template for both JavaScript and TypeScript projects
- Support for `@netlify/vite-plugin` and `@netlify/functions` packages

### Changed
- Updated README with Netlify functions documentation

## [1.0.1] - 2025-10-13

### Changed
- Enhanced error and log messages in global.js
- Improved user feedback throughout the CLI

## [1.0.0] - 2025-10-13

### Added
- Initial release of A10ha CLI tool
- `a10ha init` command to bootstrap new React projects with Vite
- Support for both JavaScript and TypeScript project initialization
- Package manager selection (npm or yarn)
- `a10ha add firebase` command with feature selection:
  - Firestore support
  - Authentication support
  - Storage support
- `a10ha add react-router` command with optional example routing setup
- Automatic file backups before modifications
- AST-based code modification using jscodeshift
- Beautiful CLI interface with colored output
- Project validation to ensure React project structure
- Support for Node.js >= 22.0.0

[1.1.0]: https://github.com/Jameson13B/A10ha/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/Jameson13B/A10ha/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Jameson13B/A10ha/releases/tag/v1.0.0

