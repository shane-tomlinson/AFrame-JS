@ECHO OFF

REM ##########################################################################

REM The location of your yuidoc install
SET yuidoc_home="c:\users\shane\development\yuidoc"

REM The location of the files to parse.  Parses subdirectories, but will fail if
REM there are duplicate file names in these directories.  You can specify multiple
REM source trees:
REM      SET parser_in="c:\home\www\yahoo.dev\src\js c:\home\www\Event.dev\src"
SET parser_in=c:\users\shane\development\aframe\src

REM The location to output the parser data.  This output is a file containing a 
REM json string, and copies of the parsed files.
SET parser_out="c:\users\shane\development\aframe\docs\parser"

REM The directory to put the html file outputted by the generator
SET generator_out="c:\users\shane\development\aframe\docs\generator"

REM delete the old files
del /Q %generator_out%
del /Q %parser_out%

REM The location of the template files.  Any subdirectories here will be copied
REM verbatim to the destination directory.
SET template="%yuidoc_home%\template"

REM The project version that will be displayed in the documentation.
SET version="0.0.1"

REM The version of YUI the project uses.
SET yuiversion="2"

SET projecturl="http://www.shanetomlinson.com/"
SET projectname="AFrame API Documentation"

%yuidoc_home%\bin\yuidoc.py %parser_in% -p %parser_out% -o %generator_out% -t %template% -v %version% -Y %yuiversion% -m %projectname% -u %projecturl%

