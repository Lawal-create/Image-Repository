declare namespace NodeJS {
  // Merge the existing `ProcessEnv` definition with ours
  // Any variable declared in the .env file here should be typed in the interface below
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    MONGO_URI: string;
  }
}
