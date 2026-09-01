import {
  type CommandIO,
  InputFieldType,
  type InputSchema,
  PluginCommand,
  schemaToArgs,
  schemaToFlags,
} from "@metamask/agent-wallet/plugin";

// Declare inputs once; they become oclif flags, positionals, and interactive
// prompts. Resolve them in execute() with io.resolveInputs(inputs).
const inputs = {
  name: {
    type: InputFieldType.Text,
    flag: "name",
    message: "Name to greet",
    required: false,
    prompt: false,
    index: 0,
  },
} satisfies InputSchema;

type PingResult = {
  message: string;
};

export default class HelloPing extends PluginCommand<PingResult> {
  static override description = "Say hello from the plugin template.";

  static override examples = [
    "<%= config.bin %> hello ping",
    "<%= config.bin %> hello ping Alice",
    "<%= config.bin %> hello ping --name Alice --json",
  ];

  // This command works without sign-in or wallet setup. Remove these overrides
  // (both default to true) for commands that need an authenticated session or
  // an initialized wallet.
  static override requiresAuth = false;
  static override requiresInit = false;

  // Base flags (--json, --format, --toon, --verbose) are inherited from the
  // host CLI. Only declare your own.
  static override flags = schemaToFlags(inputs);
  static override args = schemaToArgs(inputs);

  /** Must match package.json#mm.commands[].id. */
  protected readonly pluginCommandId = "hello:ping";

  async execute(io: CommandIO): Promise<PingResult> {
    const { name } = await io.resolveInputs(inputs);
    return { message: name ? `pong, ${name}!` : "pong" };
  }

  override successHint(data: PingResult): string {
    return data.message;
  }
}
