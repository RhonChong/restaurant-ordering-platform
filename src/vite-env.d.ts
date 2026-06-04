// src/global.d.ts (或者 src/vite-env.d.ts)

// 声明所有图片模块，允许 TypeScript 识别 .png, .jpg, .svg 等导入
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}