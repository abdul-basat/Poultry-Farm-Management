declare module "*.ttf" {
  const src: string;
  export default src;
}

declare module "fontkit";
// declaration not needed anymore after reverting path 