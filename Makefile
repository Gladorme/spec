GO                    ?= go
CUE                   ?= cue
GOCI                  ?= golangci-lint
GOFMT                 ?= $(GO)fmt

.PHONY: checkformat
checkformat:
	@echo ">> Check Go code format"
	! $(GOFMT) -d $$(find . -name '*.go' -not -path "./ui/*" -print) | grep '^'

.PHONY: checkunused
checkunused:
	@echo ">> Check for unused/missing packages in go.mod"
	$(GO) mod tidy
	@git diff --exit-code -- go.sum go.mod

.PHONY: checkstyle
checkstyle:
	@echo ">> Check Go code style"
	$(GOCI) run --timeout 5m

.PHONY: go-test
go-test:
	@echo ">> Run all go tests"
	$(GO) test -count=1 -v ./...
