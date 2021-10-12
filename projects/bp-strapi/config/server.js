module.exports = ({ env }) => ({
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 9000),
    url: "https://bp.bad-harzburg-stiftung.de/api/",   
    proxy: true,
    admin: {
	url: "https://bp.bad-harzburg-stiftung.de/api/admin",   
	auth: {
	    secret: env('ADMIN_JWT_SECRET', '83ed5783afea9091ed95606f08c3c2a0'),
	},
	autoOpen: false,
    },
});
