#!/usr/bin/env node
import { program } from "commander"
import inquirer from "inquirer"
import fs from "fs-extra"
import { execSync } from "child_process"
import { join } from "path"
import j from "jscodeshift"
import babelParser from "recast/parsers/babel.js"
import "colors"

import {
  getProjectLanguage,
  installPackages,
  validateReactProject,
  backupFile,
} from "./templates/global.js"
import { initApp } from "./templates/init.js"
import { supportedTools, comingSoonTools } from "./templates/consts.js"
import { writeFirebaseFiles } from "./templates/firebase.js"
import {
  writeHelloFunctionFile,
  modifyViteConfig,
} from "./templates/netlify.js"
import {
  addImports,
  addHomeAndAboutComponents,
  modifyAppComponent,
} from "./templates/reactRouter.js"

// Initialize a new React project
const initProject = async () => {
  const { projectName, language, packageManager } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      default: "my-react-app",
    },
    {
      type: "list",
      name: "language",
      message: "JavaScript or TypeScript?",
      choices: ["TypeScript", "JavaScript"],
      default: "TypeScript",
    },
    {
      type: "list",
      name: "packageManager",
      message: "Choose a package manager:",
      choices: ["npm", "yarn"],
      default: "npm",
    },
  ])

  try {
    console.log("A10ha by Atomic10 Studio".green.bold)
    console.log(
      `Creating new ${language} React project "${projectName}"...`.yellow
    )

    execSync(
      {
        npm: `npm create vite@latest ${projectName} ${
          language === "TypeScript"
            ? "-- --template react-ts"
            : "-- --template react"
        }`,
        yarn: `yarn create vite ${projectName} ${
          language === "TypeScript" ? "--template react-ts" : "--template react"
        }`,
      }[packageManager],
      { stdio: "inherit" }
    )

    // Set the project language in package.json
    const projectPath = join(process.cwd(), projectName)
    const pkgPath = join(projectPath, "package.json")
    const pkg = fs.readJSONSync(pkgPath)
    fs.writeJsonSync(pkgPath, { ...pkg, language }, { spaces: 2 })
    // Update App to only render a H1 and a P
    initApp(language, projectPath, projectName)
  } catch (err) {
    console.log("Failed to create project:", err.message.red.bold)
    process.exit(1)
  }
}

// Add Firebase setup
const addFirebase = async () => {
  validateReactProject()
  const { features } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "features",
      message: "Select Firebase features to configure:",
      choices: [
        { name: "Firestore", value: "firestore" },
        { name: "Authentication", value: "auth" },
        { name: "Storage", value: "storage" },
      ],
      default: ["firestore"],
    },
  ])

  if (features.length === 0) {
    console.log(
      "No Firebase features selected. Skipping Firebase setup.".yellow
    )
    return
  }

  installPackages(["firebase"])
  console.log("Firebase installed!".green)

  const language = getProjectLanguage()
  const fileName = language === "TypeScript" ? "firebase.ts" : "firebase.js"
  const firebaseFilePath = join(process.cwd(), "src", `${fileName}`)

  if (fs.existsSync(firebaseFilePath)) {
    backupFile(firebaseFilePath, fileName)
    console.log("Firebase exists. Skipping creation.".yellow)
  } else {
    writeFirebaseFiles(firebaseFilePath, features)

    console.log(
      `Created src/${
        language === "TypeScript" ? "firebase.ts" : "firebase.js"
      }. Update the .env file with your Firebase project details.`.green
    )
  }
}

// Add react-router setup with AST-based modification
const addReactRouter = async () => {
  validateReactProject()

  installPackages(["react-router-dom"])

  const language = getProjectLanguage()
  const fileName = language === "TypeScript" ? "App.tsx" : "App.jsx"
  const appFilePath = join(process.cwd(), "src", `${fileName}`)

  if (!fs.existsSync(appFilePath)) {
    console.log(`Error: src/App.${fileName} not found.`.red.bold)
    return
  }

  const { useExample } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useExample",
      message: "Add a basic react-router example to App.js?",
      default: true,
    },
  ])

  if (!useExample) {
    console.log("react-router-dom installed!".green)
    return
  }

  backupFile(appFilePath, fileName)

  // Read and parse the App.js file
  const source = fs.readFileSync(appFilePath, "utf8")
  const ast = j(source, { parser: babelParser })

  // Check for existing react-router imports
  let hasRouterImports = false
  ast.find(j.ImportDeclaration).forEach((path) => {
    if (path.node.source.value === "react-router-dom") hasRouterImports = true
  })

  // Add imports if not present
  if (!hasRouterImports) addImports(ast)

  // Add Home and About components
  addHomeAndAboutComponents(ast)

  // Find the App component and modify its return statement
  modifyAppComponent(ast)

  // Write the modified AST back to App.js
  fs.writeFileSync(appFilePath, ast.toSource({ quote: "single", tabWidth: 2 }))
  console.log(`Updated src/App.${fileName} with react-router example.`.green)
}

// Add netlify-functions setup
const addNetlifyFunctions = async () => {
  // 1. Validate this is a react project
  validateReactProject()

  const language = getProjectLanguage()

  // 2. Install the necessary packages
  installPackages(["@netlify/vite-plugin"])

  if (language === "TypeScript") {
    installPackages(["@netlify/functions"])
  }
  console.log("Netlify functions installed!".green)

  // 3. Modify the hello function file then write the modified AST back
  const helloFileName = language === "TypeScript" ? "hello.ts" : "hello.js"
  const helloFunctionFilePath = join(
    process.cwd(),
    "netlify",
    "functions",
    `${helloFileName}`
  )
  const source = fs.readFileSync(helloFunctionFilePath, "utf8")
  const ast = j(source, { parser: babelParser })

  writeHelloFunctionFile(ast)
  fs.writeFileSync(
    helloFunctionFilePath,
    ast.toSource({ quote: "single", tabWidth: 2 })
  )

  // 4. Modify the vite.config file
  const viteConfigFilePath = join(process.cwd(), "vite.config.ts")
  const viteConfigSource = fs.readFileSync(viteConfigFilePath, "utf8")
  const viteConfigAst = j(viteConfigSource, { parser: babelParser })
  modifyViteConfig(viteConfigAst)
  fs.writeFileSync(
    viteConfigFilePath,
    viteConfigAst.toSource({ quote: "single", tabWidth: 2 })
  )
  console.log(
    `Created your first function: netlify/functions/${
      language === "TypeScript" ? "hello.ts" : "hello.js"
    }.`.green
  )
}

// Add back4app setup
const addBack4App = async () => {
  // 1. Validate this is a react project
  validateReactProject()

  // 2. Install the necessary packages
  installPackages(["parse"])

  console.log("Back4App installed!".green)

  // 3. Modify the .env file
  const envFilePath = join(process.cwd(), ".env")
  const envFile = fs.readFileSync(envFilePath, "utf8")
  const envFileAst = j(envFile, { parser: babelParser })

  writeBack4AppFiles(envFileAst)
  fs.writeFileSync(
    envFilePath,
    envFileAst.toSource({ quote: "single", tabWidth: 2 })
  )
  console.log("Modified .env file with Back4App credentials.".green)

  // 4. Modify App file with Back4App initialization
  const language = getProjectLanguage()
  const fileName = language === "TypeScript" ? "App.tsx" : "App.jsx"
  const appFilePath = join(process.cwd(), "src", `${fileName}`)
  const appFile = fs.readFileSync(appFilePath, "utf8")
  const appFileAst = j(appFile, { parser: babelParser })

  modifyBack4AppInit(appFileAst)
  fs.writeFileSync(
    appFilePath,
    appFileAst.toSource({ quote: "single", tabWidth: 2 })
  )
  console.log("Modified App.js file with Back4App initialization.".green)
}

// CLI setup with commander.js
program.version("1.0.0").description(
  `A CLI tool to easily add tools to React projects\n
Supported tools:\n  - ${supportedTools.join("\n  - ")}\n
Coming soon:\n  - ${comingSoonTools.join("\n  - ")}`
)

program
  .command("init")
  .description("Initialize a new React project")
  .action(initProject)

program
  .command("add [tool]")
  .description(`Add a tool to a React project`)
  .action(async (tool) => {
    // If no tool specified, prompt the user to select one
    if (!tool) {
      const { selectedTool } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedTool",
          message: "Which tool would you like to add?",
          choices: supportedTools,
        },
      ])
      tool = selectedTool
    }

    switch (tool.toLowerCase()) {
      case "firebase":
        await addFirebase()
        break
      case "react-router":
        await addReactRouter()
        break
      case "netlify-functions":
        await addNetlifyFunctions()
        break
      case "back4app":
        await addBack4App()
        break
      default:
        console.log(
          `Unknown tool: ${tool}. Supported tools: ${supportedTools.join(", ")}`
            .red.bold
        )
        process.exit(1)
    }
  })

program.parse(process.argv)
