package main

import (
	"fmt"
	"time"

	"github.com/gpt-next/monorepo/apps/test2/src/model"
	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
	log.Info().Msg("test: Hello!! now")
	model := model.Model{
		Name: "test",
	}

	fmt.Print(model)
	time.Sleep(24 * time.Hour)
}
