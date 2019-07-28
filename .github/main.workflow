workflow "Publish to NPM" {
  on = "push"
  resolves = ["Publish"]
}

action "Match only branches" {
  uses = "actions/bin/filter@0dbb077f64d0ec1068a644d25c71b1db66148a24"
  args = "tag v*"
}

action "Update version number in package.json" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Match only branches"]
  args = "npm --no-git-tag-version version from-git"
}

action "Install dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "clean-install"
  needs = [ "Update version number in package.json"]
}

action "Build library and run tests" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install dependencies"]
  args = "test"
}

action "Publish" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Build library and run tests"]
  args = "pack"
  secrets = ["NPM_AUTH_TOKEN"]
}
