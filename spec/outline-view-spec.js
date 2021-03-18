"use babel"

const { TextEditor } = require("atom")
import * as OutlinePackage from "../dist/main"
import { statuses } from "../dist/main"

import outlineMock from "./outlineMock.json"

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

function createMockProvider() {
  return {
    getOutline: () => outlineMock,
  }
}

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

    spyOn(OutlinePackage.outlineProviderRegistry, "getProviderForEditor").and.returnValue(createMockProvider())
  })

  describe("getOutline", () => {
    let editor
    let outlineContent

    beforeEach(async () => {
      atom.config.set("outline.sortEntries", false)
      editor = new TextEditor()
      await OutlinePackage.getOutline(editor)
      outlineContent = workspaceElement.querySelector(".outline-content")
    })

    it("renders outline into HTML", () => {
      const rootRecords = outlineContent.querySelectorAll(".outline-content > ul > li")

      expect(outlineContent.children.length > 0).toEqual(true)
      expect(rootRecords.length).toEqual(3)
    })

    it("nests lists for records with children", () => {
      const recordWithoutChildren = outlineContent.querySelector(".outline-content > ul > li:nth-child(1) > ul")
      const recordWithChildren = outlineContent.querySelector(".outline-content > ul > li:nth-child(3) > ul")

      expect(recordWithoutChildren).toEqual(null)
      expect(Boolean(recordWithChildren)).toEqual(true)
    })

    it("generates icon and label for an entry", () => {
      const recordContentHolder = outlineContent.querySelector(".outline-content > ul > li span")
      const recordIcon = recordContentHolder && recordContentHolder.querySelector(".outline-icon")

      expect(recordContentHolder.textContent).toEqual("funprimaryFunction")
      expect(recordIcon.textContent).toEqual("fun")
    })

    it("provides fallback for entries without icon", () => {
      const recordContentHolder = outlineContent.querySelector(".outline-content > ul > li:nth-child(2) span")
      const recordIcon = recordContentHolder.querySelector(".outline-icon")

      expect(recordIcon.textContent).toEqual("🞇")
    })
  })

  describe("setStatus", () => {
    it("presents status message correctly", () => {
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
    it("presents status message correctly", () => {
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
})
