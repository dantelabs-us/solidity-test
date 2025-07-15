module.exports = {
    apps: [{
        name: "blockchain-backend",
        script: "npm",
        args: "start",
        env: {
            NODE_ENV: "production",
        },
        exp_backoff_restart_delay: 100,
        restart_delay: 3000,
        min_uptime: 5000,
        max_restarts: 10
    }]
}