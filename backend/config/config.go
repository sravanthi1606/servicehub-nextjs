package config

import (
	"os"

	"github.com/joho/godotenv"
)

func LoadConfig() error {
	return godotenv.Load()
}

func GetMongoURI() string {
	return os.Getenv("MONGO_URI")
}

func GetDBName() string {
	return os.Getenv("DB_NAME")
}

func GetPort() string {
	return os.Getenv("PORT")
}
