module.exports = ({ env }) => ({
    connection: {
        client: 'sqlite',
        connection: {
            filename: ".tmp/test.db"
        },
        debug: false,
        useNullAsDefault: true
    },
});
