import { resolve } from "path";
import ts from "typescript";
import Compiler from "../src/index";

const compiler = new Compiler({
  enableLog: true,
  rootNames: [resolve(__dirname, "./template.tsx")],
  options: {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS,
  },
});

compiler.getMetadataByDecorator({
  classDecorators: ["Component", "InputType", "Props"],
  propsDecorators: ["Design", "Foo"],
});
