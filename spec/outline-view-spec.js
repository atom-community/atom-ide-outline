"use babel";

const { TextEditor } = require("atom");
import OutlinePackage from "../lib/main";

import outlineMock from "./outlineMock.json";

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Outline view", () => {
  let workspaceElement;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(() => atom.workspace.open());
    waitsForPromise(() => atom.packages.activatePackage("atom-ide-outline"));

    OutlinePackage.outlineProviderRegistry = {
      getProvider: () => ({
        getOutline: async () => outlineMock
      })
    };
  });

  it("renders outline into HTML", () => {
    atom.commands.dispatch(workspaceElement, "outline:toggle");

    const editor = new TextEditor();
    waitsForPromise(() => OutlinePackage.getOutline(editor));

    runs(() => {
      const outlineViewElement = workspaceElement.querySelector(
        ".outline-view"
      );
      const rootRecords = outlineViewElement.querySelectorAll(
        ".outline-view > ul > li"
      );

      expect(outlineViewElement.children.length > 0).toEqual(true);
      expect(rootRecords.length).toEqual(2);
    });
  });

  it("nests lists for records with children", () => {
    atom.commands.dispatch(workspaceElement, "outline:toggle");

    const editor = new TextEditor();
    waitsForPromise(() => OutlinePackage.getOutline(editor));

    runs(() => {
      const outlineViewElement = workspaceElement.querySelector(
        ".outline-view"
      );
      const recordWithoutChildren = outlineViewElement.querySelector(
        ".outline-view li:nth-child(1) > ul"
      );
      const recordWithChildren = outlineViewElement.querySelector(
        ".outline-view li:nth-child(2) > ul"
      );

      expect(recordWithoutChildren).toEqual(null);
      expect(!!recordWithChildren).toEqual(true);
    });
  });

  it("generates icon and label for an entry", () => {
    atom.commands.dispatch(workspaceElement, "outline:toggle");

    const editor = new TextEditor();
    waitsForPromise(() => OutlinePackage.getOutline(editor));

    runs(() => {
      const recordContentHolder = workspaceElement.querySelector(
        ".outline-view li span"
      );
      const recordIcon =
        recordContentHolder && recordContentHolder.querySelector(".icon");

      expect(recordContentHolder.textContent).toEqual("fprimaryFunction");
      expect(recordIcon.textContent).toEqual("f");
    });
  });
});
