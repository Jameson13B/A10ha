import path from "path"
import fs from "fs-extra"
import j from "jscodeshift"
import recast from "recast/parsers/babel.js"

export const initApp = (language, projectPath, projectName) => {
  const appFilePath = path.join(
    projectPath,
    "src",
    `${language === "TypeScript" ? "App.tsx" : "App.jsx"}`
  )
  const appFile = fs.readFileSync(appFilePath, "utf8")
  const ast = j(appFile, { parser: recast })
  // Remove imports
  ast.find(j.ImportDeclaration).forEach((path) => {
    if (
      path.node.source.value === "react" ||
      path.node.source.value === "./assets/react.svg" ||
      path.node.source.value === "/vite.svg"
    ) {
      j(path).remove()
    }
  })

  // Update App to only render a H1 and a P
  ast.find(j.FunctionDeclaration, { id: { name: "App" } }).forEach((path) => {
    path.node.body.body = [
      j.returnStatement(
        j.jsxFragment(j.jsxOpeningFragment(), j.jsxClosingFragment(), [
          j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("h1"), [], false),
            j.jsxClosingElement(j.jsxIdentifier("h1")),
            [
              j.literal(
                `${projectName}: ${language} project created with A10ha`
              ),
            ]
          ),
          j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("p"), [], false),
            j.jsxClosingElement(j.jsxIdentifier("p")),
            [
              j.literal(
                `Edit <code>src/App.${
                  language === "TypeScript" ? "tsx" : "jsx"
                }</code> to start creating!`
              ),
            ]
          ),
        ])
      ),
    ]
  })
  fs.writeFileSync(appFilePath, ast.toSource({ quote: "single" }))

  // remove src/assets/react.svg, /vite.svg files, and create empty src/bak directory
  fs.unlinkSync(path.join(projectPath, "src", "assets", "react.svg"))
  fs.unlinkSync(path.join(projectPath, "public", "vite.svg"))
  fs.mkdirSync(path.join(projectPath, "src", "bak"))
}
