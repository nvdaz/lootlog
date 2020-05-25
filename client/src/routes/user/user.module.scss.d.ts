declare namespace UserModuleScssNamespace {
  export interface IUserModuleScss {
    container: string;
    containerFlex: string;
    graphContainer: string;
    graphTitle: string;
    sidebarContainer: string;
    tableContainer: string;
    tooltipContainer: string;
    tooltipSub: string;
    tooltipTitle: string;
    username: string;
  }
}

declare const UserModuleScssModule: UserModuleScssNamespace.IUserModuleScss;

export = UserModuleScssModule;
