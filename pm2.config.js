module.exports = {
  apps: [
    {
      name: '[SIGSAUDE]-APP',
      script: './dist/main.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules', 'public', 'tmp', '.git', 'uploads'],
      max_memory_restart: '500M',
      autorestart: true,
      node_args: ['--max_old_space_size=500'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
