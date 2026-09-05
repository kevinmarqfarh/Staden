import { registerHooks } from "node:module";

// The application uses Next's @/ alias. Node 24 strips TypeScript directly;
// this small resolver lets the behavioral tests load the same source modules.
const sourceRoot = new URL("../src/", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(
      specifier.startsWith("@/")
        ? new URL(`${specifier.slice(2)}.ts`, sourceRoot).href
        : specifier,
      context,
    );
  },
});
