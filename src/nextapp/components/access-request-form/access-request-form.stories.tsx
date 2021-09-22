import * as React from 'react';

import AccessRequestForm from './access-request-dialog';

export default {
  title: 'APS/AccessRequestForm',
};

const Template = (props) => <AccessRequestForm {...props} />;

export const Dialog = Template.bind({});
Dialog.args = {
  open: true,
};

export const GenerateSecretsTab = Template.bind({});
GenerateSecretsTab.args = {
  open: true,
  defaultTab: 1,
};
