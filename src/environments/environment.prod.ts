export const environment = {
  production: true,
  PUSHER: {
    PUSHER_APP_ID: 'laravel.chat.app',
    PUSHER_APP_KEY: 'ws-chat-app-key',
    PUSHER_APP_SECRET: 'ws-laravel-chat-secret-key',
    PUSHER_APP_CLUSTER: 'mt1',
    PUSHER_APP_PATH: 'http://api.chat.dev.com',
    PUSHER_WS_HOST: 'api.chat.dev.com',
    PUSHER_WS_PORT: 6001,
    PUSHER_ENABLED_TRANSPORTS: ['ws']
  },
  URLS: {
    URL_BASE: 'http://api.chat.dev.com',
    URL_API: 'http://api.chat.dev.com/api'
  }
};
