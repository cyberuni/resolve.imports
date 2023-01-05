export const ERR_INVALID_MODULE_SPECIFIER = createErrorType(
  `ERR_INVALID_MODULE_SPECIFIER`,
  (request, reason, base = undefined) => `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ``}`,
  TypeError
)

export const ERR_PACKAGE_IMPORT_NOT_DEFINED = createErrorType(
  'ERR_PACKAGE_IMPORT_NOT_DEFINED',
  (specifier: string, packagePath?: string, base?: string) => `Package import specifier "${specifier}" is not defined${packagePath
    ? ` in package ${packagePath}/package.json`
    : ''
    }${base ? ` imported from ${base}` : ``}`,
  TypeError
)

function createErrorType(code: string, messageCreator: (...args: any[]) => string, errorType: new (...args: any[]) => Error) {
  return class extends errorType {
    code: string
    constructor(...args: any[]) {
      super(messageCreator(...args))
      this.code = code
      this.name = `${errorType.name} [${code}]`
    }
  }
}

export function assert(condition: boolean, message?: string) {
  if (!condition) throw new Error(message)
}
