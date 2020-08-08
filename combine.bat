@echo off 
set year=%date:~10,4%
set month=%date:~4,2%
set day=%date:~7,2%
set file=engine.%year%.%month%.%day%.js
@echo on

file_combiner.exe include.txt %file%
copy %file% engine.js

@echo off 
pause