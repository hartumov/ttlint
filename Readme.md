Template Toolkit beautifier

## Installation

Module must be installed as globaly

    $ npm install -g ttlint

## Usage

Just run command

    $ ttlint --flies 'path_to_file'

If you want use flies in folder:

    $ ttlint --files 'path_to_folder/**/*.*'

## Description

This module beautify brackets in TT file, aligns parameters by arrows, adds commas at ends of file, removes extra spaces, where necessary.

Example:

    [% INCLUDE      %]
    [%           WRAPPER%]

will be tranfrom in

    [% INCLUDE %]
    [% WRAPPER %]

One more example:

    INCLUDE 'b-button.inc'
            params => {
                id => 'main',
                value => 18
                data => {
                    class => 'l-float_left'
                    link => '/user/options/'
                }
                color => 'red',
            };

after beautifing

    INCLUDE 'b-button.inc'
            params => {
                id    => 'main',
                value => 18,
                data => {
                    class => 'l-float_left',
                    link  => '/user/options/',
                }
                color => 'red',
            };
