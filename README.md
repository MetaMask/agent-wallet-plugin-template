# MetaMask Agent Wallet Plugin Template

Starter template for building a [MetaMask Agent Wallet](https://docs.metamask.io/agent-wallet/) plugin. A plugin is an npm package that adds native `mm` commands, discoverable in `mm help` and the REPL.

The template has one working command:

```
mm hello ping [name]
```

## Use this template

1. Click "Use this template" on GitHub or clone this repo, then rename things:
   - `package.json` → `name`, `description`, and the `mm.commands[].id` entries
   - `src/commands/<topic>/<command>.ts` → the file path defines the command.
     For example, `src/commands/hello/ping.ts` becomes `mm hello ping` with id `hello:ping`.
2. Install and build. The examples below use npm. You can use your preferred package manager.

   ```bash
   npm install
   npm run build        # tsc + oclif manifest
   ```

3. Enable the plugin beta in the CLI and install your plugin locally:

   ```bash
   mm config set experimentalPlugins true
   mm config set experimentalAllowUnverifiedInstalls true   # allows local file: installs
   mm plugins install "file:$PWD" --accept-permissions
   ```

   Install from the directory, not a packed tarball. The CLI reads `package.json#mm` from the
   directory to persist capability approvals for local installs.

4. Try it:

   ```bash
   mm hello ping Alice
   mm plugins uninstall mm-plugin-hello    # remove between iterations
   ```

5. Publish to npm when ready. Users then install with `mm plugins install <your-package>` and
   review a consent screen listing your commands, data access, and requested capabilities.

## Anatomy of a command

- Extend `PluginCommand` from `@metamask/agent-wallet/plugin` and implement `execute()`.
  The rest of the lifecycle, such as auth gates, analytics, rendering, and isolation, is sealed by the host.
- `pluginCommandId` must match the command's `id` in `package.json#mm.commands`.
- `requiresAuth` and `requiresInit` gate sign-in and wallet setup. Both default to `true`.
- Declare inputs once as a schema. `schemaToFlags` and `schemaToArgs` generate the oclif surface,
  and `io.resolveInputs(inputs)` resolves flags, positionals, and interactive prompts.
- The base flags `--json`, `--format`, `--toon`, and `--verbose` are inherited automatically.
- `oclif.manifest.json` is generated on build and must ship with the package.

## Capabilities

Declare what each command needs in `package.json#mm.commands[].capabilities`. Users consent at
install time. Keep the plugin-wide `mm.capabilities` list empty because it is merged into every
command.

| Capability       | Grants                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `wallet-read`    | Read services such as balances, prices, tokens, and wallet state, plus `ctx.publicClient(chainId)` for raw EVM reads |
| `wallet-submit`  | `ctx.walletExecutor()` for sign and submit flows, still policy-gated by MetaMask           |
| `network-manage` | Reserved for future network management                                                     |

The template's `hello:ping` declares no capabilities. It is a pure command that runs for anyone
with the plugin installed. The session, CLI token, and Secret Recovery Phrase are host-only and
never exposed to plugins.
