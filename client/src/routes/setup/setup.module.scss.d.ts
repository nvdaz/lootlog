declare namespace SetupModuleScssNamespace {
  export interface ISetupModuleScss {
    container: string;
    containerFlex: string;
    link: string;
    step: string;
  }
}

declare const SetupModuleScssModule: SetupModuleScssNamespace.ISetupModuleScss;

export = SetupModuleScssModule;
