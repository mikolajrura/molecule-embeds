// Load RDKit WASM from the local plugin directory (no internet needed).
// RDKit_minimal.js and RDKit_minimal.wasm must sit next to main.js.

export interface RDKitMol {
  get_svg(): string;
  get_svg_with_highlights(details: string): string;
  add_hs(): RDKitMol;
  delete(): void;
  is_valid(): boolean;
}

export interface RDKitModule {
  get_mol(smiles: string): RDKitMol;
  version(): string;
}

let rdkitPromise: Promise<RDKitModule> | null = null;

export function loadRDKit(): Promise<RDKitModule> {
  if (rdkitPromise) return rdkitPromise;

  rdkitPromise = (async () => {
    // Use Node.js require (available in Electron/Obsidian).
    // eval('require') prevents esbuild from trying to bundle the dynamic path.
    // __dirname points to the plugin folder where RDKit_minimal.js lives.
    const nodeRequire = eval("require") as NodeRequire;
    const path = nodeRequire("path") as typeof import("path");
    const rdkitJsPath = path.join(__dirname, "RDKit_minimal.js");
    const initRDKitModule = nodeRequire(rdkitJsPath) as (
      opts?: object
    ) => Promise<RDKitModule>;
    return await initRDKitModule();
  })();

  return rdkitPromise;
}
