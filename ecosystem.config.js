module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
      },
      out_file: '/home/brilliant/hokela-360/logs/out.log',
      error_file: '/home/brilliant/hokela-360/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
