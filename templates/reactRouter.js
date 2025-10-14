import j from "jscodeshift"

export const addImports = (ast) => {
  const importStatement = j.importDeclaration(
    [
      j.importSpecifier(j.identifier("BrowserRouter")),
      j.importSpecifier(j.identifier("Routes")),
      j.importSpecifier(j.identifier("Route")),
    ],
    j.literal("react-router-dom")
  )
  ast.find(j.Program).get("body").unshift(importStatement)
}

export const addHomeAndAboutComponents = (ast) => {
  const homeComponent = j.variableDeclaration("const", [
    j.variableDeclarator(
      j.identifier("Home"),
      j.arrowFunctionExpression(
        [],
        j.blockStatement([
          j.returnStatement(
            j.jsxElement(
              j.jsxOpeningElement(j.jsxIdentifier("h2"), [], true),
              null,
              [j.jsxText("Home Page")]
            )
          ),
        ])
      )
    ),
  ])
  const aboutComponent = j.variableDeclaration("const", [
    j.variableDeclarator(
      j.identifier("About"),
      j.arrowFunctionExpression(
        [],
        j.blockStatement([
          j.returnStatement(
            j.jsxElement(
              j.jsxOpeningElement(j.jsxIdentifier("h2"), [], true),
              null,
              [j.jsxText("About Page")]
            )
          ),
        ])
      )
    ),
  ])
  ast.find(j.Program).get("body").push(homeComponent, aboutComponent)
}

export const modifyAppComponent = (ast) => {
  let modified = false
  ast.find(j.FunctionDeclaration, { id: { name: "App" } }).forEach((path) => {
    const returnStatement = path.node.body.body.find(
      (node) => node.type === "ReturnStatement"
    )

    if (returnStatement) {
      // Check if already wrapped in Router
      let isRouterWrapped = false
      j(returnStatement)
        .find(j.JSXElement)
        .forEach((jsxPath) => {
          if (
            jsxPath.node.openingElement.name.name === "Router" ||
            jsxPath.node.openingElement.name.name === "BrowserRouter"
          ) {
            isRouterWrapped = true
          }
        })

      if (!isRouterWrapped) {
        const newReturn = j.returnStatement(
          j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("BrowserRouter"), [], false),
            j.jsxClosingElement(j.jsxIdentifier("BrowserRouter")),
            [
              j.jsxElement(
                j.jsxOpeningElement(j.jsxIdentifier("Routes"), [], false),
                j.jsxClosingElement(j.jsxIdentifier("Routes")),
                [
                  j.jsxElement(
                    j.jsxOpeningElement(
                      j.jsxIdentifier("Route"),
                      [
                        j.jsxAttribute(j.jsxIdentifier("path"), j.literal("/")),
                        j.jsxAttribute(
                          j.jsxIdentifier("element"),
                          j.jsxExpressionContainer(
                            j.jsxElement(
                              j.jsxOpeningElement(
                                j.jsxIdentifier("Home"),
                                [],
                                true
                              ),
                              null,
                              []
                            )
                          )
                        ),
                      ],
                      false
                    ),
                    j.jsxClosingElement(j.jsxIdentifier("Route")),
                    []
                  ),
                  j.jsxElement(
                    j.jsxOpeningElement(
                      j.jsxIdentifier("Route"),
                      [
                        j.jsxAttribute(
                          j.jsxIdentifier("path"),
                          j.literal("/about")
                        ),
                        j.jsxAttribute(
                          j.jsxIdentifier("element"),
                          j.jsxExpressionContainer(
                            j.jsxElement(
                              j.jsxOpeningElement(
                                j.jsxIdentifier("About"),
                                [],
                                true
                              ),
                              null,
                              []
                            )
                          )
                        ),
                      ],
                      false
                    ),
                    j.jsxClosingElement(j.jsxIdentifier("Route")),
                    []
                  ),
                ]
              ),
            ]
          )
        )
        returnStatement.argument = newReturn.argument
        modified = true
      }
    }
  })

  if (!modified) {
    console.log(
      "App.js already contains Router or could not be modified safely."
    )
    return
  }
}
