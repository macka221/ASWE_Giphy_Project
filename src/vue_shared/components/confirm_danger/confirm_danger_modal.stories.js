/* eslint-disable @gitlab/require-i18n-strings */
import ConfirmDanger from './confirm_danger.vue';

export default {
  component: ConfirmDanger,
  title: 'vue_shared/components/modals/confirm_danger_modal',
};

const Template = (args, { argTypes }) => ({
  components: { ConfirmDanger },
  props: Object.keys(argTypes),
  template: '<confirm-danger v-bind="$props" />',
  provide: {
    additionalInformation: args.additionalInformation || null,
    confirmDangerMessage: args.confirmDangerMessage || 'You require more Vespene Gas',
    htmlConfirmationMessage: args.confirmDangerMessage || false,
  },
});

export const Default = Template.bind({});
Default.args = {
  phrase: 'You must construct additional pylons',
  buttonText: 'Confirm button text',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const AdditionalInformation = Template.bind({});
AdditionalInformation.args = {
  ...Default.args,
  additionalInformation: 'This replaces the default warning information',
};

export const HtmlMessage = Template.bind({});
HtmlMessage.args = {
  ...Default.args,
  confirmDangerMessage: 'You strongly require more <strong>Vespene Gas</strong>',
  htmlConfirmationMessage: true,
};
