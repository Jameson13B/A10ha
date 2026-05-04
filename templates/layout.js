import fs from "fs-extra"
import j from "jscodeshift"
import babelParser from "recast/parsers/babel.js"

/** Recast rarely prints hand-attached comments without parse loc; keep docs as text. */
const LAYOUT_ANTD_DOC_LINES = [
  "// antd component docs (re-exports below):",
  "//   Layout — https://ant.design/components/layout/",
  "//   Divider — https://ant.design/components/divider/",
  "//   Flex — https://ant.design/components/flex/",
  "//   Space — https://ant.design/components/space/",
].join("\n")

export const writeLayoutFiles = (layoutFilePath) => {
  // Check if file exists, if not, create with an empty program
  if (!fs.existsSync(layoutFilePath)) {
    fs.writeFileSync(layoutFilePath, "")
  }
  const layoutFile = fs.readFileSync(layoutFilePath, "utf8")
  const layoutFileAst = j(layoutFile, { parser: babelParser })

  const importStatement = j.importDeclaration(
    [
      j.importSpecifier(j.identifier("Layout")),
      j.importSpecifier(j.identifier("Divider")),
      j.importSpecifier(j.identifier("Flex")),
      j.importSpecifier(j.identifier("Space")),
    ],
    j.literal("antd"),
  )
  layoutFileAst.find(j.Program).get("body").unshift(importStatement)

  const exportStatement = j.exportNamedDeclaration(null, [
    j.exportSpecifier.from({
      local: j.identifier("Layout"),
      exported: j.identifier("Site"),
    }),
    j.exportSpecifier.from({
      local: j.identifier("Divider"),
      exported: j.identifier("Seperator"),
    }),
    j.exportSpecifier.from({
      local: j.identifier("Flex"),
      exported: j.identifier("Box"),
    }),
    j.exportSpecifier.from({
      local: j.identifier("Space"),
      exported: j.identifier("Gap"),
    }),
  ])
  layoutFileAst.find(j.Program).get("body").push(exportStatement)

  let source = layoutFileAst.toSource({ quote: "single", tabWidth: 2 })
  const antdImport = "from 'antd';"
  if (
    source.includes(antdImport) &&
    !source.includes("// antd component docs (re-exports below):")
  ) {
    const at = source.indexOf(antdImport) + antdImport.length
    source = `${source.slice(0, at)}\n\n${LAYOUT_ANTD_DOC_LINES}\n${source.slice(at)}`
  }

  fs.writeFileSync(layoutFilePath, source)
}
