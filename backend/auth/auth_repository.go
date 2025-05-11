package auth

import (
	"context"
	"errors"

	"github.com/lib/pq"
	"github.com/max-weis/plantdiary/internal/database"
)

type userEntity struct {
	ID           string `db:"id"`
	Email        string `db:"email"`
	PasswordHash string `db:"password_hash"`
}

var (
	// ErrEmailAlreadyExists is returned when a user with the same email already exists
	ErrEmailAlreadyExists = errors.New("email already exists")
)

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, user *userEntity) error {
	_, err := database.FromContext(ctx).NamedExecContext(ctx, "INSERT INTO users (id, email, password_hash) VALUES (:id, :email, :password_hash)", user)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return ErrEmailAlreadyExists
		}

		return err
	}

	return nil
}

// GetUserByEmail gets a user from the database by email
func GetUserByEmail(ctx context.Context, email string) (*userEntity, error) {
	var user userEntity
	err := database.FromContext(ctx).GetContext(ctx, &user, "SELECT * FROM users WHERE email = $1", email)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUserByID gets a user from the database by ID
func GetUserByID(ctx context.Context, id string) (*userEntity, error) {
	var user userEntity
	err := database.FromContext(ctx).GetContext(ctx, &user, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
