#!/bin/bash

# helpers
notify(){
 tput bel
}
error-message(){
 if ! [ $1 ]; then
  echo ""
  echo "!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!"
  echo ""
  echo $2
  echo ""
  echo "!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!/!"
  echo ""
  exit 2
 fi
}

color_reset=`tput sgr0`
color_black=`tput setaf 0`
color_red=`tput setaf 1`
color_green=`tput setaf 2`
color_yellow=`tput setaf 3`
color_blue=`tput setaf 4`
color_magenta=`tput setaf 5`
color_cyan=`tput setaf 6`


echo "Disabling .DS_Store on Network Shares..."
defaults write com.apple.desktopservices DSDontWriteNetworkStores true

# location for the shares to go
shares="/Users/${USER}/shares"

# ensures the directory shares exists
if [ ! -d $shares ]; then
 mkdir $shares
fi

# Get the user name
notify
read -p "User name: " username

# makes sure they entered a user name
error-message $username "Yo, you have to enter your user name"


# Get the network password
notify
read -p "Personal area: " personalarea

# makes sure they entered a password
error-message $personalarea "Yo, you have to enter your personalarea"


# Get the network password
notify
echo -n "Network password [secure]: "
read -s password
echo ""
echo ""

# makes sure they entered a password
error-message $password "Yo, you have to enter your password"

# clears the console

mafile="mafile01.maeagle.corp"
filesrv="filesrv01.maeagle.corp"
nasfiler="nasfiler01"

symlinks=()
paths=()

symlinks+=("home")
paths+=("${mafile}/home/${username}")

symlinks+=("common")
paths+=("${mafile}/common")

symlinks+=("depts")
paths+=("${mafile}/depts")

symlinks+=("mis")
paths+=("${mafile}/depts/MIS")

symlinks+=("adc")
paths+=("${mafile}/depts/MIS/ADC")

symlinks+=("per-review")
paths+=("${mafile}/depts/MIS/ADC/PeerReview")

symlinks+=("integrat-dev")
paths+=("${filesrv}/cfdev/unfranchise")

symlinks+=("integrat-dev")
paths+=("${filesrv}/cfdev/unfranchise")

symlinks+=("all-models")
paths+=("${filesrv}/model_stage")

symlinks+=("all-views")
paths+=("${filesrv}/view_stage")

symlinks+=("all-controllers")
paths+=("${filesrv}/controller_stage")

symlinks+=("my-model")
paths+=("${filesrv}/model_stage/${personalarea}")

symlinks+=("my-view")
paths+=("${filesrv}/view_stage/${personalarea}")

symlinks+=("my-controller")
paths+=("${filesrv}/controller_stage/${personalarea}")

symlinks+=("dev-ima-server")
paths+=("maimages-d01.maeagle.corp/unFranchise")

symlinks+=("staging-image-server")
paths+=("maimages-s01.maeagle.corp/unFranchise")

symlinks+=("live-image-server")
paths+=("maimages-p01.maeagle.corp/unFranchise")

symlinks+=("labs")
paths+=("${nasfiler}/wordpress_ma/labs")

symlinks+=("styleguide")
paths+=("${filesrv}/cfdev/styleguide")

length=${#symlinks[@]}

# echo
# loop over all the shares and mount them
# while [[ $run && $i -le $length ]]; do
for (( i=0;i<$length;i++)); do
 path=${paths[i]} # the path of the server
 symlink=${symlinks[i]} # the symlink the server is associated with

 echo -n "Mounting ${symlink}: ${path}..."

 # checks to see if it has already ben mounted
 if mount -t smbfs | grep -q $path; then
  echo "${color_blue} Already Mounted ${color_reset}"
 else

  # ensures there is a directory there
  if ! [ -d "${shares}/${symlink}" ]; then
   mkdir "${shares}/${symlink}"
  fi

  mount -t smbfs -o -s //MAEAGLE\;${username}:${password}@${path} ${shares}/${symlink}

  # double checks to make sure the server was mounted
  if [ $? -ne 0 ]; then # if the mount was unsuccessfull
   echo "${color_red} Failed ${color_reset}"
  else
   echo "${color_green} Success ${color_reset}"
  fi
 fi

 echo "" # ensures the next mount is on a new line
done