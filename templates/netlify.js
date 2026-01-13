import j from "jscodeshift"

export const writeHelloFunctionFile = (ast) => {
  j.exportNamedDeclaration(
    j.variableDeclaration("const", [
      j.variableDeclarator(
        j.identifier("handler"),
        j.arrowFunctionExpression(
          [j.identifier("event"), j.identifier("context")],
          j.blockStatement([
            j.returnStatement(
              j.newExpression(j.identifier("Response"), [
                j.literal("Hello, world!"),
                j.objectExpression([j.property("status", j.literal(200))]),
              ])
            ),
          ])
        )
      ),
    ]),
    []
  )

  ast.find(j.Program).get("body").push(handler)
}

export const modifyViteConfig = (ast) => {
  const importStatement = j.importDeclaration(
    [j.importSpecifier(j.identifier("netlify"), j.identifier("netlify"))],
    j.literal("@netlify/vite-plugin")
  )
  ast.find(j.Program).get("body").push(importStatement)
  const pluginStatement = j.expressionStatement(
    j.callExpression(j.identifier("netlify"), [])
  )
  ast.find(j.Program).get("body").push(pluginStatement)
}
