package main

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/max-weis/plantdiary/auth"
	"github.com/max-weis/plantdiary/internal/config"
	"github.com/max-weis/plantdiary/internal/database"
	"github.com/max-weis/plantdiary/internal/http"
)

type app struct {
	cfg *config.Config
	db  *sqlx.DB
	e   *echo.Echo
}

func NewApp(cfg *config.Config) (*app, error) {
	db, err := database.NewDatabase(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	e := http.NewEcho(db)

	auth.NewAuthRouter(cfg, e)

	return &app{
		cfg: cfg,
		db:  db,
		e:   e,
	}, nil
}

func (a *app) Run() error {
	return a.e.Start(":8000")
}
