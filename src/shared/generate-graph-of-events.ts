import { AsyncApiDocument } from 'nestjs-asyncapi';

export const generateGraphOfEvents = async (document: AsyncApiDocument) => {
  const obj = {
    nodes: [],
    edges: [],
  };

  Object.keys(document.channels).forEach((channel) => {
    Object.keys(document.channels[channel]).forEach((type) => {
      const node = document.channels?.[channel]?.[type];
      if (!node) return;
      const refSchema = (node?.message?.payload?.$ref as string)
        ?.split('/')
        .at(-1);
      const schema = document.components?.schemas?.[refSchema ?? ''];
      obj.nodes.push({
        name: node?.message?.name,
        type,
        channel,
        message: schema,
      });
    });
  });

  return obj;
};
