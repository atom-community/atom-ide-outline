"use babel";

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Outline", () => {
  let workspaceElement;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(() => atom.packages.activatePackage("atom-ide-outline"));
  });

  it("adds toggle command", function() {
    const toggleCommand = atom.commands
      .findCommands({
        target: workspaceElement
      })
      .some(command => command.name === "outline:toggle");

    expect(toggleCommand).toBe(true);
  });

  it("adds/removes outline view from workspace when toggled", () => {
    expect(workspaceElement.querySelector(".outline-view")).not.toExist();

    atom.commands.dispatch(workspaceElement, "outline:toggle");

    expect(workspaceElement.querySelector(".outline-view")).toBeVisible();

    atom.commands.dispatch(workspaceElement, "outline:toggle");

    expect(workspaceElement.querySelector(".outline-view")).not.toExist();
  });
});
