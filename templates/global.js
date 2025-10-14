import fs from "fs-extra"
import path from "path"
import { execSync } from "child_process"

// Detect package manager
const detectPackageManager = () => {
  try {
    if (fs.existsSync("yarn.lock")) return "yarn"
    return "npm"
  } catch (err) {
    console.error("Error detecting package manager:", err.message)
    return "npm"
  }
}

// Get the project language from the package.json
export const getProjectLanguage = () => {
  const pkgPath = path.join(process.cwd(), "package.json")
  const pkg = fs.readJsonSync(pkgPath)
  return pkg.language
}

// Install packages using the detected package manager
export const installPackages = (packages, isDev = false) => {
  const packageManager = detectPackageManager()
  const installCmd = {
    npm: `npm install ${isDev ? "--save-dev" : ""}`,
    yarn: `yarn add ${isDev ? "--dev" : ""}`,
    pnpm: `pnpm add ${isDev ? "-D" : ""}`,
  }[packageManager]

  try {
    console.log(`Installing ${packages.join(", ")} with ${packageManager}...`)
    execSync(`${installCmd} ${packages.join(" ")}`, { stdio: "inherit" })
  } catch (err) {
    console.error(`Failed to install ${packages.join(", ")}:`, err.message)
    process.exit(1)
  }
}

// Validate if the current directory is a React project
export const validateReactProject = () => {
  const pkgPath = path.join(process.cwd(), "package.json")
  if (!fs.existsSync(pkgPath)) {
    console.error(
      "Error: No package.json found. Please run in a Node.js project directory."
    )
    process.exit(1)
  }
  const pkg = fs.readJsonSync(pkgPath)
  if (!pkg.dependencies?.react) {
    console.error(
      "Error: This does not appear to be a React project (react not found in dependencies)."
    )
    process.exit(1)
  }
}

// Backup a file before modification
export const backupFile = (filePath, fileName) => {
  const backupPath = path.join(process.cwd(), "src", "bak", `${fileName}.bak`)
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath)
    console.log(`Created backup: ${backupPath}`)
  }
}
