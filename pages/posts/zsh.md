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

| Method | Command |
| ----------- | ----------- |
| curl | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" |
| wget | sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" |
| fetch | sh -c "$(fetch -o - https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" |

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

### 字体
如果使用了spaceship主题，无法显示图标请先安装[Nerd Fonts字体](https://github.com/ryanoasis/nerd-fonts/blob/master/readme_cn.md#option-4-homebrew-fonts)


## mac配置golang的环境变量

安装了brew可以直接输入一下指令

```shell
brew install go
```

然后需要设置GOROOT，GOPATH，PATH这三个环境变量，所以直接在~/.zshrc中写

```shell
export GOROOT = /usr/local/Cellar/go/1.19.4/libexec/
export GOPATH = $HOME/go
export PATH = $GOROOT/bin:$GOPATH/bin:$PATH
```
最后 source ~/.zshrc

GOROOT路径是go的安装路径，一般是/usr/local/go或者 /usr/local/Cellar/go，如果不知道是安装到了哪个目录可以通过brew list go来查看。

GOPATH是以后打算把包存放的路径，可以随便写一个自己想写的路径

将$GOPATH/bin加入 $PATH 变量，这样在终端的任何路径都能使用go包的bin目录下面的工具，不需要进入到bin目录或者指定目录，比较方便。
