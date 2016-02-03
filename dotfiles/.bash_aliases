# Easier navigation: .., ..., ...., ..... and --
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ~="cd ~" # `cd` is probably faster to type though
alias -- -="cd -"

# Prevent common typos
alias cd..="cd .."

# Shortcuts
alias dr="cd ~/Documents/Dropbox"
alias dt="cd ~/Desktop"
alias dl="cd ~/Downloads"
alias p="cd ~/projects"
alias g="git"
alias h="history"
alias j="jobs"


# Always use color output for `ls`
if [[ "$OSTYPE" =~ ^darwin ]]; then
  alias ls="command ls -G"
else
  alias ls="command ls --color"
  export LS_COLORS='no=00:fi=00:di=01;34:ln=01;36:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.gz=01;31:*.bz2=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.avi=01;35:*.fli=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.ogg=01;35:*.mp3=01;35:*.wav=01;35:'
fi

# List all files colorized in long format, with human readable file sizes and appended slashed to folders
alias l="ls -Glaph"

# List all files colorized in long format, including dot files
alias la="ls -laF ${colorflag}"

# List only directories
alias lsd="ls -lF ${colorflag} | grep --color=never '^d'"

# Get week number
alias week='date +%V'

# Stopwatch
alias timer='echo "Timer started. Stop with Ctrl-D." && date && time cat && date'

# Recursively delete `.pyc` files
alias rmpyc="find . -type f -name '*.pyc' -ls -delete"

# Recursively delete `.DS_Store` files
alias cleanup="find . -type f -name '*.DS_Store' -ls -delete"

# Empty the Trash on all mounted volumes and the main HDD
# Also, clear Apple's System Logs to improve shell startup speed
alias emptytrash="sudo rm -rfv /Volumes/*/.Trashes; sudo rm -rfv ~/.Trash; sudo rm -rfv /private/var/log/asl/*.asl"

# Enable aliases to be sudo'ed
alias sudo='sudo '

# Gzip-enabled `curl`
alias gurl='curl --compressed'

# updates system
alias update-system="sudo softwareupdate -i -a;"

# better update for brew
alias update-brew="brew update; brew upgrade --all; brew cleanup; brew cask cleanup;"

# updates npm globaly and npm packages
alias update-npm="npm install npm@latest -g; npm update -g;"

# updates gems
alias update-gem="sudo gem update --system; sudo gem update"

# Get OS X Software Updates, and update installed Ruby gems, Homebrew, npm, and their installed packages
alias update-all="update-system update-brew update-npm update-gem"

# Runs the dev setup script to ensure the latest tools have been added to your computer
alias update-setup="curl -L http://labs.shop.com/architecture/_dev-setup/setup.sh | sh"

# IP addresses
alias ip="ifconfig | grep -o '^\s*inet\s[0-9\.]*\b' | grep -v '127.0.0.1' | grep -oE -m 1 '(\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b)'"
alias ips="ifconfig -a | grep -o 'inet6\? \(\([0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+\)\|[a-fA-F0-9:]\+\)' | sed -e 's/inet6* //'"
alias localip="ipconfig getifaddr en1"

alias speedtest="ping -c 10 www.apple.com"

# Enhanced WHOIS lookups
alias whois="whois -h whois-servers.net"

# Flush Directory Service cache
alias flush="dscacheutil -flushcache"

# Clean up LaunchServices to remove duplicates in the “Open With” menu
alias lscleanup="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder"

# View HTTP traffic
alias sniff="sudo ngrep -d 'en1' -t '^(GET|POST) ' 'tcp and port 80'"
alias httpdump="sudo tcpdump -i en1 -n -s 0 -w - | grep -a -o -E \"Host\: .*|GET \/.*\""

# @note { This has been turned into a function and moved to `.bash_functions` }
alias showhidden="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hidehidden="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"

# @note { This has been turned into a function and moved to `.bash_functions` }
alias hidedesktop="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showdesktop="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

#  Merge PDF files
#  ```
#  mergepdf -o output.pdf input{1,2,3}.pdf
#  ```
alias mergepdf='/System/Library/Automator/Combine\ PDF\ Pages.action/Contents/Resources/join.py'

# This has been turned into a function and moved to `.bash_functions`
# alias spotoff="sudo mdutil -a -i off" # Disable Spotlight
# alias spoton="sudo mdutil -a -i on" # Enable Spotlight

# PlistBuddy alias, because sometimes `defaults` just doesn't cut it
alias plistbuddy="/usr/libexec/PlistBuddy"

#
# Ring the terminal bell, and put a badge on Terminal.app's Dock icon
# (useful when executing time-consuming commands)
alias badge="tput bel"

# Intuitive map function
# For example, to list all directories that contain a certain file:
# ```
# find . -name .gitattributes | map dirname
# ```
alias map="xargs -n1"

# One of @janmoesen's ProTip™s
for method in GET HEAD POST PUT DELETE TRACE OPTIONS; do
 alias "$method"="lwp-request -m '$method'"
done

# Make Grunt print stack traces by default
command -v grunt > /dev/null && alias grunt="grunt --stack"

# Stuff I never really use but cannot delete either because of http://xkcd.com/530/
alias stfu="osascript -e 'set volume output muted true'"
alias pumpitup="osascript -e 'set volume 7'"

# Kill all the tabs in Chrome to free up memory
# [C] explained: http://www.commandlinefu.com/commands/view/402/exclude-grep-from-your-grepped-output-of-ps-alias-included-in-description
alias chromekill="ps ux | grep '[C]hrome Helper --type=renderer' | grep -v extension-process | tr -s ' ' | cut -d ' ' -f2 | xargs kill"

# This will open chrome without the dumb ass web security issue. aka: allows you to use ajax without it running on a server
alias openchrome="open -a Google\ Chrome --args --disable-web-security -–allow-file-access-from-files"

# Lock the screen (when going AFK)
alias afk="/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend"

# Reload the shell (i.e. invoke as a login shell)
alias reload="exec $SHELL -l"

# Refresh the shell (i.e. reloads ~/.bashrc &&)
alias refresh="source ~/.bashrc && source ~/.bash_profile"

# This will display a list of the menu icons that start on load
alias menubarIcons="defaults read com.apple.systemuiserver menuExtras"

# Enable aliases to be brew'ed
alias brew='brew '

# Enable aliases to be cask'ed. (For brew)
alias bcask='brew cask ' # if you install `brew install cask` you might want to comment this out
alias bcc='brew cask ' # couldn't go with `bc` because it's already used

# Shortened `cask search` used with brew like this `brew cs <app-you-are-looking-for>` (for brew)
alias bcl="bcc list"
alias bcs="bcc search"
alias bcf="bcc info"
alias bci="bcc install"
alias bcui="bcc uninstall"


# this is for the /bin/mount.sh for connecting to the shares
alias mount="~/bin/mount.sh"

# shortcut for coldfusion commands
if [ -e "~/Applications/ColdFusion*/cfusion/bin/coldfusion" &> /dev/null ]; then
  alias coldfusion="sudo /Applications/ColdFusion11/cfusion/bin/coldfusion"
  alias cf="coldfusion"
fi

if [ $(which apachectl) &> /dev/null ]; then
  # shortcut for apache commands
  alias apache="sudo apachectl"
fi