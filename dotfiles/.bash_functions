# Simple calculator
function calc() {
  local result="";
  result="$(printf "scale=10;$*\n" | bc --mathlib | tr -d '\\\n')";
  #                       └─ default (when `--mathlib` is used) is 20
  #
  if [[ "$result" == *.* ]]; then
    # improve the output for decimal numbers
    printf "$result" |
    sed -e 's/^\./0./'        `# add "0" for cases like ".5"` \
        -e 's/^-\./-0./'      `# add "0" for cases like "-.5"`\
        -e 's/0*$//;s/\.$//';  # remove trailing zeros
  else
    printf "$result";
  fi;
  printf "\n";
}

# Create a new directory and enter it
function mkd() {
  mkdir -p "$@" && cd "$_";
}

# Determine size of a file or total size of a directory
function fs() {
  if du -b /dev/null > /dev/null 2>&1; then
    local arg=-sbh;
  else
    local arg=-sh;
  fi
  if [[ -n "$@" ]]; then
    du $arg -- "$@";
  else
    du $arg .[^.]* *;
  fi;
}



# Use Git's colored diff when available
hash git &>/dev/null
if [ $? -eq 0 ]; then
  function diff() {
    git diff --no-index --color-words "$@"
  }
fi

# Create a data URL from a file
function dataurl() {
  local mimeType=$(file -b --mime-type "$1");
  if [[ $mimeType == text/* ]]; then
    mimeType="${mimeType};charset=utf-8";
  fi
  echo "data:${mimeType};base64,$(openssl base64 -in "$1" | tr -d '\n')";
}

# Create a git.io short URL
function gitio() {
  if [ -z "${1}" -o -z "${2}" ]; then
    echo "Usage: \`gitio slug url\`";
    return 1;
  fi;
  curl -i http://git.io/ -F "url=${2}" -F "code=${1}";
}

# Start an HTTP server from a directory, optionally specifying the port
function server() {
  local port="${1:-8000}";
  sleep 1 && open "http://localhost:${port}/" &
  # Set the default Content-Type to `text/plain` instead of `application/octet-stream`
  # And serve everything as UTF-8 (although not technically correct, this doesn’t break anything for binary files)
  python -c $'import SimpleHTTPServer;\nmap = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map;\nmap[""] = "text/plain";\nfor key, value in map.items():\n\tmap[key] = value + ";charset=UTF-8";\nSimpleHTTPServer.test();' "$port";
}

# Compare original and gzipped file size
function gz() {
  local origsize=$(wc -c < "$1");
  local gzipsize=$(gzip -c "$1" | wc -c);
  local ratio=$(echo "$gzipsize * 100 / $origsize" | bc -l);
  printf "orig: %d bytes\n" "$origsize";
  printf "gzip: %d bytes (%2.2f%%)\n" "$gzipsize" "$ratio";
}


# Test if HTTP compression (RFC 2616 + SDCH) is enabled for a given URL.
# Send a fake UA string for sites that sniff it instead of using the Accept-Encoding header. (Looking at you, ajax.googleapis.com!)
function httpcompression() {
  encoding="$(curl -LIs -H 'User-Agent: Mozilla/5 Gecko' -H 'Accept-Encoding: gzip,deflate,compress,sdch' "$1" | grep '^Content-Encoding:')" && echo "$1 is encoded using ${encoding#* }" || echo "$1 is not using any encoding"
}


# Gzip-enabled `curl`
function gurl() {
  curl -sH "Accept-Encoding: gzip" "$@" | gunzip
}


# Syntax-highlight JSON strings or files
# Usage: `json '{"foo":42}'` or `echo '{"foo":42}' | json`
function json() {
  if [ -t 0 ]; then # argument
    python -mjson.tool <<< "$*" | pygmentize -l javascript;
  else # pipe
    python -mjson.tool | pygmentize -l javascript;
  fi;
}


# Run `dig` and display the most useful info
function digga() {
  dig +nocmd "$1" any +multiline +noall +answer;
}


# UTF-8-encode a string of Unicode symbols
function escape() {
  printf "\\\x%s" $(printf "$@" | xxd -p -c1 -u);
  # print a newline unless we’re piping the output to another program
  if [ -t 1 ]; then
    echo ""; # newline
  fi;
}


# Decode \x{ABCD}-style Unicode escape sequences
function unidecode() {
  perl -e "binmode(STDOUT, ':utf8'); print \"$@\"";
  # print a newline unless we’re piping the output to another program
  if [ -t 1 ]; then
    echo ""; # newline
  fi;
}


# Get a character’s Unicode code point
function codepoint() {
  perl -e "use utf8; print sprintf('U+%04X', ord(\"$@\"))";
  # print a newline unless we’re piping the output to another program
  if [ -t 1 ]; then
    echo ""; # newline
  fi;
}


# Show all the names (CNs and SANs) listed in the SSL certificate
# for a given domain
function getcertnames() {
  if [ -z "${1}" ]; then
    echo "ERROR: No domain specified.";
    return 1;
  fi;

  local domain="${1}";
  echo "Testing ${domain}…";
  echo ""; # newline

  local tmp=$(echo -e "GET / HTTP/1.0\nEOT" \
   | openssl s_client -connect "${domain}:443" -servername "${domain}" 2>&1);

  if [[ "${tmp}" = *"-----BEGIN CERTIFICATE-----"* ]]; then
    local certText=$(echo "${tmp}" \
      | openssl x509 -text -certopt "no_aux, no_header, no_issuer, no_pubkey, \
      no_serial, no_sigdump, no_signame, no_validity, no_version");
    echo "Common Name:";
    echo ""; # newline
    echo "${certText}" | grep "Subject:" | sed -e "s/^.*CN=//" | sed -e "s/\/emailAddress=.*//";
    echo ""; # newline
    echo "Subject Alternative Name(s):";
    echo ""; # newline
    echo "${certText}" | grep -A 1 "Subject Alternative Name:" \
      | sed -e "2s/DNS://g" -e "s/ //g" | tr "," "\n" | tail -n +2;
    return 0;
  else
    echo "ERROR: Certificate not found.";
    return 1;
  fi;
}


# `tre` is a shorthand for `tree` with hidden files and color enabled, ignoring
# the `.git` directory, listing directories first. The output gets piped into
# `less` with options to preserve color and line numbers, unless the output is
# small enough for one screen.
function tre() {
  tree -aC -I '.git|node_modules|bower_components' --dirsfirst "$@" | less -FRNX;
}


# This was shamelessly copied from [Dave](https://gist.github.com/davejamesmiller/1965569)
# and then modified.
function ask() {
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
    read -p "$1 [$prompt] " REPLY
    # Default?
    [ -z "$REPLY" ] && REPLY=$default
    echo "$REPLY"
    # if [ -z "$REPLY" ]; then
    #  REPLY=$default
    # fi
    echo "?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?/?"
    # Check if the reply is valid
    case "$REPLY" in
      Y*|y*) return 0 ;;
      N*|n*) return 1 ;;
    esac
  done
}

# @author Tyler Benton
# @description Show/hide hidden files in Finder
# @args {boolean}
function hidden() {
  defaults write com.apple.finder AppleShowAllFiles -bool $([[ $@ == *t* ]] && true || false) && killall Finder
}

# @author Tyler Benton
# @description Hide/show all desktop icons (useful when presenting)
# @args {'show', 'hide'}
function desktop() {
  defaults write com.apple.finder CreateDesktop -bool $([[ $@ == *sho* ]] && true || false) && killall Finder
}

# Disables/Enables spotlight
# @args {'disable', 'enable'}
function spot() {
  sudo mdutil -a -i $([[ $@ == *dis* ]] && off || on)
}

# This unlocks stubborn files that say they are locked.
function unlock() {
  chflags nouchg "$@"
}

# Force remove stubborn files
function remove() {
  ask "Are you sure you want to permanently delete $(\n) $(cd $@ && echo ${PWD})" N && echo "$@ will be removed" || echo "$@ will **not** be removed"
  # sudo rm -R "$@"
}


# @author Tyler Benton
function lucee() {
  servername="name='styleguide.local'"
  workingdirectory="$(pwd | grep -oE 'site.*')"
  directory="directory='/Users/$(whoami)/Sites/styleguide.local/'"
  if [ $1 = 'help' ]; then # show how to use this function
    echo '
      Usage:
      lucee help                    Show this help message
      lucee start                   Start a lucee sever for `the styleguide.local`
      lucee stop                    Stop the `styleguide.local` server
      lucee url                     Print out the url
      lucee open <all|browserlist>  Open the url in your default browser if no argumentst are passed,
                                    in `all` avaliable browsers, or pass a list specific browsers

      Examples:
      lucee open # will open your default browser
      lucee open all # opens all available browsers
      lucee open firefox chrome opera # opens firefox chrome and opera
    '
  elif [ $1 = 'start' ]; then # start the server
    host=$(ip)
    if [ ! -z "$2" ]; then
      host=$2
    fi
    box server start $servername host=$host port=8000 $directory force=true openbrowser=false
    timeout 10s
    lucee open # this is a better open command than box has
  elif [ $1 = 'stop' ]; then # stop the server
    box server stop $servername --forget
  elif [ $1 = 'restart' ]; then # restart the server
    box server restart $servername
  elif [ $1 = 'url' ]; then # print the url to the stdout
    echo http://$(ip).xip.io:8000/$workingdirectory
  elif [ $1 = 'open' ]; then
    # check to see if second argument was passed
    if [ ! -z "$2" ]; then
      # Open the url in all the browsers
      if [ $2 = 'all' ]; then
        ls /Applications | grep -oEi '(.*(?:chrome|firefox|opera|internet|edge)[^.]*)' | while read -r line; do
          open -a $line $(lucee url)
        done
      else
        # loop over all the passed browsers and open them
        for browser in "${@:2}"; do
          if [ $browser = 'chrome' ]; then # Open Google Chrome
            open -a 'Google Chrome' $(lucee url)
          elif [ $browser = 'canary' ]; then # open canary
            open -a 'Google Chrome Canary' $(lucee url)
          else # the passed browser
            open -a "$(python -c "print '$browser'.title()")" $(lucee url)
          fi
        done
      fi
    else # open the url with the default browser
      open $(lucee url)
    fi
  else # run what ever is passed
    box server $@ $servername
  fi
}
