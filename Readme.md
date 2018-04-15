Template Toolkit beautifier

## Installation

Module must be installed as globaly

    $ npm install -g ttlint

## Usage

Just run command

    $ ttlint 'path_to_file'

You can specify several files in cli

    $ ttlint 'path_to_file' 'path_to_another_file'

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
