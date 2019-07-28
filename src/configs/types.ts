export namespace ConfigTypes {
  export type RootConfig = {
    amqp: AmqpConfig;
    topic: TopicConfig;
    extapi: ExtApiConfig;
    mysql: MysqlConfig;
  };
  export type AmqpConfig = {
    host: string;
    port: number;
    login: string;
    password: string;
  };
  export enum Env {
    DEV = 'DEV',
    PROD = 'PROD'
  }
  export type ConfigRule = {
    key: string;
    path: string[];
    defaultValue?: any;
  };
  export type TopicConfig = {
    matchCommandQueue: string;
  };
  export type ExtApiConfig = {
    messageBaseUri: string;
  };
  export type MysqlConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
  };

  export type ConfigSource = {[key: string]: any};
  export type ConfigReader = () => Promise<ConfigSource>;
  export type ConfigParser = (src: ConfigSource, rules: ConfigRule[]) => RootConfig;
  export type EnvReader = (src: ConfigSource) => Env;
}