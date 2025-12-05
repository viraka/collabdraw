export type ApiResponse<T> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      error: {
        code: string;
        details?: unknown;
      };
    };
