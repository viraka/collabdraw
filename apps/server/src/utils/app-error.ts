export enum ErrorCode {
  // =======================
  // ✅ GENERAL
  // =======================
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",

  // =======================
  // ✅ VALIDATION
  // =======================
  ZOD_VALIDATION_ERROR = "ZOD_VALIDATION_ERROR",
  INVALID_PAYLOAD = "INVALID_PAYLOAD",

  // =======================
  // ✅ AUTH
  // =======================
  AUTH_REQUIRED = "AUTH_REQUIRED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",

  // =======================
  // ✅ USER / ACCOUNT
  // =======================
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_CREATE_FAILED = "USER_CREATE_FAILED",
  TAG_COLLISION = "TAG_COLLISION",

  // =======================
  // ✅ ROOMS (FOR LATER)
  // =======================
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_ACCESS_DENIED = "ROOM_ACCESS_DENIED",
  ROOM_ALREADY_EXISTS = "ROOM_ALREADY_EXISTS",
  ROOM_FULL = "ROOM_FULL",

  // =======================
  // ✅ REAL-TIME (FOR LATER)
  // =======================
  WS_UNAUTHORIZED = "WS_UNAUTHORIZED",
  WS_ROOM_NOT_JOINED = "WS_ROOM_NOT_JOINED",
  DRAWING_SYNC_FAILED = "DRAWING_SYNC_FAILED",
}

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 400,
    code = ErrorCode.UNKNOWN_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
