declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      JWT_SECRET: string;
      SESSION_SECRET: string;
      COOKIE_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
