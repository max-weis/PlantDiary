package database

import (
	"context"
	"database/sql"
	"embed"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jmoiron/sqlx"
	"github.com/max-weis/plantdiary/internal/config"
)

//go:embed schemas/*.sql
var schemaFS embed.FS

func NewDatabase(cfg *config.Config) (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName))
	if err != nil {
		return nil, err
	}

	if err := runMigrations(db.DB); err != nil {
		return nil, err
	}

	return db, nil
}

func runMigrations(db *sql.DB) error {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("create Postgres driver: %w", err)
	}

	d, err := iofs.New(schemaFS, "schemas")
	if err != nil {
		return fmt.Errorf("create iofs source driver: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", d, "postgres", driver)
	if err != nil {
		return fmt.Errorf("initiale migration instance: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("apply migrations: %w", err)
	}

	return nil
}

type dbKeyType string

const dbKey dbKeyType = "db"

// AddToContext adds the database to the context
func AddToContext(ctx context.Context, db *sqlx.DB) context.Context {
	return context.WithValue(ctx, dbKey, db)
}

// FromContext returns the database from the context
func FromContext(ctx context.Context) *sqlx.DB {
	db, ok := ctx.Value(dbKey).(*sqlx.DB)
	if !ok {
		panic("database not found in context")
	}
	return db
}
