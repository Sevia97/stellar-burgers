import type { Middleware, MiddlewareAPI } from 'redux';
import type { AppDispatch, RootState } from '../store';

export type TWsActionTypes = {
  wsInit: string;
  wsSendMessage?: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
  wsClose?: string;
};

type TWsAction = {
  type: string;
  payload?: any;
};

export const socketMiddleware = (wsActions: TWsActionTypes): Middleware =>
  ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let isManualClose = false;
    return (next) => (action: TWsAction) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const { wsInit, wsSendMessage, onOpen, onClose, onError, onMessage } =
        wsActions;

      console.log('WebSocket middleware action:', type);

      if (type === wsInit) {
        console.log('WebSocket: INIT - Creating connection to', payload);

        if (socket) {
          console.log('WebSocket: Closing previous connection');
          socket.close();
        }

        isManualClose = false;
        socket = new WebSocket(payload);
      }

      if (socket) {
        socket.onopen = () => {
          console.log('WebSocket: OPEN - Connection established');
          dispatch({ type: onOpen });
        };

        socket.onmessage = (event) => {
          console.log('WebSocket: MESSAGE received');
          const { data } = event;
          const parsedData = JSON.parse(data);
          console.log('WebSocket data:', parsedData);

          const { success, ...restParsedData } = parsedData;

          if (success) {
            dispatch({ type: onMessage, payload: restParsedData });
          } else {
            dispatch({ type: onError, payload: parsedData.message });
          }
        };

        socket.onerror = (event) => {
          console.error('WebSocket: ERROR - Connection error', event);
          if (!isManualClose) {
            dispatch({ type: onError, payload: 'WebSocket connection error' });
          }
        };

        socket.onclose = (event) => {
          console.log(
            'WebSocket: CLOSE - Connection closed',
            event.code,
            event.reason
          );
          if (!isManualClose) {
            dispatch({ type: onClose });
          }
        };

        if (type === wsSendMessage) {
          const message = payload;
          socket.send(JSON.stringify(message));
        }

        if (type === onClose) {
          console.log('WebSocket: Manual close requested');
          isManualClose = true;

          setTimeout(() => {
            if (socket) {
              console.log('WebSocket: Actually closing socket');
              socket.close();
              socket = null;
            }
          }, 300);
        }
      }

      next(action);
    };
  }) as Middleware;
