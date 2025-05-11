package config

import "os"

type Config struct {
	JWTKey     string
	DBUser     string
	DBPassword string
	DBHost     string
	DBPort     string
	DBName     string
}

func NewConfig() *Config {
	cfg := &Config{
		JWTKey:     "default",
		DBUser:     "postgres",
		DBPassword: "password",
		DBHost:     "localhost",
		DBPort:     "5432",
		DBName:     "plantdiary",
	}

	// Override with environment variables if set
	if jwtKey := os.Getenv("JWT_KEY"); jwtKey != "" {
		cfg.JWTKey = jwtKey
	}
	if dbUser := os.Getenv("DB_USER"); dbUser != "" {
		cfg.DBUser = dbUser
	}
	if dbPassword := os.Getenv("DB_PASSWORD"); dbPassword != "" {
		cfg.DBPassword = dbPassword
	}
	if dbHost := os.Getenv("DB_HOST"); dbHost != "" {
		cfg.DBHost = dbHost
	}
	if dbPort := os.Getenv("DB_PORT"); dbPort != "" {
		cfg.DBPort = dbPort
	}
	if dbName := os.Getenv("DB_NAME"); dbName != "" {
		cfg.DBName = dbName
	}

	return cfg
}
