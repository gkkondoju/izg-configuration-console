export class TestResponseMessages {
  public static readonly TCP_TIMEOUT =
    "The connection timed out.  Your endpoint must whitelist connections from {IZGW-ip-address}.";
  public static readonly TCP_REJECT =
    "The connection was rejected. Your endpoint must whitelist connections from {IZGW-ip-address}.";
  public static readonly DNS_LOOKUP_FAIL = (url: string) =>
    `There is no available DNS entry for ${url}`;
  public static readonly CIPHER_NOT_APPROPRIATE = (url: string) =>
    `${url} is not configured to support cipher suites that must be used to connect to IZ Gateway`;
  public static readonly TLS_VERSION_FAIL = (
    url: string,
    protocolVersion: String
  ) =>
    `IZ Gateway requires TLS 1.2 or 1.3. The endpoint at ${url} connected using ${protocolVersion} which is insecure.`;
  public static readonly UNKNOWN_ERROR = (url: string) =>
    `Unknown error trying to connect to ${url}`;
}
