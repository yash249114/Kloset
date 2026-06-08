package utils

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// Pagination holds pagination parameters
type Pagination struct {
	Page    int
	PerPage int
	Offset  int
}

// ParsePagination extracts page and per_page from query params
func ParsePagination(c *fiber.Ctx) Pagination {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "20"))

	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 20
	}
	if perPage > 100 {
		perPage = 100
	}

	return Pagination{
		Page:    page,
		PerPage: perPage,
		Offset:  (page - 1) * perPage,
	}
}
