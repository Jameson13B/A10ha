# A10ha CLI

> A CLI tool by [Atomic10 Studio](https://atomic10.studio) to easily bootstrap and add popular tools to React projects

## Features

- 🚀 Quick project scaffolding with Vite
- 🔥 Firebase integration with feature selection
- 🛣️ React Router setup with examples
- 💾 Automatic file backups before modifications
- 🎨 Beautiful CLI interface with colors
- 📦 Works with both npm and yarn

*More integrations are coming soon! Ex. Zustand, Tailwind, Vanilla Extract, and more.*

## Guides

- [Getting Started](https://github.com/Jameson13B/A10ha/wiki/Getting-Started)
- [Adding Tools](https://github.com/Jameson13B/A10ha/wiki/Adding-Tools)
  - [Firebase](https://github.com/Jameson13B/A10ha/wiki/Adding-Tools#supported-tools)
  - [React Router](https://github.com/Jameson13B/A10ha/wiki/Adding-Tools#supported-tools)
  - [Netlify Functions](https://github.com/Jameson13B/A10ha/wiki/Adding-Tools#supported-tools)
  - [Back4App](https://github.com/Jameson13B/A10ha/wiki/Adding-Tools#supported-tools)

## Installation

Install globally via npm:

```bash
npm install -g a10ha
```

Or with yarn:

```bash
yarn global add a10ha
```

## Usage

### Initialize a New React Project

Create a new React project with Vite:

```bash
a10ha init
```

This will prompt you to:
- Choose a project name
- Select JavaScript or TypeScript
- Choose a package manager (npm or yarn)

### Add Tools to Existing Projects

Add popular tools to your existing React projects:

```bash
a10ha add <tool>
```

#### Supported Tools
| Tool | Description | Command |
|:----:|:-----------:|:---------:|
| **Firebase** | *Pick from: Firestore, Authentication, and/or Storage* | `a10ha add firebase` |
| **React Router** | *With optional example routing setup.* | `a10ha add react-router` |
| **Netlify Functions** | *With a basic starter hello function.* | `a10ha add netlify-functions` |
| **Back4App** | *With a basic starter Back4App setup.* | `a10ha add back4app` |

## Requirements

- `Node.js >= 22.0.0`
- `React >= 18.0.0`

## Contributors

- Jameson Brown - Creator
  - [Website](https://jamesonb.com)
  - [GitHub](https://github.com/Jameson13B)

*Feel free to open an issue or pull request. We welcome all contributions and would love to expand this list.*

## License

MIT

