declare namespace GlobalModuleScssNamespace {
  export interface IGlobalModuleScss {
    container: string;
    graphContainer: string;
    graphTitle: string;
    tooltipContainer: string;
    tooltipSub: string;
    tooltipTitle: string;
  }
}

declare const GlobalModuleScssModule: GlobalModuleScssNamespace.IGlobalModuleScss;

export = GlobalModuleScssModule;
