package main

import (
	"fmt"
	"time"

	"github.com/rs/zerolog/log"
)

func main() {
	log.Info().Msg("Hello from Zerolog logger")
	fmt.Printf("test2: Hello World!! new v1.0.0-rc2")
	time.Sleep(24 * time.Hour)
}
