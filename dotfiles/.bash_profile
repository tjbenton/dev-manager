#  If `@optional` is not located above a section then that means it is required.
#  This means **DO NOT CHANGE** the command.

# Load ~/.bash_prompt, ~/.bash_exports, ~/.bash_aliases, ~/.bash_functions and ~/.bash_extras
# ~/.bash_extras can be used for settings you don’t want to commit
for file in ~/.{bash_exports,bash_aliases,bash_functions}; do
  if [ -r "$file" ]; then
    source "$file"
  fi
done
unset file


# some shells don't have the `shopt` command so this checks for it
if [ which shopt &> /dev/null ]; then
  # Case-insensitive globbing (used in pathname expansion)
  shopt -s nocaseglob

  # Append to the Bash history file, rather than overwriting it
  shopt -s histappend

  # Autocorrect typos in path names when using `cd`
  shopt -s cdspell

  # Enable some Bash 4 features when possible:
  # * `autocd`, e.g. `**/qux` will enter `./foo/bar/baz/qux`
  # * Recursive globbing, e.g. `echo **/*.txt`
  for option in autocd globstar; do
    shopt -s "$option" 2> /dev/null
  done

  # If possible, add tab completion for many more commands
  if [ -f /etc/bash_completion ]; then
    source /etc/bash_completion
  fi

  # If possible, add tab completion for many more commands (homebrew version)
  if [ -f $(brew --prefix)/etc/bash_completion ]; then
    source $(brew --prefix)/etc/bash_completion
  fi
fi

# Add tab completion for many Bash commands
if which brew > /dev/null && [ -f "$(brew --prefix)/share/bash-completion/bash_completion" ]; then
  source "$(brew --prefix)/share/bash-completion/bash_completion";
elif [ -f /etc/bash_completion ]; then
  source /etc/bash_completion;
fi;

# Prefer US English and use UTF-8
export LC_ALL="en_US.UTF-8"
export LANG="en_US"

# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
if [ -e "$HOME/.ssh/config" ]; then
  complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2- | tr ' ' '\n')" scp sftp ssh;
fi

# Enable node version manager completion
if [[ -r $NVM_DIR/bash_completion ]]; then
  . $NVM_DIR/bash_completion
fi

# Loads nvm
if [ -f $(brew --prefix nvm)/nvm.sh ]; then
  source $(brew --prefix nvm)/nvm.sh
fi


# Add tab completion for `defaults read|write NSGlobalDomain`
# You could just use `-g` instead, but I like being explicit
# complete -W "NSGlobalDomain" defaults;

# Add `killall` tab completion for common apps
# complete -o "nospace" -W "Contacts Calendar Dock Finder Mail Safari Chrome iTunes SystemUIServer Terminal iTerm" killall;

# Load RVM into a shell session as a function
if [[ -s "$HOME/.rvm/scripts/rvm" ]]; then
  source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
fi


# zsh settings
if [ -n "$ZSH_VERSION" ]; then
  # a better default theme
  ZSH_THEME="mh"

  # Uncomment the following line to display red dots whilst waiting for completion.
  COMPLETION_WAITING_DOTS="true"

  # Uncomment the following line if you want to change the command execution time
  # stamp shown in the history command output.
  # The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
  HIST_STAMPS="mm/dd/yyyy"

  plugins=(git brew npm bash z)

  source $ZSH/oh-my-zsh.sh

  source ~/.oh-my-zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

  # load user specific settings for zsh
  if [ -r "~/.zsh_extras" ]; then
    source ~/.zsh_extras
  fi
elif [ -n "$BASH_VERSION" ]; then

  # This loads Rupa's z if installed. It's only needed for bash
  # because zsh already has a plugin for it
  if command -v brew >/dev/null 2>&1; then
    if [ -f $(brew --prefix)/etc/profile.d/z.sh ]; then
      source $(brew --prefix)/etc/profile.d/z.sh
    fi
  fi

  # Enable git completion
  if [ -f $HOME/.git_completion.sh ]; then
    source $HOME/.git_completion.sh
  fi

  # Enable tab completion for `g` by marking it as an alias for `git`
  if type _git &> /dev/null && [ -f /usr/local/etc/bash_completion.d/git-completion.bash ]; then
    complete -o default -o nospace -F _git g;
  fi;


  # load user specific settings for bash
  if [ -r "~/.bash_extras" ]; then
    source ~/.bash_extras
  fi
fi