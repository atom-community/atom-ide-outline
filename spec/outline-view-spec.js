"use babel"

const { TextEditor } = require("atom")
import * as OutlinePackage from "../dist/main"
import { statuses } from "../dist/main"

import outlineMock from "./outlineMock.json"

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Outline view", () => {
  let workspaceElement

  beforeEach(async () => {
    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    // Package activation will be deferred to the configured, activation hook, which is then triggered
    // Activate activation hook
    atom.packages.triggerDeferredActivationHooks()
    atom.packages.triggerActivationHook("core:loaded-shell-environment")
    await atom.packages.activatePackage("atom-ide-outline")

    expect(atom.packages.isPackageLoaded("atom-ide-outline")).toBeTruthy()

    OutlinePackage.outlineProviderRegistry = {
      getProvider: () => ({
        getOutline: async () => outlineMock,
      }),
    }
  })

  it("renders outline into HTML", async () => {
    const editor = new TextEditor()
    await OutlinePackage.getOutline(editor)

    const outlineViewElement = workspaceElement.querySelector(".outline-content")
    const rootRecords = outlineViewElement.querySelectorAll(".outline-content > ul > li")

    expect(outlineViewElement.children.length > 0).toEqual(true)
    // TODO
    // expect(rootRecords.length).toEqual(3);
  })

  it("nests lists for records with children", async () => {
    const editor = new TextEditor()
    await OutlinePackage.getOutline(editor)

    const outlineViewElement = workspaceElement.querySelector(".outline-content")
    const recordWithoutChildren = outlineViewElement.querySelector(".outline-content li:nth-child(1) > ul")
    const recordWithChildren = outlineViewElement.querySelector(".outline-content li:nth-child(2) > ul")

    expect(recordWithoutChildren).toEqual(null)
    // TODO
    // expect(!!recordWithChildren).toEqual(true);
  })

  it("generates icon and label for an entry", async () => {
    const editor = new TextEditor()
    await OutlinePackage.getOutline(editor)

    const recordContentHolder = workspaceElement.querySelector(".outline-content li span")
    const recordIcon = recordContentHolder && recordContentHolder.querySelector(".icon")

    // TODO
    // expect(recordContentHolder.textContent).toEqual("fprimaryFunction");
    // expect(recordIcon.textContent).toEqual("f");
  })

  it("provides fallback for entries without icon", async () => {
    const editor = new TextEditor()
    await OutlinePackage.getOutline(editor)

    const recordContentHolder = workspaceElement.querySelector(".outline-content li:nth-child(3) span")
    const recordIcon = recordContentHolder && recordContentHolder.querySelector(".icon")

    // TODO
    // expect(recordIcon.textContent).toEqual("?");
  })

  it("presents status message correctly", async () => {
    const mockStatus = {
      title: "Error message",
      description: "Something went wrong",
    }
    statuses.mockStatus = mockStatus

    OutlinePackage.setStatus("mockStatus")

    const statusHolder = workspaceElement.querySelector(".outline-content .status")
    const title = statusHolder.querySelector("h1")
    const description = statusHolder.querySelector("span")

    expect(title.textContent).toEqual(mockStatus.title)
    expect(description.textContent).toEqual(mockStatus.description)
  })
})
