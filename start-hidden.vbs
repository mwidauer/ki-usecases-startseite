' start-hidden.vbs
' Startet den KI-Usecases Server unsichtbar im Hintergrund.
' Kein Fenster, kein Browser-Pop-up – ideal fuer Windows-Autostart.
'
' Manuell starten: Doppelklick auf start-hidden.vbs
' Autostart einrichten: setup\install-autostart.bat ausfuehren

Dim fso, scriptDir, pythonExe, serverPy

Set fso   = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
serverPy  = scriptDir & "\server.py"

' Eingebettetes Python bevorzugen, sonst System-Python
If fso.FileExists(scriptDir & "\python\python.exe") Then
    pythonExe = scriptDir & "\python\python.exe"
Else
    pythonExe = "python"
End If

' Fensterstil 0 = unsichtbar; False = nicht warten
CreateObject("WScript.Shell").Run _
    Chr(34) & pythonExe & Chr(34) & " " & _
    Chr(34) & serverPy  & Chr(34) & " --no-browser", _
    0, False
