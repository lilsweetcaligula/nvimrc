## Description

A simple manager inspired by npmrc that helps easily switch between Neovim configs.

## Installation
```
$ cd ./nvimrc
$ npm i -g .
```

## Usage
While nvimrc does back up your original `init.vim` file as
`~/.config/nvim/nvimrc/profiles/bk.init.vim` (assuming your nvim config dir is
at `~/.config/nvim`), it is advised to backup your original `init.vim` manually
before using `nvimrc`. At least while `nvimrc` is in the alpha stage.

Run nvimrc to initialize it.
```
$ nvimrc
```

Assuming your nvim config dir is at `~/.config/nvim`, create a new file in
`~/.config/nvim/nvimrc/profiles` and give it a memorable name, e.g. `lambda`, -
this will be your profile name. Put your profile-specific configuration in this
file.

To use the profile, on the command line, run:
```
$ nvimrc [profile]
```

## Bugs

Nvimrc is in its nascent stage, - please feel free to open new issues and report bugs.


