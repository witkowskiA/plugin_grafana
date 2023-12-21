import { PanelPlugin, PanelProps } from '@grafana/data';

import { PanelJson } from './components/PanelJson';

export const plugin = new PanelPlugin<PanelProps>(PanelJson).setPanelOptions((builder) => {
  return builder.addTextInput({
    path: 'text',
    name: 'Json panel',
    description: 'Description of panel option',
    defaultValue: 'Default value of text input option',
  });
  
});
