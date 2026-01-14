import j from "jscodeshift"

export const writeBack4AppEnvFile = (ast) => {
  ast
    .find(j.Program)
    .get("body")
    .push(j.expressionStatement(j.literal("VITE_APP_PARSE_APPLICATION_ID=")))
  ast
    .find(j.Program)
    .get("body")
    .push(j.expressionStatement(j.literal("VITE_APP_PARSE_JAVASCRIPT_KEY=")))
}

export const modifyBack4AppInit = (ast) => {
  // Insert the Parse import right after the last existing import
  const importDeclarations = ast.find(j.ImportDeclaration)

  if (importDeclarations.size() > 0) {
    importDeclarations
      .at(-1)
      .insertAfter(
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier("Parse"))],
          j.literal("parse/dist/parse.min.js")
        ),
        j.emptyStatement(),
        j.expressionStatement(
          j.literal(
            "Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);"
          )
        ),
        j.expressionStatement(
          j.literal("Parse.serverURL ='https://parseapi.back4app.com/';")
        ),
        j.emptyStatement()
      )
  } else {
    // If there are no imports, insert at the top
    ast
      .get("body")
      .unshift(
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier("Parse"))],
          j.literal("parse/dist/parse.min.js")
        ),
        j.emptyStatement(),
        j.expressionStatement(
          j.literal(
            "Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);"
          )
        ),
        j.expressionStatement(
          j.literal("Parse.serverURL ='https://parseapi.back4app.com/';")
        ),
        j.emptyStatement()
      )
  }
}
