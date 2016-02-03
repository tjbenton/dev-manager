#!/bin/bash

# Helper functions
# ------------------------------------------------------------
function ask() {
  # This was shamelessly copied from https://gist.github.com/davejamesmiller/1965569
  tput bel
  while true; do
    if [ "${2:-}" = "Y" ]; then
      prompt="Y/n"
      default=Y
    elif [ "${2:-}" = "N" ]; then
      prompt="y/N"
      default=N
    else
      prompt="y/n"
      default=
    fi
    # Ask the question
    echo ""
    echo "?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?"
    # Ask the question - use /dev/tty in case stdin is redirected from somewhere else
    read -p "$1 [$prompt] " REPLY </dev/tty

    # Default?
    if [ -z "$REPLY" ]; then
      REPLY=$default
    fi

    echo "?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?"
    # Check if the reply is valid
    case "$REPLY" in
      Y*|y*) return 0 ;;
      N*|n*) return 1 ;;
    esac
  done
}

function spacer() {
  echo ""
  echo "" </dev/tty
}


# # Ask for the administrator password upfront.
# sudo -v
# # Keep-alive: update existing `sudo` time stamp until the script has finished.
#
# while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
#
# # Ensures there's write access to `usr/local` to avoid stupid errors
# sudo chown -R $(whoami) /usr/local/

spacer

if [ ! $(xcode-\select -p) ];
  then
    xcode-select --install
    if ask "Have the command line tools been installed?" Y; then
      echo 'Xcode should now be intalled'
    fi
  else
    echo 'xcode is already installed'
fi


if [ ! $(brew --prefix) ];
  then
    rm -rf /usr/local/Cellar /usr/local/.git && brew cleanup # cleans up brew to allow for a fresh install
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    brew doctor
  else
    echo 'home brew is already installed'
fi


if [ ! $(brew list | grep '^nvm$') ];
  then
    brew install nvm
    nvm install v5
    nvm use v5
  else
    echo 'nvm is already installed'
fi


# run the setup script
npm install
./bin/dev-setup
