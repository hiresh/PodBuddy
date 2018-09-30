chrome.contextMenus.create ({
    title: "Add SQL to Repository",
    contexts: ["selection"],
    onclick: saveToServer
})

function saveToServer(text) {
    alert(text.selectionText);
}

