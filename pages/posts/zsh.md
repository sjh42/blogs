---
title: Ubuntu 20.04LTS 下安装oh-my-zsh
date: 2021-07-26
duration: 5min
---

<Note desc="提示" color="border-yellow-400" icon-bg="bg-yellow-400">
  <template #title>
    spaceship主题安装还需要下载主题，看注意事项！！
  </template>
</Note>

## 检查当前可用shell

```shell
cat /etc/shell
```

## 查看当前使用的shell

```shell
echo $SHELL
```

## 安装zsh

```shell
sudo apt install zsh
```

## 安装oh-my-zsh

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 配置zsh

```shell
vim ~/.zshrc
```
### 使用spaceship主题

```bash
ZSH_THEME="spaceship"
```
### 添加插件

```bash
plugins=(
  git
  dotenv
)
```
## 更新设置

```bash
source ~/.zshrc
```

## 注意事项

### 使用spaceship主题

```shell
# first
git clone https://github.com/spaceship-prompt/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1
# second
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
# third
source ~/.zshrc
```
