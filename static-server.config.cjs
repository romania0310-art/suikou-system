module.exports = {
  apps: [
    {
      name: 'static-webapp',
      script: 'npx',
      args: 'http-server . -p 3000 -a 0.0.0.0',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}