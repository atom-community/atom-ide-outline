"use babel"

import path from "path"
import { TextEditor, Point } from "atom"
import statuses from "../../src/call-hierarchy/statuses.json"
import callHierarchyMock from "./call-hierarchyMock"

describe("Call Hierarchy", () => {
  let CallHierarchyView
  beforeEach(async () => {
    // Get CallHierarchyView class
    const mockFilePath = path.join(__dirname, "../mockFile")
    const workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)
    await atom.workspace.open(mockFilePath)
    // Package activation will be deferred to the configured, activation hook, which is then triggered
    // Activate activation hook
    atom.packages.triggerDeferredActivationHooks()
    atom.packages.triggerActivationHook("core:loaded-shell-environment")
    await atom.packages.activatePackage("atom-ide-outline")
    await atom.commands.dispatch(workspaceElement, "outline:show-call-hierarchy")
    CallHierarchyView = workspaceElement.querySelector("atom-ide-outline-call-hierarchy-view").constructor
    // close editor for noEditor's test
    atom.workspace.closeActivePaneItemOrEmptyPaneOrWindow()
  })

  describe("CallHierarchyView", () => {
    let view, editor, point
    beforeEach(() => {
      view = new CallHierarchyView({
        providerRegistry: {
          getProviderForEditor: () => ({
            getIncomingCallHierarchy: () => Promise.resolve(callHierarchyMock),
            getOutgoingCallHierarchy: () => Promise.resolve(callHierarchyMock),
          }),
        },
      })
      editor = new TextEditor()
      point = new Point(0, 0)
    })
    it("renders HTML", async () => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("atom-ide-outline-call-hierarchy-item")
      expect(content.children.length).toEqual(3)
    })
    it("renders title", async () => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("atom-ide-outline-call-hierarchy-item")
      expect(content.children[0].querySelector(":scope>div span:nth-child(2)").innerHTML).toEqual("name1")
      expect(content.children[1].querySelector(":scope>div span:nth-child(2)").innerHTML).toEqual("name2")
      expect(content.children[2].querySelector(":scope>div span:nth-child(2)").innerHTML).toEqual("name3")
    })
    it("renders child", async () => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("atom-ide-outline-call-hierarchy-item")
      for (const child of content.children) {
        expect(child.querySelector(":scope>atom-ide-outline-call-hierarchy-item").children.length).toEqual(3)
      }
    })
    it("renders child content", async () => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("atom-ide-outline-call-hierarchy-item")
      for (const child of content.children) {
        const childContent = child.querySelector(":scope>atom-ide-outline-call-hierarchy-item")
        expect(childContent.children[0].querySelector(":scope>div span:nth-child(2)").innerHTML).toEqual("name1")
        expect(childContent.children[1].querySelector(":scope>div span:nth-child(2)").innerHTML).toEqual("name2")
        expect(childContent.children[2].querySelector(":scope>div span:nth-child(2)").innerHTML).toEqual("name3")
      }
    })
    it("click child content", async (done) => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("atom-ide-outline-call-hierarchy-item")
      const childContent = content.children[0].querySelector(":scope>atom-ide-outline-call-hierarchy-item")
      expect(childContent.querySelector("atom-ide-outline-call-hierarchy-item")).toEqual(null)
      childContent.querySelector(":scope>div>div").dispatchEvent(new Event("click"))
      setTimeout(() => {
        childContent.querySelector("atom-ide-outline-call-hierarchy-item")
        expect(childContent.querySelector("atom-ide-outline-call-hierarchy-item").children.length).toEqual(3)
        done()
      })
    })
    it("status noEditor", async () => {
      await view.showCallHierarchy(undefined, undefined)
      const content = view.querySelector("h1")
      expect(content.innerText).toEqual(statuses.noEditor.title)
    })
  })

  describe("CallHierarchy provider returns null", () => {
    let view, editor, point
    beforeEach(() => {
      view = new CallHierarchyView({
        providerRegistry: {
          getProviderForEditor: () => ({
            getIncomingCallHierarchy: () => Promise.resolve(null),
            getOutgoingCallHierarchy: () => Promise.resolve(null),
          }),
        },
      })
      editor = new TextEditor()
      point = new Point(0, 0)
    })
    it("status noResult", async () => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("h1")
      expect(content.innerText).toEqual(statuses.noResult.title)
    })
  })

  describe("CallHierarchy provider not found", () => {
    let view, editor, point
    beforeEach(() => {
      view = new CallHierarchyView({
        providerRegistry: {
          getProviderForEditor: () => null,
        },
      })
      editor = new TextEditor()
      point = new Point(0, 0)
    })
    it("status noProvider", async () => {
      await view.showCallHierarchy(editor, point)
      const content = view.querySelector("h1")
      expect(content.innerText).toEqual(statuses.noProvider.title)
    })
  })
})
