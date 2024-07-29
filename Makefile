all: build

live:base
	@ cd base && npm run dev

build:
	@ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash  
	@ nvm install 20.16.0  
	@ npm install playwright  
	@ npm install express
	@ npm install http-server
	@ npm install --save-dev vite
	@ npx playwright install  
	@ npm install
	@ cd lib && npm install
	@ cd base && npm install

clean:
	@rm -rf .git .gitignore README.md

up:
	@git pull
	@git status

history:
	@git log