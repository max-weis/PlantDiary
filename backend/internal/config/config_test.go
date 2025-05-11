package config_test

import (
	"testing"

	"github.com/max-weis/plantdiary/internal/config"
	"github.com/stretchr/testify/assert"
)

func TestConfig(t *testing.T) {
	t.Setenv("JWT_KEY", "test")
	t.Setenv("DB_USER", "postgres")
	t.Setenv("DB_PASSWORD", "password")
	t.Setenv("DB_HOST", "localhost")
	t.Setenv("DB_PORT", "5432")
	t.Setenv("DB_NAME", "plantdiary")

	cfg := config.NewConfig()

	assert.Equal(t, &config.Config{
		JWTKey:     "test",
		DBUser:     "postgres",
		DBPassword: "password",
		DBHost:     "localhost",
		DBPort:     "5432",
		DBName:     "plantdiary",
	}, cfg)
}

func TestConfig_Default(t *testing.T) {
	cfg := config.NewConfig()

	assert.Equal(t, &config.Config{
		JWTKey:     "default",
		DBUser:     "postgres",
		DBPassword: "password",
		DBHost:     "localhost",
		DBPort:     "5432",
		DBName:     "plantdiary",
	}, cfg)
}
