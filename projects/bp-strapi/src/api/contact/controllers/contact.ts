import { contact } from "../services/contact";

export default {
  contact: async (ctx: any) => {
    return await contact({ ...ctx.request.body, ctx });
  },
};
