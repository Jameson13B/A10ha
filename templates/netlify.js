import j from "jscodeshift"

export const writeHelloFunctionFile = (ast) => {
  ast
    .find(j.Program)
    .get("body")
    .push(
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
    )
}

export const modifyViteConfig = (ast) => {
  ast
    .find(j.Program)
    .get("body")
    .push(
      j.importDeclaration(
        [j.importSpecifier(j.identifier("netlify"), j.identifier("netlify"))],
        j.literal("@netlify/vite-plugin")
      )
    )

  ast.find(j.ObjectProperty, { key: { name: "plugins" } }).forEach((path) => {
    if (j.ArrayExpression.check(path.node.value)) {
      path.node.value.elements.push(j.identifier("netlify"))
    }
  })
}
