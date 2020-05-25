declare namespace HomeModuleScssNamespace {
  export interface IHomeModuleScss {
    container: string;
    containerFlex: string;
    separator: string;
    subtitle: string;
    title: string;
  }
}

declare const HomeModuleScssModule: HomeModuleScssNamespace.IHomeModuleScss;

export = HomeModuleScssModule;
