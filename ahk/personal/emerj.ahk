#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; plans
:*:,eplan:: https://docs.google.com/spreadsheets/d/1Wv4_7uLFbfumGoLnujGwNgJBJh9aE_a1Fzl7w5vr53E/edit{#}gid=111891309
:*:,asa:: https://app.asana.com/0/36629486922007/1176193607889335
:*:,ecal:: https://docs.google.com/spreadsheets/d/1QtkvHdlf0KKawasEkxch96KBmoJ4rjPsSXcauk6bkmM/edit{#}gid=0

; apps
:*:,kl:: https://www.klaviyo.com/lists

; publishing
:*:,epod:: drive.google.com/drive/folders/0B1GRD5Hj8Vkjdm94QUU5ekFHREk
:*:,ht:: https://hootsuite.com/dashboard{#}/planner
:*:,gpod:: https://podcasts.google.com/feed/aHR0cHM6Ly90ZWNoZW1lcmdlbmNlLmxpYnN5bi5jb20vcnNz

; reporting
:*:,emet:: https://docs.google.com/spreadsheets/d/1JBgcXrCp_rToqDQ_7ytn6vohml2p7ylFdZgKRVYFrz0/edit{#}gid=1247730683
:*:,ebuy:: https://docs.google.com/spreadsheets/d/1EPFRiqCkkS8d80VDXPCCvWjjJUlvOq3xnrUkuyzCatY/edit{#}gid=1952612013
:*:,emem:: https://drive.google.com/drive/u/0/folders/1KdOER1HfBTOl48M_4naduy1CfIPasfTO

; emerj.com shortcuts
:*:,emr:: emerj.com
:*:,elog:: https://emerj.com/emerjlogin/
:*:,eshop:: https://emerj.com/wp-admin/edit.php?post_type=mrj-order

; support
:*:,unsub:: 
    Send {Text}Was there anything you were looking for that Emerj Plus was not able to provide?`r
    Send `r
    Send {Text}We're adding new features and content each month, and your feedback is appreciated.`r
    Send `r
    Send {Text}If you're looking for more tailored research or advisory, consider applying to Emerj's AI Catalyst accelerator program (emerj.com/catalyst). Catalyst is a group advisory program for AI services leaders, hosted by Daniel Faggella, Emerj's Head of Research.`r
    Return
