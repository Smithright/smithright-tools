#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; ahk template?
 ; :*:, :: return

; list conda environments
:*:,lsc3:: conda env list

; activate env
:*:,cact:: conda activate

; list installed packages
:*:,lscp:: conda list --name base

; powershell version
:*:,psv:: $psversiontable

; list env variables
:*:,lswinenv:: gci env:* | sort-object name
; in bash: set

; list git local git repos
:*:,lswingit:: {text} Get-ChildItem . -Attributes Directory+Hidden -ErrorAction SilentlyContinue -Filter ".git" -Recurse | % { Write-Host $_.FullName }
:*:,ls$git:: find / -name ".git"

; show aliases powershell commands
:*:,geta C:: get-alias

; common directories
:*:,cd C:: cd C:\
:*:,cd G:: cd G:\
:*:,cd run:: cd C:\run
:*:,cd temp:: cd C:\run\temp
:*:,cd test:: cd C:\run\test
:*:,cd ahk:: cd C:\run\ahk
:*:,cd sys:: G:\My Drive\SysInternals
