"use babel";

import path from "path";

import OutlinePackage from "../lib/main";

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Outline", () => {
  let workspaceElement, activeEditor;

  beforeEach(() => {
    const mockFilePath = path.join(__dirname, "mockFile");

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(() => atom.workspace.open(mockFilePath));
    waitsForPromise(() => atom.packages.activatePackage("atom-ide-outline"));

    runs(() => {
      activeEditor = atom.workspace.getActiveTextEditor();
    });
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

  it("triggers outline generation for active editor on save", () => {
    spyOn(OutlinePackage, "getOutline");

    waitsForPromise(() => activeEditor.save());

    runs(() => {
      expect(OutlinePackage.getOutline).toHaveBeenCalled();
    });
  });
});
