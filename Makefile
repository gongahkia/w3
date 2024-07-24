all: build

build:
	@ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash  
	@ nvm install 20.16.0  
	@ npm install playwright  
	@ npx playwright install  

clean:
	@rm -rf .git .gitignore README.md

up:
	@git pull
	@git status

history:
	@git log