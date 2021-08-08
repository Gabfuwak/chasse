# README

This file explains how to place your files in the util/
directory.

## common utility

This directory is to contain only utility that does not
relate to a single page ; rather, it is for utility code
that relates to either multiple, unrelated pages, or the
whole app.

## page utility

This directory is to contain utility that is related to pages
of the application that are visibly linked together and not
general (so utility code that is not a page but relates to 
a directory or a single page or a group of pages under the
same directory)

## Important note

When placing utility code, remember to place them according
to this :

- if there is only one file, place it in the containing folder directly.
- if there are more than one, place them in their own folder in the containing folder.

___________

## Cases

### single page utility

If you have utility code that is used by a single page in your
app, place it in the common/ folder


### directory utility

If you have some utility code that is used by multiple 
(not necessarily all) pages of your app that are related
to each other (for example, multiple pages of a login/ 
directory, where the different pages are different 
login steps), you can place your code directly in the 
page/login/ directory.

### general utility

If you have utility that relates to the whole app, or
to only certain unrelated parts of your app, or is not
specifically designed for use by a single or multiple 
page, place it in the common/ directory.


