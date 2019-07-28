import { injectable } from 'smart-factory';
import { ConfigModules } from './modules';
import { ConfigTypes } from './types';

export { ConfigModules } from './modules';
export { ConfigTypes } from './types';

injectable(ConfigModules.EmptyConfig, [], async (): Promise<ConfigTypes.RootConfig> => ({
  amqp: {
    host: null,
    port: null,
    login: null,
    password: null
  },
  topic: {
    matchCommandQueue: null
  },
  extapi: {
    messageBaseUri: null
  },
  mysql: {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null,
    connectionLimit: null
  }
}));

// configuration rules.
injectable(ConfigModules.ConfigRules, [],
  async (): Promise<ConfigTypes.ConfigRule[]> => ([
    { key: 'AMQP_HOST', path: ['amqp', 'host'] },
    { key: 'AMQP_PORT', path: ['amqp', 'port'] },
    { key: 'AMQP_LOGIN', path: ['amqp', 'login']  },
    { key: 'AMQP_PASSWORD', path: ['amqp', 'password'] },
    { key: 'TOPIC_MATCH_COMMAND_QUEUE', path: ['topic', 'matchCommandQueue'] },
    { key: 'MYSQL_HOST', path: ['mysql', 'host'] },
    { key: 'MYSQL_PORT', path: ['mysql', 'port'] },
    { key: 'MYSQL_USER', path: ['mysql', 'user'] },
    { key: 'MYSQL_PASSWORD', path: ['mysql', 'password'] },
    { key: 'MYSQL_DATABASE', path: ['mysql', 'database'] },
    { key: 'MYSQL_CONNECTION_LIMIT', path: ['mysql', 'connectionLimit'], defaultValue: 10 },
    { key: 'EXTAPI_MESSAGE_URI', path: ['extapi', 'messageBaseUri'] }
  ]));

injectable(ConfigModules.ConfigSource,
  [ConfigModules.ConfigReader],
  async (read: ConfigTypes.ConfigReader) => read());

injectable(ConfigModules.RootConfig,
  [ConfigModules.ConfigParser,
   ConfigModules.ConfigSource,
   ConfigModules.ConfigRules],
  async (parse: ConfigTypes.ConfigParser,
    src: ConfigTypes.ConfigSource,
    rules: ConfigTypes.ConfigRule[]): Promise<ConfigTypes.RootConfig> => parse(src, rules));

injectable(ConfigModules.AmqpConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.amqp);

injectable(ConfigModules.TopicConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.topic);

injectable(ConfigModules.MysqlConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.mysql);

injectable(ConfigModules.ExtApiConfig,
  [ConfigModules.RootConfig],
  async (root: ConfigTypes.RootConfig) => root.extapi);

injectable(ConfigModules.Env,
  [ConfigModules.ConfigSource],
  async (src: ConfigTypes.ConfigSource) => {
    const envExpr = src['NODE_ENV'];
    if (!envExpr || envExpr === 'production') return ConfigTypes.Env.DEV;
    return ConfigTypes.Env.PROD;
  });