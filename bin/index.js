#!/usr/bin/env node

const Fs = require('fs')
const OS = require('os')
const Path = require('path')
const app = require('commander')


const INIT_VIM = 'init.vim'
const ROOT_INIT_VIM = nvimConfigPath(INIT_VIM)

const NVIMRC_DIR = nvimConfigPath('nvimrc')
const NVIMRC_DIR_PROFILES = Path.join(NVIMRC_DIR, 'profiles')
const NVIMRC_NOT_FIRST_TIME = Path.join(NVIMRC_DIR, '.notfirsttime')


function main() {
  Fs.mkdirSync(NVIMRC_DIR_PROFILES, { recursive: true })

  app
    .argument('[name]')
    .action(function (config_name) {
      if (null == config_name) {
        return cmdShowMenu()
      }

      try {
        cmdUseConfig(config_name)
      } catch (err) {
        if (err && err.code === 'ENOENT') {
          console.error(`Couldn't find the nvimrc file: "${config_name}".`)
        } else {
          throw err
        }
      }
      
      return
    })
    .parse(process.argv)
}


function cmdShowMenu() {
  console.log('Available nvimrcs:')
  console.log()
  
  const current_config = currentConfigName()
  const config_files = availableConfigFiles(NVIMRC_DIR_PROFILES)

  for (const config of config_files) {
    if (current_config === config.name) {
      console.log('*', config.name)
    } else {
      console.log(' ', config.name)
    }
  }
}


function cmdUseConfig(new_config_name) {
  const new_config_path = Path.join(NVIMRC_DIR_PROFILES, new_config_name)

  if (!Fs.existsSync(new_config_path)) {
    const err = new Error()
    err.code = 'ENOENT'

    throw err
  }


  const old_config_name = currentConfigName()

  console.log(`Removing old ${INIT_VIM}` +
    `${null == old_config_name ? '' : ' (' + old_config_name + ')'}`)


  try {
    if (isFirstTime()) {
      markAsNotFirstTime()
      Fs.renameSync(ROOT_INIT_VIM, Path.join(NVIMRC_DIR, 'bk.' + INIT_VIM))
    } else {
      Fs.unlinkSync(ROOT_INIT_VIM)
    }
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      // NOTE: If we are here, then the init.vim file was not found.
      // We do nothing.
      //
    } else {
      throw err
    }
  }


  console.log(`Activating ${INIT_VIM} (${new_config_name})`)

  Fs.symlinkSync(new_config_path, ROOT_INIT_VIM)
}


function availableConfigFiles(dirpath) {
  return Fs
    .readdirSync(dirpath, {
      withFileTypes: true
    })
    .filter(dirent => dirent.isFile())
}


function isFirstTime() {
  return !Fs.existsSync(NVIMRC_NOT_FIRST_TIME)
}


function markAsNotFirstTime() {
  return Fs.writeFileSync(NVIMRC_NOT_FIRST_TIME, '1', 'utf-8')
}


function currentConfigName() {
  if (isFirstTime()) {
    return null
  }

  try {
    const init_vim_stat = Fs.statSync(ROOT_INIT_VIM)
    const config_files = availableConfigFiles(NVIMRC_DIR_PROFILES)

    for (const config of config_files) {
      const config_stat = Fs.statSync(Path.join(NVIMRC_DIR_PROFILES, config.name))
      const is_same = init_vim_stat.ino === config_stat.ino

      if (is_same) {
        return config.name
      }
    }
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return null
    }

    throw err
  }

  return null
}


function nvimConfigPath(path) {
  return Path.join(OS.homedir(), '/.config/nvim', path)
}


main()

