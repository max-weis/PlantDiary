package main

import (
	"log/slog"
	"os"

	"github.com/max-weis/plantdiary/internal/config"
)

func main() {
	cfg := config.NewConfig()
	app, err := NewApp(cfg)
	if err != nil {
		slog.Error("failed to create app", "error", err)
		os.Exit(1)
	}

	if err := app.Run(); err != nil {
		slog.Error("failed to run app", "error", err)
		os.Exit(1)
	}
}
