declare namespace HeaderModuleScssNamespace {
  export interface IHeaderModuleScss {
    dropdown: string;
    dropdownComponent: string;
    dropdownComponentTransformL: string;
    dropdownComponentTransformR: string;
    iconButton: string;
    nav: string;
    navItem: string;
    navbar: string;
  }
}

declare const HeaderModuleScssModule: HeaderModuleScssNamespace.IHeaderModuleScss;

export = HeaderModuleScssModule;
