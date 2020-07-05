import { Disposable } from "atom";

export class ProviderRegistry {
  constructor() {
    this.providers = [];
  }

  addProvider(provider) {
    this.providers.push(provider);

    return new Disposable(() => this.removeProvider(provider));
  }

  removeProvider(provider) {
    const indexInRegistry = this.providers.indexOf(provider);

    if (indexInRegistry !== -1) {
      this.providers.splice(indexInRegistry, 1);
    }
  }

  getProvider(editor) {
    const grammarScope = editor.getGrammar().scopeName;

    return this.providers.find(provider =>
      provider.grammarScopes.includes(grammarScope)
    );
  }
}
