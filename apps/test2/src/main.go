package main

import (
	"fmt"
	"time"

	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
	fmt.Printf("test2: Hello World!! updated")
	time.Sleep(24 * time.Hour)
}
