import { Strapi } from '@strapi/strapi';
import { env } from '@strapi/utils';

export const initializeEmailSettings = async ({ strapi }: { strapi: Strapi }) => {
  const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });

  const email = await pluginStore.get({ key: 'email' });
  await pluginStore.set({
    key: 'email',
    value: {
      ...email,
      reset_password: {
        ...email.reset_password,
        options: {
          ...email.reset_password.options,
          from: {}, // use default
          response_email: '',
          object: 'Passwort setzen/zurücksetzen',
          message: `<p>Sie erhalten diese E-Mail, weil Sie Ihr Passwort auf Harz History zurücksetzen
oder Sie dieses erstmalig setzen wollen. Falls dies nicht der Fall ist,
ignorieren Sie diese E-Mail bitte.</p>

<p>Sie können hier Ihr Passwort setzen/zurücksetzen:</p>
<p><a href="<%= URL %>?token=<%= TOKEN %>"><%= URL %></a></p>

<p>Danke.</p>`,
        },
      },
    },
  });

  const advanced = await pluginStore.get({ key: 'advanced' });
  await pluginStore.set({
    key: 'advanced',
    value: {
      ...advanced,
      email_reset_password: env('PASSWORD_RESET_URL'),
      // only used internally by addUser in ../api/parameterized-permission/services/custom-update.ts
      allow_register: true,
    },
  });
};
