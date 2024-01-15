package main

import (
	"fmt"
	"time"

	"github.com/gpt-next/monorepo/apps/test2/src/model"
	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
	fmt.Printf("test: Hello Chris! Updated")
	model := model.Model{
		Name: "test",
	}

	fmt.Print(model)
	time.Sleep(24 * time.Hour)
}
