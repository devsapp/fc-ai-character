SHELL := bash

.PHONY: help
help: ## 帮助文件
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-40s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: FORCE
FORCE:

.PHONY: dev
dev: ## 调试前端
	npm run dev

registry/src/code/index.html: $(shell find src -type f)
	npm run build

registry/src/code/index.js: index.js
	cp index.js registry/src/code/index.js

.PHONY: build
build: registry/src/code/index.html registry/src/code/index.js

.PHONY: test
test: build ## 模拟线上环境测试
	cd registry/src/code && \
	ENDPOINT="http://xxxxx" node index.js

.PHONY: registry
registry: build ## 发布到 Registry
	cd registry && \
	s registry publish





