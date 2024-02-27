import Ably from 'ably';

const ablyClient = new Ably.Rest.Promise({
  key: process.env.ABLY_PUBLISH_KEY,
});

export default ablyClient;
