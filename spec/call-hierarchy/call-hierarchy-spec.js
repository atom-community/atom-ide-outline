"use babel"

import path from "path"
import { TextEditor } from "atom"

describe("Call Hierarchy", () => {
  let workspaceElement, activeEditor

  beforeEach(async () => {
    const mockFilePath = path.join(__dirname, "../mockFile")

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
      .some((command) => command.name === "outline:toggle-call-hierarchy")

    expect(toggleCommand).toBe(true)
  })

  it("adds/removes call hierarchy view from workspace when toggled", () => {
    atom.commands.dispatch(workspaceElement, "outline:show-call-hierarchy")

    expect(workspaceElement.querySelector("atom-ide-outline-call-hierarchy-view")).toBeVisible()

    atom.commands.dispatch(workspaceElement, "outline:toggle-call-hierarchy")

    expect(workspaceElement.querySelector("atom-ide-outline-call-hierarchy-view")).not.toExist()

    atom.commands.dispatch(workspaceElement, "outline:toggle-call-hierarchy")

    expect(workspaceElement.querySelector("atom-ide-outline-call-hierarchy-view")).toBeVisible()
  })
})
