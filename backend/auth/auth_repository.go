package auth

import (
	"context"
	"errors"
	"time"

	"github.com/lib/pq"
	"github.com/max-weis/plantdiary/internal/database"
)

type userEntity struct {
	ID           string `db:"id"`
	Email        string `db:"email"`
	Username     string `db:"username"`
	PasswordHash string `db:"password_hash"`
}

type refreshTokenEntity struct {
	Token     string    `db:"token"`
	UserID    string    `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
	CreatedAt time.Time `db:"created_at"`
}

var (
	// ErrEmailAlreadyExists is returned when a user with the same email already exists
	ErrEmailAlreadyExists = errors.New("email already exists")
	// ErrUsernameAlreadyExists is returned when a user with the same username already exists
	ErrUsernameAlreadyExists = errors.New("username already exists")
)

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, user *userEntity) error {
	_, err := database.FromContext(ctx).NamedExecContext(ctx, "INSERT INTO users (id, email, username, password_hash) VALUES (:id, :email, :username, :password_hash)", user)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			// Check which constraint was violated
			if pqErr.Constraint == "users_email_key" {
				return ErrEmailAlreadyExists
			}
			if pqErr.Constraint == "users_username_key" {
				return ErrUsernameAlreadyExists
			}
			return ErrEmailAlreadyExists // Default to email error for backward compatibility
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

// GetUserByUsername gets a user from the database by username
func GetUserByUsername(ctx context.Context, username string) (*userEntity, error) {
	var user userEntity
	err := database.FromContext(ctx).GetContext(ctx, &user, "SELECT * FROM users WHERE username = $1", username)
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

// StoreRefreshToken stores a refresh token in the database
func StoreRefreshToken(ctx context.Context, token *refreshTokenEntity) error {
	_, err := database.FromContext(ctx).NamedExecContext(ctx,
		"INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (:token, :user_id, :expires_at)",
		token)
	return err
}

// GetRefreshToken gets a refresh token from the database
func GetRefreshToken(ctx context.Context, token string) (*refreshTokenEntity, error) {
	var rt refreshTokenEntity
	err := database.FromContext(ctx).GetContext(ctx, &rt,
		"SELECT * FROM refresh_tokens WHERE token = $1",
		token)
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

// DeleteRefreshToken deletes a refresh token from the database
func DeleteRefreshToken(ctx context.Context, token string) error {
	_, err := database.FromContext(ctx).ExecContext(ctx,
		"DELETE FROM refresh_tokens WHERE token = $1",
		token)
	return err
}
