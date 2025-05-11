//go:generate go tool oapi-codegen --config=oapi-config.yaml api.yaml
package auth

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/max-weis/plantdiary/internal/config"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"golang.org/x/crypto/bcrypt"
)

type authRouter struct {
	jwtKey []byte
}

type claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// Login implements ServerInterface.
func (a *authRouter) Login(ctx echo.Context) error {
	var req LoginRequest
	if err := ctx.Bind(&req); err != nil {
		return echo.NewHTTPError(400, "Invalid request body")
	}

	// Get user from database
	user, err := GetUserByEmail(ctx.Request().Context(), string(req.Email))
	if err != nil {
		return echo.NewHTTPError(404, "User not found")
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return echo.NewHTTPError(401, "Invalid credentials")
	}

	// Create JWT
	exp := time.Now().Add(24 * time.Hour)
	claims := &claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tString, err := token.SignedString(a.jwtKey)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to create JWT")
	}

	// create cookie
	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = tString
	cookie.Expires = exp
	ctx.SetCookie(cookie)

	return ctx.JSON(200, nil)
}

func (a *authRouter) Signup(ctx echo.Context) error {
	var req SignupRequest
	if err := ctx.Bind(&req); err != nil {
		return echo.NewHTTPError(400, "Invalid request body")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to hash password")
	}

	user := userEntity{
		ID:           uuid.New().String(),
		Email:        string(req.Email),
		PasswordHash: string(hashedPassword),
	}

	if err := CreateUser(ctx.Request().Context(), &user); err != nil {
		return echo.NewHTTPError(500, "Failed to create user")
	}

	// TODO: Save user to database
	// For now return mock response
	return ctx.JSON(201, nil)
}

// Me implements ServerInterface.
func (a *authRouter) Me(ctx echo.Context) error {
	// Get token from cookie
	cookie, err := ctx.Cookie("token")
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Not authenticated")
	}

	// Parse and validate token
	token, err := jwt.ParseWithClaims(cookie.Value, &claims{}, func(token *jwt.Token) (interface{}, error) {
		return a.jwtKey, nil
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token")
	}

	// Get claims
	claims, ok := token.Claims.(*claims)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token claims")
	}

	// Get user from database
	user, err := GetUserByID(ctx.Request().Context(), claims.UserID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	// Parse UUID
	parsedUUID, err := uuid.Parse(user.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Invalid user ID format")
	}

	// Convert to OpenAPI types
	userID := openapi_types.UUID(parsedUUID)
	userEmail := openapi_types.Email(user.Email)

	// Return user info
	return ctx.JSON(http.StatusOK, User{
		Id:    &userID,
		Email: &userEmail,
	})
}

func NewAuthRouter(cfg *config.Config, e *echo.Echo) ServerInterface {
	ar := &authRouter{jwtKey: []byte(cfg.JWTKey)}
	RegisterHandlers(e, ar)
	return ar
}
