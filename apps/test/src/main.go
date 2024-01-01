package main

import (
	"fmt"

	"github.com/gpt-next/monorepo/apps/test2/src/model"
	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
	fmt.Printf("test: Hello World!")
	model := model.Model{
		Name: "test",
	}

	fmt.Print(model)
}
