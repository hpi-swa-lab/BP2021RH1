module.exports = {
  routes: [
    {
      method: "POST",
      path: "/contact",
      handler: "contact.contact",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
