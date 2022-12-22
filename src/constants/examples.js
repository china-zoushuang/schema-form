export default {
  services: {
    fields: [
      {
        id: {
          len_min: 1,
          uuid: true,
          type: "string",
          auto: true,
        },
      },
      {
        created_at: {
          timestamp: true,
          type: "integer",
          auto: true,
        },
      },
      {
        updated_at: {
          timestamp: true,
          type: "integer",
          auto: true,
        },
      },
      {
        name: {
          unique: true,
          type: "string",
          indexed: true,
        },
      },
      {
        retries: {
          between: [0, 32767],
          type: "integer",
          default: 5,
        },
      },
      {
        protocol: {
          required: true,
          default: "http",
          indexed: true,
          type: "string",
          one_of: [
            "grpc",
            "grpcs",
            "http",
            "https",
            "tcp",
            "tls",
            "tls_passthrough",
            "udp",
            "ws",
            "wss",
          ],
        },
      },
      {
        host: {
          required: true,
          type: "string",
          indexed: true,
        },
      },
      {
        port: {
          required: true,
          type: "integer",
          indexed: true,
          between: [0, 65535],
          default: 80,
        },
      },
      {
        path: {
          match_none: [
            {
              err: "must not have empty segments",
              pattern: "//",
            },
          ],
          starts_with: "/",
          type: "string",
          indexed: true,
        },
      },
      {
        connect_timeout: {
          between: [1, 2147483646],
          default: 60000,
          type: "integer",
        },
      },
      {
        write_timeout: {
          between: [1, 2147483646],
          default: 60000,
          type: "integer",
        },
      },
      {
        read_timeout: {
          between: [1, 2147483646],
          default: 60000,
          type: "integer",
        },
      },
      {
        tags: {
          type: "set",
          elements: {
            type: "string",
            required: true,
          },
        },
      },
      {
        client_certificate: {
          type: "foreign",
          reference: "certificates",
        },
      },
      {
        tls_verify: {
          type: "boolean",
        },
      },
      {
        tls_verify_depth: {
          between: [0, 64],
          type: "integer",
          default: null,
        },
      },
      {
        ca_certificates: {
          type: "array",
          elements: {
            type: "string",
            uuid: true,
          },
        },
      },
      {
        enabled: {
          default: true,
          required: true,
          type: "boolean",
          indexed: true,
        },
      },
    ],
  },
  routes: {
    fields: [
      {
        id: {
          uuid: true,
          type: "string",
          auto: true,
        },
      },
      {
        created_at: {
          timestamp: true,
          type: "integer",
          auto: true,
        },
      },
      {
        updated_at: {
          timestamp: true,
          type: "integer",
          auto: true,
        },
      },
      {
        name: {
          unique: true,
          type: "string",
          indexed: true,
        },
      },
      {
        protocols: {
          required: true,
          type: "set",
          indexed: true,
          len_min: 1,
          elements: {
            type: "string",
            one_of: [
              "grpc",
              "grpcs",
              "http",
              "https",
              "tcp",
              "tls",
              "tls_passthrough",
              "udp",
              "ws",
              "wss",
            ],
          },
          mutually_exclusive_subsets: [
            ["http", "https"],
            ["tcp", "tls", "udp"],
            ["tls_passthrough"],
            ["grpc", "grpcs"],
            ["ws", "wss"],
          ],
          default: ["http", "https"],
        },
      },
      {
        methods: {
          elements: {
            type: "string",
            match: "^%u+$",
          },
          type: "set",
          indexed: true,
        },
      },
      {
        hosts: {
          elements: {
            match_any: {
              err: "invalid wildcard: must be placed at leftmost or rightmost label",
              patterns: ["^%*%.", "%.%*$", "^[^*]*$"],
            },
            match_all: [
              {
                err: "invalid wildcard: must have at most one wildcard",
                pattern: "^[^*]*%*?[^*]*$",
              },
            ],
            type: "string",
          },
          type: "array",
          indexed: true,
        },
      },
      {
        paths: {
          elements: {
            match_any: {
              err: "should start with: / (fixed path) or ~/ (regex path)",
              patterns: ["^/", "^~/"],
            },
            type: "string",
            match_none: [
              {
                err: "must not have empty segments",
                pattern: "//",
              },
            ],
          },
          type: "array",
          indexed: true,
        },
      },
      {
        headers: {
          type: "map",
          keys: {
            match_none: [
              {
                err: "cannot contain 'host' header, which must be specified in the 'hosts' attribute",
                pattern: "^[Hh][Oo][Ss][Tt]$",
              },
            ],
            type: "string",
          },
          values: {
            type: "array",
            elements: {
              type: "string",
            },
          },
        },
      },
      {
        https_redirect_status_code: {
          type: "integer",
          required: true,
          one_of: [426, 301, 302, 307, 308],
          default: 426,
        },
      },
      {
        regex_priority: {
          type: "integer",
          default: 0,
        },
      },
      {
        strip_path: {
          required: true,
          type: "boolean",
          default: true,
        },
      },
      {
        path_handling: {
          type: "string",
          default: "v0",
          one_of: ["v0", "v1"],
        },
      },
      {
        preserve_host: {
          required: true,
          type: "boolean",
          default: false,
        },
      },
      {
        request_buffering: {
          required: true,
          type: "boolean",
          default: true,
        },
      },
      {
        response_buffering: {
          required: true,
          type: "boolean",
          default: true,
        },
      },
      {
        snis: {
          type: "set",
          elements: {
            type: "string",
          },
        },
      },
      {
        sources: {
          type: "set",
          elements: {
            fields: [
              {
                ip: {
                  type: "string",
                },
              },
              {
                port: {
                  type: "integer",
                  between: [0, 65535],
                },
              },
            ],
            type: "record",
            entity_checks: [
              {
                at_least_one_of: ["ip", "port"],
              },
            ],
          },
        },
      },
      {
        destinations: {
          type: "set",
          elements: {
            fields: [
              {
                ip: {
                  type: "string",
                },
              },
              {
                port: {
                  type: "integer",
                  between: [0, 65535],
                },
              },
            ],
            type: "record",
            entity_checks: [
              {
                at_least_one_of: ["ip", "port"],
              },
            ],
          },
        },
      },
      {
        tags: {
          type: "set",
          elements: {
            type: "string",
            required: true,
          },
        },
      },
      {
        service: {
          type: "foreign",
          reference: "services",
        },
      },
    ],
  },
  consumer: {
    fields: [
      {
        id: {
          uuid: true,
          type: "string",
          auto: true,
        },
      },
      {
        created_at: {
          timestamp: true,
          type: "integer",
          auto: true,
        },
      },
      {
        username: {
          unique: true,
          type: "string",
          indexed: true,
        },
      },
      {
        username_lower: {
          db_export: false,
          type: "string",
          prefix_ws: true,
        },
      },
      {
        custom_id: {
          unique: true,
          type: "string",
          indexed: true,
        },
      },
      {
        type: {
          default: 0,
          required: true,
          type: "integer",
          indexed: true,
        },
      },
      {
        tags: {
          type: "set",
          elements: {
            type: "string",
            required: true,
          },
        },
      },
    ],
  },
  jwt: {
    fields: [
      {
        consumer: {
          type: "foreign",
          eq: null,
          reference: "consumers",
        },
      },
      {
        protocols: {
          elements: {
            type: "string",
            one_of: ["grpc", "grpcs", "http", "https"],
          },
          required: true,
          default: ["grpc", "grpcs", "http", "https"],
          type: "set",
        },
      },
      {
        config: {
          required: true,
          type: "record",
          fields: [
            {
              uri_param_names: {
                elements: {
                  type: "string",
                },
                type: "set",
                default: ["jwt"],
              },
            },
            {
              cookie_names: {
                elements: {
                  type: "string",
                },
                type: "set",
                default: [],
              },
            },
            {
              key_claim_name: {
                type: "string",
                default: "iss",
              },
            },
            {
              secret_is_base64: {
                required: true,
                type: "boolean",
                default: false,
              },
            },
            {
              claims_to_verify: {
                type: "set",
                elements: {
                  type: "string",
                  one_of: ["exp", "nbf"],
                },
              },
            },
            {
              anonymous: {
                type: "string",
              },
            },
            {
              run_on_preflight: {
                required: true,
                type: "boolean",
                default: true,
              },
            },
            {
              maximum_expiration: {
                between: [0, 31536000],
                type: "number",
                default: 0,
              },
            },
            {
              header_names: {
                elements: {
                  type: "string",
                },
                type: "set",
                default: ["authorization"],
              },
            },
          ],
        },
      },
    ],
  },
  "basic-auth": {
    fields: [
      {
        consumer: {
          type: "foreign",
          eq: null,
          reference: "consumers",
        },
      },
      {
        protocols: {
          elements: {
            type: "string",
            one_of: ["grpc", "grpcs", "http", "https", "ws", "wss"],
          },
          required: true,
          default: ["grpc", "grpcs", "http", "https", "ws", "wss"],
          type: "set",
        },
      },
      {
        config: {
          required: true,
          type: "record",
          fields: [
            {
              anonymous: {
                type: "string",
              },
            },
            {
              hide_credentials: {
                required: true,
                default: false,
                type: "boolean",
              },
            },
          ],
        },
      },
    ],
  },
};
