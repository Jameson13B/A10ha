# A10ha CLI

> A CLI tool by Atomic10 Studio to easily bootstrap and add popular tools to React projects

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

**Firebase**
```bash
a10ha add firebase
```
Adds Firebase to your project with options for:
- Firestore
- Authentication
- Storage

**React Router**
```bash
a10ha add react-router
```
Adds React Router DOM to your project with optional example routing setup.

**Functions**
```bash
a10ha add functions
```
Adds serverless functions to your project with a basic hello function.

## Requirements

- Node.js >= 18.0.0
- A React project (for `add` commands)

## Features

- 🚀 Quick project scaffolding with Vite
- 🔥 Firebase integration with feature selection
- 🛣️ React Router setup with examples
- 💾 Automatic file backups before modifications
- 🎨 Beautiful CLI interface with colors
- 📦 Works with both npm and yarn

## Coming Soon

More integrations are on the way!
- Zustand
- Neobrutalism
- Ant Design
- Tailwind
- Vanilla Extract


## License

MIT

