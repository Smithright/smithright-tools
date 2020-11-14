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

; powershell & system version
:*:,psv:: $psversiontable

; list env variables
:*:,lswinenv:: gci env:* | sort-object name
; in bash: set

; list git local git repos
:*:,lswingit:: {text} Get-ChildItem . -Attributes Directory+Hidden -ErrorAction SilentlyContinue -Filter ".git" -Recurse | % { Write-Host $_.FullName }
:*:,ls$git:: find / -name ".git"

; show aliases powershell commands
:*:,geta C:: get-alias

; run group policy editor
:*:,gpe:: C:\Windows\System32\gpedit.msc

; common directories
:*:,cdcc:: cd C:\
:*:,cdgg:: cd G:\
:*:,32:: C:\Windows\System32
:*:,cdrun:: cd C:\run
:*:,cdtemp:: cd C:\run\temp
:*:,cdtest:: cd C:\run\test
:*:,cdgit:: cd C:\github
:*:,cdsys:: G:\My Drive\SysInternals
:*:,.:: start .
