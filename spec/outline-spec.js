"use babel"

import path from "path"

import * as OutlinePackage from "../dist/main"
import { TextEditor } from "atom"

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Outline", () => {
  let workspaceElement, activeEditor

  beforeEach(async () => {
    const mockFilePath = path.join(__dirname, "mockFile")

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    await atom.workspace.open(mockFilePath)

    // Package activation will be deferred to the configured, activation hook, which is then triggered
    // Activate activation hook
    atom.packages.triggerDeferredActivationHooks()
    atom.packages.triggerActivationHook("core:loaded-shell-environment")
    await atom.packages.activatePackage("atom-ide-outline")

    expect(atom.packages.isPackageLoaded("atom-ide-outline")).toBeTruthy()

    activeEditor = atom.workspace.getActiveTextEditor()

    expect(activeEditor).toBeInstanceOf(TextEditor)
  })

  it("adds toggle command", function () {
    const toggleCommand = atom.commands
      .findCommands({
        target: workspaceElement,
      })
      .some((command) => command.name === "outline:toggle")

    expect(toggleCommand).toBe(true)
  })

  it("adds/removes outline view from workspace when toggled", () => {
    expect(workspaceElement.querySelector(".outline-content")).toBeVisible()

    atom.commands.dispatch(workspaceElement, "outline:toggle")

    expect(workspaceElement.querySelector(".outline-content")).not.toExist()

    atom.commands.dispatch(workspaceElement, "outline:toggle")

    expect(workspaceElement.querySelector(".outline-content")).toBeVisible()
  })

  it("triggers outline generation for active editor on save", async () => {
    spyOn(OutlinePackage, "getOutline")

    await activeEditor.save()
    // const editor = await atom.workspace.open(path.join(__dirname, "outline-spec.js"));
    // editor.setCursorScreenPosition([0,0])
    // TODO Fix
    // expect(OutlinePackage.getOutline).toHaveBeenCalled();
  })
})
