// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  let copyPathLines = function (withLineNumber = false) {
    let alertMessage = "File path not found!";
    if (!vscode.workspace.rootPath) {
      vscode.window.showWarningMessage(alertMessage);
      return false;
    }

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage(alertMessage);
      return false;
    }

    let doc = editor.document;
    if (doc.isUntitled) {
      vscode.window.showWarningMessage(alertMessage);
      return false;
    }

    let path = vscode.workspace.asRelativePath(doc.fileName);

    if (withLineNumber) {
      editor.selections.forEach((selection) => {
        insertText(path + ":" + `${selection.active.line + 1}`,true,false)
      });
    } else {
            return path;
    }
  };

  let toast = function (message) {
    vscode.window.setStatusBarMessage(
      "`" + message + "` is copied to clipboard",
      3000
    );
  };


  const insertText = (text, appendText = false, newLine = false) => {
    const activeTextEditor = vscode.window.activeTextEditor;
  
    if (!activeTextEditor) return;
  
    activeTextEditor.edit(
      edit => activeTextEditor.selections.map(
        selection => {
          if (!appendText) edit.delete(selection);
  
          const location = appendText
            ? selection.end
            : selection.start;
  
          const value = appendText && newLine
            ? `\n${text}`
            : text;
  
          edit.insert(location, value);
        }
      )
    );
  };
  

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "copy-relative-path-and-line-numbers" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let cmdBoth = vscode.commands.registerCommand(
    "copy-relative-path-and-line-numbers.both",
    () => {
      copyPathLines(true);
    }
  );

  let cmdPathOnly = vscode.commands.registerCommand(
    "copy-relative-path-and-line-numbers.path-only",
    () => {
      let message = copyPathLines();
      if (message !== false) {
        vscode.env.clipboard.writeText(message).then(() => {
          toast(message);
        });
      }
    }
  );

  context.subscriptions.push(cmdBoth, cmdPathOnly);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
