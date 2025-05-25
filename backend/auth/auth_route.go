//go:generate go tool oapi-codegen --config=oapi-config.yaml api.yaml
package auth

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/max-weis/plantdiary/internal/config"
	"golang.org/x/crypto/bcrypt"
)

type authRouter struct {
	jwtKey []byte
}

type claims struct {
	UserID string `json:"user_id"`
	Username string `json:"username"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// Login signs up a user and returns a JWT in a cookie
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

	// Create access token
	accessExp := time.Now().Add(15 * time.Minute)
	accessClaims := &claims{
		UserID: user.ID,
		Email:  user.Email,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessExp),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(a.jwtKey)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to create access token")
	}

	// Create refresh token
	refreshToken := uuid.New().String()
	refreshExp := time.Now().Add(7 * 24 * time.Hour) // 7 days
	refreshTokenEntity := &refreshTokenEntity{
		Token:     refreshToken,
		UserID:    user.ID,
		ExpiresAt: refreshExp,
	}
	if err := StoreRefreshToken(ctx.Request().Context(), refreshTokenEntity); err != nil {
		return echo.NewHTTPError(500, "Failed to store refresh token")
	}

	// Set access token cookie
	cookie := new(http.Cookie)
	cookie.Name = "access_token"
	cookie.Value = accessTokenString
	cookie.Expires = accessExp
	cookie.HttpOnly = true
	cookie.Secure = true
	cookie.SameSite = http.SameSiteStrictMode
	ctx.SetCookie(cookie)

	// Set refresh token cookie
	refreshCookie := new(http.Cookie)
	refreshCookie.Name = "refresh_token"
	refreshCookie.Value = refreshToken
	refreshCookie.Expires = refreshExp
	refreshCookie.HttpOnly = true
	refreshCookie.Secure = true
	refreshCookie.SameSite = http.SameSiteStrictMode
	ctx.SetCookie(refreshCookie)

	return ctx.JSON(200, TokenResponse{
		AccessToken:  &accessTokenString,
		RefreshToken: &refreshToken,
	})
}

// RefreshToken refreshes an access token using a refresh token
func (a *authRouter) RefreshToken(ctx echo.Context) error {
	refreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		return echo.NewHTTPError(401, "No refresh token")
	}

	// Get refresh token from database
	rt, err := GetRefreshToken(ctx.Request().Context(), refreshToken.Value)
	if err != nil {
		return echo.NewHTTPError(401, "Invalid refresh token")
	}

	// Get user
	user, err := GetUserByID(ctx.Request().Context(), rt.UserID)
	if err != nil {
		return echo.NewHTTPError(404, "User not found")
	}

	// Create new access token
	accessExp := time.Now().Add(15 * time.Minute)
	accessClaims := &claims{
		UserID: user.ID,
		Email:  user.Email,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessExp),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(a.jwtKey)
	if err != nil {
		return echo.NewHTTPError(500, "Failed to create access token")
	}

	// Set new access token cookie
	cookie := new(http.Cookie)
	cookie.Name = "access_token"
	cookie.Value = accessTokenString
	cookie.Expires = accessExp
	cookie.HttpOnly = true
	cookie.Secure = true
	cookie.SameSite = http.SameSiteStrictMode
	ctx.SetCookie(cookie)

	return ctx.JSON(200, TokenResponse{
		AccessToken: &accessTokenString,
	})
}

// Logout invalidates a refresh token
func (a *authRouter) Logout(ctx echo.Context) error {
	refreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		return echo.NewHTTPError(401, "No refresh token")
	}

	if err := DeleteRefreshToken(ctx.Request().Context(), refreshToken.Value); err != nil {
		return echo.NewHTTPError(500, "Failed to delete refresh token")
	}

	// Clear cookies
	ctx.SetCookie(&http.Cookie{
		Name:     "access_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
	ctx.SetCookie(&http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	return ctx.NoContent(200)
}

// Signup creates a new user
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
		Username:     req.Username,
		PasswordHash: string(hashedPassword),
	}

	if err := CreateUser(ctx.Request().Context(), &user); err != nil {
		if err == ErrEmailAlreadyExists {
			return echo.NewHTTPError(409, "Email already in use")
		}
		if err == ErrUsernameAlreadyExists {
			return echo.NewHTTPError(409, "Username already in use")
		}
		return echo.NewHTTPError(500, "Failed to create user")
	}

	return ctx.NoContent(201)
}

func NewAuthRouter(cfg *config.Config, e *echo.Echo) ServerInterface {
	ar := &authRouter{jwtKey: []byte(cfg.JWTKey)}
	RegisterHandlers(e, ar)
	return ar
}
