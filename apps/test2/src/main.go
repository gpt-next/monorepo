package main

import (
	"time"

	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
	log.Info().Msg("test2: Hello World TEST")
	time.Sleep(24 * time.Hour)
}
