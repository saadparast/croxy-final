module.exports = {
  apps: [
    {
      name: 'croxy-backend',
      script: 'backend-server.cjs',
      cwd: '/home/user/webapp',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/home/user/webapp/logs/backend-error.log',
      out_file: '/home/user/webapp/logs/backend-out.log',
      log_file: '/home/user/webapp/logs/backend-combined.log',
      time: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        JWT_SECRET: 'croxy-exim-secret-key-2024'
      }
    },
    {
      name: 'croxy-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      max_restarts: 5,
      min_uptime: '10s',
      error_file: '/home/user/webapp/logs/frontend-error.log',
      out_file: '/home/user/webapp/logs/frontend-out.log',
      log_file: '/home/user/webapp/logs/frontend-combined.log',
      time: true,
      env: {
        NODE_ENV: 'development',
        PORT: 5173
      }
    }
  ]
};