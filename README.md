# ts-metadata

> typescript 元数据操作, 提取/删除

## Install

```bash
npm install --save ts-metadata
```

## Usage

```typescript
import ts from "typescript";
import Compiler from "ts-metadata";

const compiler = new Compiler({
  enableLog: true,
  rootNames: ['xxx.ts'],
  options: {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS,
  },
});

compiler.getMetadataByDecorator({
  classDecorators: ["Component", "InputType", "Props"],
  propsDecorators: ["Design", "Foo"],
});
```

## License

MIT © [galaa2011](https://github.com/galaa2011)
