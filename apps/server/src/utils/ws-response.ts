// import { WebSocket } from "ws";

// export function wsSuccess<T>(socket: WebSocket, data: T, message = "Success") {
//   socket.send(
//     JSON.stringify({
//       success: true,
//       message,
//       data,
//     })
//   );
// }

// export function wsFailure(
//   socket: WebSocket,
//   message = "Something went wrong",
//   code = "WS_ERROR",
//   details?: unknown,
//   close = false
// ) {
//   const payload = {
//     success: false,
//     message,
//     error: {
//       code,
//       details,
//     },
//   };

//   socket.send(JSON.stringify(payload));

//   if (close) {
//     socket.close();
//   }
// }
