import Ably from 'ably';

// Get the Ably publish key from environment variable and fix any escaping issues
const ablyPublishKey = process.env.ABLY_PUBLISH_KEY?.replace(/\\(_|\.)/g, '$1');

console.log('Server Ably key (first few chars):', ablyPublishKey?.substring(0, 10) + '...');

const ablyClient = new Ably.Rest.Promise({
  key: ablyPublishKey,
});

export default ablyClient;
