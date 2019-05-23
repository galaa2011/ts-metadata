/*
 * @File: ts 元数据编译器
 * @Author: galaa2011@163.com
 * @Date: 2019-05-23 15:50:39
 */
import fs from "fs";
import ts from "typescript";

interface IObject {
  [key: string]: any;
}

interface IDecorator {
  classDecorators: string[];
  propsDecorators: string[];
}

interface IExpression extends ts.Expression {
  text: string;
}
interface IOptions {
  enableLog?: boolean;
  /* 编译入口目录，可以是数组 */
  rootNames: string[];
  /* ts编译选项 */
  options: ts.CompilerOptions;
}
/**
 * 编译器工厂
 *
 * @class Compiler
 */
class Compiler {
  public rootNames: string[];
  public options: ts.CompilerOptions;
  protected enableLog: boolean;

  private _output: IObject = {};
  private _checker!: ts.TypeChecker;
  private _decorator!: IDecorator;

  constructor(options: IOptions) {
    this.enableLog = options.enableLog || false;
    this.rootNames = options.rootNames;
    this.options = options.options;
  }

  public getMetadataByDecorator(decorator: IDecorator) {
    this._decorator = decorator;
    // 创建项目
    const program = ts.createProgram(this.rootNames, this.options);
    // 获取检查器，我们将使用它来查找有关类的更多信息 (这句不加，后面的node.getText()会报错...)
    this._checker = program.getTypeChecker();

    for (const sourceFile of program.getSourceFiles()) {
      // 排除`.d.ts`的声明文件
      if (!sourceFile.isDeclarationFile) {
        ts.forEachChild(sourceFile, this._visit.bind(this));
      }
    }

    if (process.env.NODE_ENV === "test") {
      fs.writeFile("out.json", JSON.stringify(this._output, null, 2), this._log.bind(this));
    }
    return this._output;
  }

  private _visit(node: ts.Node) {
    if (!this._isNodeExported(node)) {
      this._log("isNodeExported: ------\n", node.getText());
      return;
    }
    if (ts.isImportDeclaration(node)) {
      this._log("import: ------\n", node.getText());
      if (node.importClause && node.importClause.namedBindings) {
        const namedBindings = node.importClause.namedBindings as ts.NamedImports;
        namedBindings.elements && namedBindings.elements.forEach((el) => {
          if (el.propertyName) {
            this._log(el.propertyName.text);
          }
        });
      }
    }
    if (ts.isClassDeclaration(node) && node.name) {
      this._log("class: ------\n", node.getText());
      if (node.decorators) {
        node.decorators.map(d => {
          const decoratorName = this._getDecoratorName(d);
          if (this._decorator.classDecorators.indexOf(decoratorName) !== -1) {
            const declaration: any = {};
            if (!this._output[decoratorName]) {
              this._output[decoratorName] = [];
            }
            const expression = d.expression as ts.CallExpression;
            const arg = expression.arguments[0];
            if (arg) {
              const type = this._checker.getTypeAtLocation(arg);
              type.getProperties().forEach(symbol => {
                const valueDeclaration = symbol.valueDeclaration as ts.PropertyDeclaration;
                if (valueDeclaration.initializer) {
                  declaration[symbol.name] = (valueDeclaration.initializer as IExpression).getText();
                }
              });
            }
            // 开始解析属性
            if (node.members) {
              node.members.forEach(m => {
                this._serializeMember(m, declaration);
              });
            }
            this._output[decoratorName].push(declaration);
          }
        });
      }
    }
  }

  private _isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

  private _serializeMember(member: ts.ClassElement, declaration: any) {
    if (member.decorators) {
      let prop: any = {};
      const symbol = this._checker.getSymbolAtLocation((member as ts.PropertyDeclaration).name);
      if (symbol) {
        const type = this._checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        prop = {
          name: symbol.name,
          returnType: this._checker.typeToString(type),
        };
      }
      member.decorators.forEach(d => {
        const decoratorName = this._getDecoratorName(d);
        if (!declaration[decoratorName]) {
          declaration[decoratorName] = [];
        }
        if (this._decorator.propsDecorators.indexOf(decoratorName) !== -1) {
          const expression = d.expression as ts.CallExpression;
          const arg = expression.arguments[0];
          const description: IObject = {};
          eval(`description = ${arg.getText()}`);
          // const type = this._checker.getTypeAtLocation(arg);
          prop = {
            ...prop,
            ...description,
          };
          declaration[decoratorName].push(prop);
        }
      });
    }
  }

  /**
   * 根据decorator获取对应的name
   *
   * @param {ts.Decorator} decorator
   * @returns {string}
   */
  private _getDecoratorName(decorator: ts.Decorator): string {
    let decoratorName: string;
    if (ts.isIdentifier(decorator.expression)) {
      // 无参数情况
      decoratorName = decorator.expression.text;
    } else {
      const expression = decorator.expression as ts.CallExpression;
      decoratorName = (expression.expression as ts.Identifier).text;
    }
    return decoratorName;
  }

  /**
   * 打印日志
   *
   * @private
   * @param {...any} args
   * @memberof Compiler
   */
  private _log(...args: any) {
    if (this.enableLog || process.env.NODE_ENV === "test") {
      console.log.apply(console, args);
    }
  }
}

export default Compiler;
