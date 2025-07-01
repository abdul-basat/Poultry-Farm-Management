declare module "*.ttf" {
  const src: string;
  export default src;
}

declare module "fontkit";
// declaration not needed anymore after reverting path 

declare module "*.ttf?url" {
  const src: string;
  export default src;
}

declare module "*.woff" {
  const src: string;
  export default src;
}

declare module "*.woff?url" {
  const src: string;
  export default src;
} 