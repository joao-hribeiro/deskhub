Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

base = fso.GetParentFolderName(WScript.ScriptFullName)
pyw = base & "\companion\.venv\Scripts\pythonw.exe"
bridge = base & "\mobile_web\server.py"
compDir = base & "\companion"
cfg = compDir & "\config.toml"

If Not fso.FileExists(pyw) Then
    MsgBox "Ambiente virtual nao encontrado: " & pyw, 16, "Desk Hub Mobile"
    WScript.Quit 1
End If

shell.CurrentDirectory = base
shell.Run """" & pyw & """ """ & bridge & """ --host 0.0.0.0 --port 8080 --token deskhub-mobile", 0, False

WScript.Sleep 1500

shell.CurrentDirectory = compDir
shell.Run """" & pyw & """ -m deskhub --config """ & cfg & """ --tray", 0, False
